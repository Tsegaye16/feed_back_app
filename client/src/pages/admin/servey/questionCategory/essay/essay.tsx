import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Essay: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [question, setQuestion] = useState("");
  const [savedQuestions, setSavedQuestions] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Handlers for adding a new essay question
  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setQuestion("");
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (question.trim()) {
      if (editingIndex !== null) {
        // Update an existing question
        const updatedQuestions = [...savedQuestions];
        updatedQuestions[editingIndex] = question;
        setSavedQuestions(updatedQuestions);
        setEditingIndex(null);
      } else {
        // Add a new question
        setSavedQuestions([...savedQuestions, question]);
      }
      setIsAdding(false);
      setQuestion("");
    }
  };

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleDelete = (index: number) => {
    setSavedQuestions(savedQuestions.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setQuestion(savedQuestions[index]);
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
        <Typography variant="h6">Essay Question</Typography>
        {!isAdding && (
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add
          </Button>
        )}
      </Box>

      {/* Add/Edit Question Section */}
      {isAdding && (
        <Box mt={2}>
          <TextField
            fullWidth
            label="Enter your essay question"
            value={question}
            onChange={handleQuestionChange}
            multiline
            rows={4}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSave}>
              {editingIndex !== null ? "Update" : "Save"}
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      {/* Display Saved Questions */}
      <Box mt={2}>
        {savedQuestions.length > 0 && (
          <List>
            {savedQuestions.map((q, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: "#f0f0f0",
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  position: "relative",
                }}
              >
                <ListItemText primary={q} />
                {/* Only show Edit/Delete buttons when not editing the question */}
                {editingIndex === null && (
                  <>
                    <IconButton edge="end" onClick={() => handleEdit(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default Essay;
