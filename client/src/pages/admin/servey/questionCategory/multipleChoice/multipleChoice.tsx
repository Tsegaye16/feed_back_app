import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Radio,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const MultipleChoice: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [option, setOption] = useState("");
  const [savedQuestions, setSavedQuestions] = useState<
    { question: string; options: string[]; type: string }[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inputType, setInputType] = useState("radio");

  // Handlers for adding a new question
  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setQuestion("");
    setOptions([]);
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (question.trim() && options.length > 0) {
      const newQuestion = { question, options, type: inputType };

      if (editingIndex !== null) {
        const updatedQuestions = [...savedQuestions];
        updatedQuestions[editingIndex] = newQuestion;
        setSavedQuestions(updatedQuestions);
        setEditingIndex(null);
      } else {
        setSavedQuestions([...savedQuestions, newQuestion]);
      }

      setIsAdding(false);
      setQuestion("");
      setOptions([]);
    }
  };

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOption(event.target.value);
  };

  const handleAddOption = () => {
    if (option.trim()) {
      setOptions([...options, option]);
      setOption("");
    }
  };

  const handleDeleteOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleDeleteQuestion = (index: number) => {
    setSavedQuestions(savedQuestions.filter((_, i) => i !== index));
  };

  const handleEditQuestion = (index: number) => {
    const { question, options, type } = savedQuestions[index];
    setQuestion(question);
    setOptions(options);
    setInputType(type);
    setIsAdding(true);
    setEditingIndex(index);
    setSavedQuestions(savedQuestions.filter((_, i) => i !== index));
  };

  const handleInputTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: string
  ) => {
    setInputType(newType);
  };

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionSelect = (opt: string) => {
    setSelectedOption(opt); // Set the selected radio option
  };

  const handleCheckboxToggle = (opt: string) => {
    if (selectedOptions.includes(opt)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== opt)); // Uncheck
    } else {
      setSelectedOptions([...selectedOptions, opt]); // Check
    }
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
        <Typography variant="h6">Multiple Choice</Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
      </Box>

      {/* Add Question Section */}
      {isAdding && (
        <Box mt={2} width="100%">
          <TextField
            fullWidth
            label="Enter your question"
            value={question}
            onChange={handleQuestionChange}
          />

          <Box mt={2} display="flex" alignItems="center">
            <TextField
              fullWidth
              label="Add an option"
              value={option}
              onChange={handleOptionChange}
            />
            <Button
              variant="contained"
              onClick={handleAddOption}
              sx={{ ml: 2 }}
            >
              Add Option
            </Button>
          </Box>

          <List>
            {options.map((opt, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteOption(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={opt} />
              </ListItem>
            ))}
          </List>

          {/* Toggle between Radio and Checkbox */}
          <ToggleButtonGroup
            color="primary"
            value={inputType}
            exclusive
            onChange={handleInputTypeChange}
            aria-label="Select input type"
            sx={{ mt: 2 }}
          >
            <ToggleButton value="radio">Single selection</ToggleButton>
            <ToggleButton value="checkbox">multiple selection</ToggleButton>
          </ToggleButtonGroup>

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
            <List>
              {q.options.map((opt, i) => (
                <ListItem key={i}>
                  {q.type === "radio" ? (
                    <Radio
                      checked={selectedOption === opt} // Ensure only one radio can be checked
                      onChange={() => handleOptionSelect(opt)}
                    />
                  ) : (
                    <Checkbox
                      checked={selectedOptions.includes(opt)} // Ensure checkboxes allow multiple selections
                      onChange={() => handleCheckboxToggle(opt)}
                    />
                  )}
                  <ListItemText primary={opt} />
                </ListItem>
              ))}
            </List>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ ml: 1 }}
                onClick={() => handleEditQuestion(index)}
              >
                Update
                <EditIcon sx={{ ml: 1 }} />
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ ml: 1 }}
                onClick={() => handleDeleteQuestion(index)}
              >
                Delete
                <DeleteIcon sx={{ ml: 1 }} />
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MultipleChoice;
