import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import {
  getAllQuestion,
  getCompanyById,
  submitAnswer,
  // submitAnswers,
} from "../../logics/action/company";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Paper,
  Container,
  LinearProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating, // Import MUI Rating component
} from "@mui/material";

const Questionaire = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth?.authData);
  const decodedToken: any = jwtDecode(token);
  const managerId = decodedToken.id;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status
  const [openDialog, setOpenDialog] = useState(false); // Track dialog state

  useEffect(() => {
    if (managerId) {
      dispatch(getCompanyById(managerId) as any);
    }
  }, [dispatch, managerId]);

  const companyInfo = useSelector(
    (state: any) => state.company?.companyData?.result
  );

  const companyId = companyInfo?.id;
  useEffect(() => {
    if (companyId) {
      dispatch(getAllQuestion(companyId) as any);
    }
  }, [dispatch, companyId]);

  const questions = useSelector(
    (state: any) => state.question?.questionDaata?.result || []
  );

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleOpenDialog(); // Trigger confirmation dialog on the last question
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true); // Open confirmation dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close confirmation dialog without submitting
  };

  const handleConfirmSubmit = () => {
    const payload = {
      companyId,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
    };
    dispatch(submitAnswer(payload) as any);
    setIsSubmitted(true); // Set submission status to true
    setOpenDialog(false); // Close the dialog
    console.log("payload:", payload);
  };

  const renderOptions = () => {
    if (currentQuestion?.type === "true_false") {
      return (
        <RadioGroup
          name={`question_${currentQuestion.id}`}
          value={answers[currentQuestion.id] || ""}
          onChange={(e) =>
            handleAnswerChange(currentQuestion.id, e.target.value)
          }
        >
          <FormControlLabel value="true" control={<Radio />} label="True" />
          <FormControlLabel value="false" control={<Radio />} label="False" />
        </RadioGroup>
      );
    }

    if (currentQuestion?.type === "multiple_choice") {
      return currentQuestion.options.map((option: string, index: number) => (
        <FormControlLabel
          key={index}
          control={
            currentQuestion.singleSelect ? (
              <Radio
                checked={answers[currentQuestion.id] === option}
                onChange={() => handleAnswerChange(currentQuestion.id, option)}
              />
            ) : (
              <Checkbox
                checked={answers[currentQuestion.id]?.includes(option)}
                onChange={() => {
                  const selectedOptions = answers[currentQuestion.id] || [];
                  if (selectedOptions.includes(option)) {
                    handleAnswerChange(
                      currentQuestion.id,
                      selectedOptions.filter((o: string) => o !== option)
                    );
                  } else {
                    handleAnswerChange(currentQuestion.id, [
                      ...selectedOptions,
                      option,
                    ]);
                  }
                }}
              />
            )
          }
          label={option}
        />
      ));
    }

    if (currentQuestion?.type === "rate") {
      return (
        <Rating
          name={`question_${currentQuestion.id}`}
          value={Number(answers[currentQuestion.id]) || 0}
          precision={1}
          max={5}
          onChange={(event, newValue) =>
            handleAnswerChange(currentQuestion.id, newValue)
          }
        />
      );
    }

    if (currentQuestion?.type === "essay") {
      return (
        <TextField
          label="Essay"
          multiline
          minRows={4}
          fullWidth
          value={answers[currentQuestion.id] || ""}
          onChange={(e) =>
            handleAnswerChange(currentQuestion.id, e.target.value)
          }
        />
      );
    }

    return null;
  };

  // Calculate the progress percentage
  const progress = (currentQuestionIndex / questions.length) * 100;

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      {!isSubmitted ? (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Company Questionnaire
          </Typography>

          {/* Smooth Progress Bar */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "lightgray",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: progress > 50 ? "green" : "orange",
                },
              }}
            />
            <Typography align="right" sx={{ mt: 1 }}>
              {`${Math.round(progress)}% completed`}
            </Typography>
          </Box>

          {currentQuestion && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {currentQuestion.text}
              </Typography>

              <Box sx={{ mt: 2, mb: 4 }}>{renderOptions()}</Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button variant="contained" onClick={handleNext}>
                  {currentQuestionIndex === questions.length - 1
                    ? "Submit"
                    : "Next"}
                </Button>
              </Box>
            </Box>
          )}

          {/* Confirmation Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
          >
            <DialogTitle id="confirm-dialog-title">
              {"Confirm Submission"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="confirm-dialog-description">
                Are you sure you want to submit your answers?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                color="primary"
                variant="contained"
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      ) : (
        <Alert severity="success" sx={{ mt: 4 }}>
          <Typography variant="h5" align="center">
            Thank you! Your feedback has been successfully sent.
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default Questionaire;
