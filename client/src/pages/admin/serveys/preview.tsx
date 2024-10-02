import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Rating,
  TextField,
  Button,
} from "@mui/material";
import { getPreviewData } from "../../../redux/action/company";
//import { backgroundClip } from "html2canvas/dist/types/css/property-descriptors/background-clip";

const Preview: React.FC = () => {
  const dispatch: any = useDispatch();
  const { companyName, surveyId } = useParams();

  useEffect(() => {
    dispatch(getPreviewData(companyName, surveyId));
  }, [companyName, dispatch, surveyId]);

  const previewData = useSelector((state: any) => state.preview?.previewData);
  const questions = previewData?.questions || [];
  const companyInfo = previewData?.CompanyInfo;

  // Group questions by their type in the required order
  const groupedQuestions = {
    TrueFalse: questions.filter((q: any) => q.type === "True/False"),
    Choice: questions.filter((q: any) => q.type === "Choice"),
    Rate: questions.filter((q: any) => q.type === "Rate"),
    Open: questions.filter((q: any) => q.type === "Open"),
  };

  return (
    <Box>
      {/* Company Header */}
      {companyInfo && (
        <Box
          sx={{
            backgroundColor: companyInfo.backGroundColor,
            color: companyInfo.textColor,
            display: "flex",
            alignItems: "center",
            padding: 2,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            width: "100vw", // Full width of device screen
          }}
        >
          <Avatar
            src={`http://localhost:4000/${companyInfo.logo}`}
            alt={companyInfo.name}
            sx={{ marginRight: 2, width: 65, height: 65, objectFit: "cover" }}
          />
          <Typography variant="h4">{companyInfo.name}</Typography>
        </Box>
      )}

      {/* Questions Display */}
      <Box
        sx={{
          padding: 3,
          marginTop: 10, // To avoid content overlapping with fixed header
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center questions horizontally
        }}
      >
        {/* True/False Questions */}
        {groupedQuestions.TrueFalse.length > 0 && (
          <Typography variant="h6">True/False Questions</Typography>
        )}
        {groupedQuestions.TrueFalse.map((question: any) => (
          <QuestionTrueFalse key={question.id} question={question} />
        ))}

        {/* Choice Questions */}
        {groupedQuestions.Choice.length > 0 && (
          <Typography variant="h6" sx={{ marginTop: 3 }}>
            Choice Questions
          </Typography>
        )}
        {groupedQuestions.Choice.map((question: any) => (
          <QuestionChoice key={question.id} question={question} />
        ))}

        {/* Rate Questions */}
        {groupedQuestions.Rate.length > 0 && (
          <Typography variant="h6" sx={{ marginTop: 3 }}>
            Rate Questions
          </Typography>
        )}
        {groupedQuestions.Rate.map((question: any) => (
          <QuestionRate key={question.id} question={question} />
        ))}

        {/* Open Questions */}
        {groupedQuestions.Open.length > 0 && (
          <Typography variant="h6" sx={{ marginTop: 3 }}>
            Open-Ended Questions
          </Typography>
        )}
        {groupedQuestions.Open.map((question: any) => (
          <QuestionOpen key={question.id} question={question} />
        ))}
      </Box>
    </Box>
  );
};

