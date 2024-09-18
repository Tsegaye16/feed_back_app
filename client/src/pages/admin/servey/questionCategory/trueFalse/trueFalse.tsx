import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const TrueFalse: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false); // To toggle input field visibility
  const [question, setQuestion] = useState(""); // Store the entered question
  const [questionsList, setQuestionsList] = useState<string[]>([]); // Store the list of saved questions
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track which question is being edited

  // Handle the "Add" button click to show the input field
  const handleAddClick = () => {
    setIsAdding(true);
    setEditingIndex(null); // Reset editing state if adding a new question
  };

  // Handle question input change
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  // Save the question
  const handleSave = () => {
    if (editingIndex !== null) {
      const updatedQuestions = [...questionsList];
      updatedQuestions[editingIndex] = question;
      setQuestionsList(updatedQuestions);
    } else {
      setQuestionsList([...questionsList, question]);
    }
    setIsAdding(false);
    setQuestion("");
  };

  // Cancel adding or editing
  const handleCancel = () => {
    setIsAdding(false);
    setQuestion("");
  };

  // Handle updating an existing question
  const handleUpdate = (index: number) => {
    setIsAdding(true);
    setQuestion(questionsList[index]);
    setEditingIndex(index); // Set the current index to edit
    setQuestionsList(questionsList.filter((_, i) => i !== index));
  };

  // Handle deleting a question
  const handleDelete = (index: number) => {
    const filteredQuestions = questionsList.filter((_, i) => i !== index);
    setQuestionsList(filteredQuestions);
  };

  return (
    <Box>
      {/* Heading and Add button */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h3>True/False Questions</h3>
        <Button
          variant="contained"
          onClick={handleAddClick}
          disabled={isAdding}
        >
          Add
        </Button>
      </Box>

      {/* Input field with Save/Cancel buttons */}
      {isAdding && (
        <Box mt={2} width="100%">
          <TextField
            fullWidth
            //label="Enter your question"
            value={question}
            onChange={handleQuestionChange}
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

      {/* Display the saved questions with True/False radio buttons and Update/Delete */}
      <Box mt={3}>
        {questionsList.map((q, index) => (
          <Box
            key={index}
            mb={2}
            p={2}
            border="1px solid #ddd"
            borderRadius={2}
          >
            <h4>{q}</h4>
            <RadioGroup>
              <FormControlLabel value="true" control={<Radio />} label="True" />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="False"
              />
            </RadioGroup>
            <Box mt={1} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleUpdate(index)}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(index)}
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

export default TrueFalse;
