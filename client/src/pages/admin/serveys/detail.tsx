import React, { useState } from "react";
import {
  Button,
  Paper,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addQuestion, getPreviewParams } from "../../../redux/action/company";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface DetailProps {
  id: any;
}

const Detail: React.FC<DetailProps> = ({ id }) => {
  const [open, setOpen] = useState(false); // For dialog open/close
  const [questionText, setQuestionText] = useState<any>(""); // For storing question text
  const [questionType, setQuestionType] = useState<any>(""); // For storing question type
  const [additionalOption, setAdditionalOption] = useState<any>(""); // For additional options like True/False
  const [choices, setChoices] = useState<any>([""]); // For storing multiple choice options

  const dispatch = useDispatch();

  const handlePreview = async (event: any) => {
    event.preventDefault();

    const response = await dispatch(getPreviewParams(id) as any);
    const CompanyName = response?.payload?.companyName;
    const serveyId = response?.payload?.serveyId;

    //console.log("Name: ", name);
    if (CompanyName && serveyId) {
      const previewUrl = `${window.location.origin}/${CompanyName}/surveys/${serveyId}`;
      window.open(previewUrl, "_blank"); // Open the URL in a new tab
    } else {
      toast.error("Preview data is missing."); // Handle case if data is missing
    }
  };

  // Handle dialog open/close
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setQuestionText("");
    setQuestionType("");
    setAdditionalOption("");
    setChoices([""]); // Reset choices on close
  };

  // Submit the question
  const handleSubmit = async () => {
    const response = await dispatch(
      addQuestion({
        text: questionText,
        type: questionType,
        additionalOption:
          questionType === "True/False" ? additionalOption : undefined,
        serveyId: id,
        singleSelect:
          questionType === "Choice"
            ? additionalOption === "SingleSelect"
            : undefined,
        options: questionType === "Choice" ? choices : undefined,
      }) as any
    );
    if (response) {
      toast.success(`${response?.payload?.message}`);
      handleClose();
    } else if (response?.error) {
      toast.error(`${response.error}`);
    }
  };

  // Handle adding new choice input field
  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  // Handle removing choice input field
  const handleRemoveChoice = (index: number) => {
    const updatedChoices = choices.filter((_: any, i: any) => i !== index);
    setChoices(updatedChoices);
  };

  // Handle change in choice text
  const handleChoiceChange = (index: number, value: string) => {
    const updatedChoices = choices.map((choice: any, i: any) =>
      i === index ? value : choice
    );
    setChoices(updatedChoices);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Survey Detail
      </Typography>

      {/* Summary Section */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Total Questions</Typography>
            <Typography variant="body1">{15}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Total Feedback</Typography>
            <Typography variant="body1">{100}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Weekly Feedback</Typography>
            <Typography variant="body1">{65}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Grid
        container
        spacing={2}
        sx={{
          marginBottom: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Grid item>
          <Button variant="outlined" color="primary" onClick={handlePreview}>
            Preview Survey
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClickOpen}
          >
            Add New Question
          </Button>
        </Grid>
      </Grid>

      {/* Add New Question Dialog */}
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar
          sx={{
            position: "relative",
            backgroundColor: "aliceblue",
            color: "black",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Adding new question
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <TextField
            label="Question Text"
            fullWidth
            variant="outlined"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              label="Question Type"
            >
              <MenuItem value="True/False">True/False</MenuItem>
              <MenuItem value="Rate">Rate</MenuItem>
              <MenuItem value="Choice">Choice</MenuItem>
              <MenuItem value="Open">Open (Essay)</MenuItem>
            </Select>
          </FormControl>

          {/* Conditional rendering based on question type */}
          {questionType === "True/False" && (
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>True/False Option</InputLabel>
              <Select
                value={additionalOption}
                onChange={(e) => setAdditionalOption(e.target.value)}
                label="True/False Option"
              >
                <MenuItem value="True/False">True/False</MenuItem>
                <MenuItem value="Agree/Disagree">Agree/Disagree</MenuItem>
                <MenuItem value="Yes/No">Yes/No</MenuItem>
              </Select>
            </FormControl>
          )}

          {questionType === "Choice" && (
            <>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Choice Option</InputLabel>
                <Select
                  value={additionalOption}
                  onChange={(e) => setAdditionalOption(e.target.value)}
                  label="Choice Option"
                >
                  <MenuItem value="SingleSelect">Single Select</MenuItem>
                  <MenuItem value="MultipleSelect">Multiple Select</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                Choices
              </Typography>
              {choices.map((choice: any, index: any) => (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  key={index}
                  sx={{ marginBottom: 1 }}
                >
                  <Grid item xs={10}>
                    <TextField
                      label={`Choice ${index + 1}`}
                      fullWidth
                      value={choice}
                      onChange={(e) =>
                        handleChoiceChange(index, e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      onClick={() => handleRemoveChoice(index)}
                      disabled={choices.length === 1} // Disable delete button if only one choice is left
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddChoice}
              >
                Add Choice
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Detail;