// QuestionTrueFalse Component
const QuestionTrueFalse: React.FC<{ question: any }> = ({ question }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        width: "80%", // 80% of device screen width
        border: "1px solid #e0e0e0",
        padding: 2,
        backgroundColor: "#f5f5f5",

        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="body1">{question.text}</Typography>
        <RadioGroup
          value={selectedValue}
          onChange={handleRadioChange}
          name={`radio-${question.id}`}
        >
          <FormControlLabel
            control={
              <Radio
                sx={{
                  color: "#1976d2", // Custom color for radio buttons
                  "&.Mui-checked": {
                    color: "#1976d2", // Color when selected
                  },
                }}
              />
            }
            label={question.additionalOption.split("/")[0] || "Agree"}
            value="agree"
          />
          <FormControlLabel
            control={
              <Radio
                sx={{
                  color: "#1976d2",
                  "&.Mui-checked": {
                    color: "#1976d2",
                  },
                }}
              />
            }
            label={question.additionalOption.split("/")[1] || "Disagree"}
            value="disagree"
          />
        </RadioGroup>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="outlined" color="secondary" sx={{ ml: 1 }}>
            Update <EditIcon sx={{ ml: 1 }} />
          </Button>
          <Button variant="outlined" color="error" sx={{ ml: 1 }}>
            Delete
            <DeleteIcon sx={{ ml: 1 }} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// QuestionChoice Component
const QuestionChoice: React.FC<{ question: any }> = ({ question }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleChoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (question.singleSelect) {
      setSelectedValue(value);
    } else {
      const currentValues = Array.isArray(selectedValue)
        ? [...selectedValue]
        : [];
      if (currentValues.includes(value)) {
        setSelectedValue(currentValues.filter((v) => v !== value) as any);
      } else {
        setSelectedValue([...currentValues, value] as any);
      }
    }
  };

  return (
    <Card
      sx={{
        marginBottom: 3,
        width: "80%", // 80% of device screen width
        boxShadow: 2,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        padding: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            marginBottom: 2,
            fontWeight: 500,
            color: "#333",
          }}
        >
          {question.text}
        </Typography>
        <FormGroup>
          {question.options.map((option: string, index: number) => (
            <FormControlLabel
              key={index}
              control={
                question.singleSelect ? (
                  <Radio
                    checked={selectedValue === option}
                    onChange={handleChoiceChange}
                    value={option}
                    name={`radio-choice-${question.id}`}
                    sx={{
                      color: "#1976d2", // Custom color for radio buttons
                      "&.Mui-checked": {
                        color: "#1976d2", // Color when selected
                      },
                    }}
                  />
                ) : (
                  <Checkbox
                    checked={
                      Array.isArray(selectedValue) &&
                      selectedValue.includes(option)
                    }
                    onChange={handleChoiceChange}
                    value={option}
                    sx={{
                      color: "#1976d2",
                      "&.Mui-checked": {
                        color: "#1976d2",
                      },
                    }}
                  />
                )
              }
              label={option}
              sx={{
                marginBottom: 1,
                color: "#555",
                "& .MuiTypography-root": {
                  fontWeight: 400,
                  fontSize: "1rem",
                },
              }}
            />
          ))}
        </FormGroup>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="outlined" color="secondary" sx={{ ml: 1 }}>
            Update <EditIcon sx={{ ml: 1 }} />
          </Button>
          <Button variant="outlined" color="error" sx={{ ml: 1 }}>
            Delete
            <DeleteIcon sx={{ ml: 1 }} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// QuestionRate Component
const QuestionRate: React.FC<{ question: any }> = ({ question }) => {
  const [rating, setRating] = useState<number | null>(null);

  const handleRateChange = (
    event: React.ChangeEvent<{}>,
    newValue: number | null
  ) => {
    setRating(newValue);
  };

  return (
    <Card
      sx={{
        marginBottom: 3,
        width: "80%", // 80% of device screen width
        boxShadow: 2,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        padding: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      <CardContent>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 2,
            fontWeight: 500,
            color: "#333",
          }}
        >
          {question.text}
        </Typography>
        <Rating
          name={`rate-question-${question.id}`}
          value={rating}
          onChange={handleRateChange}
          precision={1}
        />
      </CardContent>
    </Card>
  );
};

// QuestionOpen Component
const QuestionOpen: React.FC<{ question: any }> = ({ question }) => {
  const [response, setResponse] = useState<string>("");

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResponse(event.target.value);
  };

  return (
    <Card
      sx={{
        marginBottom: 3,
        width: "80%", // 80% of device screen width
        boxShadow: 2,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        padding: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      <CardContent>
        <Typography variant="body1">{question.text}</Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={response}
          onChange={handleTextChange}
          placeholder="Your response here..."
          sx={{ backgroundClip: "white", color: "black" }}
        />
      </CardContent>
    </Card>
  );
};

export default Preview;
