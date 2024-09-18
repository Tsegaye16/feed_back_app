import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Rating,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Rate: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [question, setQuestion] = useState("");
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [savedQuestions, setSavedQuestions] = useState<
    { question: string; ratingValue: number | null }[]
  >([]);

  // Handlers for adding a new question
  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setQuestion("");
    setRatingValue(null);
  };

  const handleSave = () => {
    if (question.trim() && ratingValue !== null) {
      setSavedQuestions([...savedQuestions, { question, ratingValue }]);
      setIsAdding(false);
      setQuestion("");
      setRatingValue(null);
    }
  };

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  // Update and delete functions
  const handleDelete = (index: number) => {
    setSavedQuestions(savedQuestions.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number) => {
    const updatedQuestion = savedQuestions[index];
    setQuestion(updatedQuestion.question);
    setRatingValue(updatedQuestion.ratingValue);
    setSavedQuestions(savedQuestions.filter((_, i) => i !== index));
    setIsAdding(true);
  };

  return (
    <Box width="100%">
      {/* Heading and Add button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Rate</Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
      </Box>

      {/* Add Question Section */}
      {isAdding && (
        <Box mt={2} width="100%">
          <Typography variant="body1" mb={1}>
            Enter your question
          </Typography>
          <input
            type="text"
            value={question}
            onChange={handleQuestionChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <Typography variant="body1" mb={1}>
            Select Rating
          </Typography>
          <Rating
            name="rate-question"
            value={ratingValue}
            onChange={(_, newValue) => {
              setRatingValue(newValue);
            }}
            size="large"
          />

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      {/* Display Saved Questions */}
      <Box mt={2}>
        {savedQuestions.map((q, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            p={2}
            mb={2}
            bgcolor="#f0f0f0"
            borderRadius={2}
            boxShadow={3}
          >
            <Typography variant="body1">{q.question}</Typography>
            <Rating name="read-only" value={q.ratingValue} readOnly />

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleUpdate(index)}
                sx={{ ml: 1 }}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(index)}
                sx={{ ml: 1 }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Rate;
