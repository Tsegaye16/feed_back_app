import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  addChoiceQuestion,
  deleteTrueFalseQuestion,
  getAllQuestion,
  updateTrueFalseQuestion,
} from "../../../../../redux/action/company";

const MultipleChoice: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [option, setOption] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inputType, setInputType] = useState("radio");

  const dispatch = useDispatch();

  const companyId = useSelector(
    (state: any) => state.company?.companyData?.result?.id
  );
  const questions = useSelector(
    (state: any) => state.question?.questionDaata?.result || []
  );

  useEffect(() => {
    if (companyId) {
      dispatch(getAllQuestion(companyId) as any);
    }
  }, [dispatch, companyId]);

  const filteredQuestions = questions.filter(
    (q: any) =>
      q.type === "multiple_choice" && q.options && q.options.length > 0
  );

  const handleAdd = () => {
    setIsAdding(true);
    setEditingIndex(null); // Reset editing index when adding a new question
  };

  const handleCancel = () => {
    setIsAdding(false);
    setQuestion("");
    setOptions([]);
    setEditingIndex(null);
  };

  const handleSave = async (event: any) => {
    event.preventDefault();
    if (question.trim() && options.length > 0) {
      const newQuestion = {
        text: question,
        options,
        type: "multiple_choice",
        singleSelect: inputType === "radio",
        companyId,
      };

      if (editingIndex !== null) {
        // If editing an existing question
        const questionId = filteredQuestions[editingIndex]?.id;
        if (questionId) {
          await dispatch(
            updateTrueFalseQuestion(questionId, newQuestion) as any
          );
        }
      } else {
        // If adding a new question
        await dispatch(addChoiceQuestion(newQuestion) as any);
      }

      // Fetch updated list
      dispatch(getAllQuestion(companyId) as any);

      // Clear fields
      handleCancel();
    }
  };

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
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

  const handleDeleteQuestion = async (index: number) => {
    const questionId = filteredQuestions[index]?.id;
    if (questionId) {
      // Dispatch the delete action to remove the question from the backend
      await dispatch(deleteTrueFalseQuestion(questionId) as any);

      // Re-fetch the updated questions list after deletion
      dispatch(getAllQuestion(companyId) as any);
    }
  };

  const handleEditQuestion = (index: number) => {
    const questionToEdit = filteredQuestions[index];
    setQuestion(questionToEdit?.text);
    setOptions(questionToEdit?.options);
    setInputType(questionToEdit?.singleSelect ? "radio" : "checkbox");
    setIsAdding(true);
    setEditingIndex(index);
  };

  const handleInputTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: string
  ) => {
    if (newType !== null) {
      setInputType(newType);
    }
  };

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string[];
  }>({});

  const handleOptionChange = (
    questionId: number,
    option: string,
    singleSelect: boolean
  ) => {
    setSelectedOptions((prevState) => {
      if (singleSelect) {
        return { ...prevState, [questionId]: [option] }; // Single select
      } else {
        const currentSelections = prevState[questionId] || [];
        if (currentSelections.includes(option)) {
          return {
            ...prevState,
            [questionId]: currentSelections.filter((opt) => opt !== option),
          }; // Deselect
        } else {
          return { ...prevState, [questionId]: [...currentSelections, option] }; // Select
        }
      }
    });
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
              onChange={(e) => setOption(e.target.value)} // Direct handler here
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
            <ToggleButton value="checkbox">Multiple selection</ToggleButton>
          </ToggleButtonGroup>

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
      <Box mt={3}>
        {filteredQuestions.map(
          (q: any, index: number) =>
            editingIndex !== index && (
              <Box
                key={index}
                display="flex"
                flexDirection="column"
                p={2}
                mb={2}
                border="1px solid #ddd"
                borderRadius={2}
                boxShadow={3}
              >
                <Typography variant="body1">{q.text}</Typography>
                <List>
                  {q.options.map((opt: string, i: number) => (
                    <ListItem key={i}>
                      {q.singleSelect ? (
                        <Radio
                          checked={selectedOptions[q.id]?.[0] === opt}
                          onChange={() =>
                            handleOptionChange(q.id, opt, q.singleSelect)
                          }
                        />
                      ) : (
                        <Checkbox
                          checked={selectedOptions[q.id]?.includes(opt)}
                          onChange={() =>
                            handleOptionChange(q.id, opt, q.singleSelect)
                          }
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
                    Update <EditIcon sx={{ ml: 1 }} />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ ml: 1 }}
                    onClick={() => handleDeleteQuestion(index)}
                  >
                    Delete
                    <DeleteIcon sx={{ ml: 1 }} />
                  </Button>
                </Box>
              </Box>
            )
        )}
      </Box>
    </Box>
  );
};

export default MultipleChoice;
