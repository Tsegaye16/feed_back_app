import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import {
  addTrueFalseQuestion,
  getAllQuestion,
  updateTrueFalseQuestion,
  deleteTrueFalseQuestion,
} from "../../../../../logics/action/company";

const TrueFalse: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [question, setQuestion] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [questionsList, setQuestionsList] = useState<any[]>([]);

  const companyId = useSelector(
    (state: any) => state.company?.companyData?.result?.id
  );

  // Fetch questions directly using useSelector here
  const questions = useSelector(
    (state: any) => state.question?.questionDaata?.result || []
  );

  const dispatch = useDispatch();

  // Filter true/false questions when questions change
  useEffect(() => {
    const trueFalseQuestions = Array.isArray(questions)
      ? questions.filter((question: any) => question.type === "true_false")
      : [];
    setQuestionsList(trueFalseQuestions);
  }, [questions]); // Re-run when questions change

  // Fetch all questions when the component mounts
  useEffect(() => {
    if (companyId) {
      dispatch(getAllQuestion(companyId) as any);
    }
  }, [dispatch, companyId]);

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setQuestion(""); // Reset the question input
  };

  // Save the question to the backend and update the list
  const handleSave = async (event: any) => {
    event.preventDefault();
    if (!question) return; // Avoid saving if the question is empty

    try {
      if (editingIndex !== null) {
        // Update the existing question (if editing)
        const updatedQuestion = {
          text: question,
          type: "true_false",
          companyId,
        };
        const questionId = questionsList[editingIndex]?.id; // Safety check for undefined
        if (questionId) {
          await dispatch(
            updateTrueFalseQuestion(questionId, updatedQuestion) as any
          );
          // Update local questionsList to reflect the change
          const updatedList = [...questionsList];
          updatedList[editingIndex] = {
            ...updatedList[editingIndex],
            text: question,
          };
          setQuestionsList(updatedList);
        }
        setEditingIndex(null);
      } else {
        // Add the question to the backend and dispatch action
        await dispatch(
          addTrueFalseQuestion({
            text: question,
            type: "true_false",
            companyId,
          }) as any
        );
        // Re-fetch the list after adding
        dispatch(getAllQuestion(companyId) as any);
      }
    } catch (error) {
      console.error("Error saving the question:", error);
    }

    setIsAdding(false);
    setQuestion(""); // Reset the input field
  };

  // Cancel adding or editing
  const handleCancel = () => {
    setIsAdding(false);
    setQuestion("");
    setEditingIndex(null); // Reset the editing index if any
  };

  // Handle updating an existing question
  const handleUpdate = (index: number) => {
    if (questionsList[index]) {
      // Ensure the question exists at the index
      setIsAdding(true);
      setQuestion(questionsList[index]?.text || ""); // Load the question's text
      setEditingIndex(index); // Set the current index to edit
    }
  };

  // Handle deleting a question from backend
  const handleDelete = async (index: number) => {
    const questionId = questionsList[index]?.id; // Get the question's ID with safety check
    if (questionId) {
      try {
        await dispatch(deleteTrueFalseQuestion(questionId) as any);
        // Update local questionsList after deletion
        const updatedList = questionsList.filter((_, i) => i !== index);
        setQuestionsList(updatedList);
      } catch (error) {
        console.error("Error deleting the question", error);
      }
    }
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
            label="Enter your question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
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

      {/* Display the saved questions with True/False radio buttons and Update/Delete */}
      <Box mt={3}>
        {questionsList.map(
          (q: any, index: any) =>
            editingIndex !== index && (
              <Box
                key={q.id} // Use ID if available
                mb={2}
                p={2}
                border="1px solid #ddd"
                borderRadius={2}
                boxShadow={3}
              >
                <h4>{q.text}</h4>
                <RadioGroup>
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="True"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="False"
                  />
                </RadioGroup>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ ml: 1 }}
                    onClick={() => handleUpdate(index)}
                  >
                    Update <EditIcon sx={{ ml: 1 }} />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ ml: 1 }}
                    onClick={() => handleDelete(index)}
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

export default TrueFalse;
