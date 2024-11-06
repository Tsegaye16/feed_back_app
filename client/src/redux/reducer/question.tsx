import { createSlice } from "@reduxjs/toolkit";
import {
  addQuestion,
  deleteQuestionById,
  getAllQuestion,
  getQuestionBySurveyId,
  sortQuestion,
  updateQuestion,
} from "../action/company";

const questionSlice = createSlice({
  name: "question",
  initialState: {
    question: [] as any[],
    tottalFeedback: null,
    weeklyFeedback: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllQuestion.fulfilled, (state, action) => {
        state.question = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getQuestionBySurveyId.fulfilled, (state, action) => {
        state.question = action.payload.question;
        state.tottalFeedback = action.payload.tottalFeedback;
        state.weeklyFeedback = action.payload.weeklyFeedback;
      })
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(addQuestion.fulfilled, (state, action: any) => {
        state.loading = false;
        state.question.push(action.payload.newQuestion);
      })
      .addCase(addQuestion.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteQuestionById.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteQuestionById.fulfilled, (state, action: any) => {
        const deletedId = action.meta.arg;
        state.question = state.question.filter(
          (questions: any) => !deletedId.includes(questions.id)
        );
      })
      .addCase(deleteQuestionById.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQuestion.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateQuestion.fulfilled, (state, action: any) => {
        state.loading = false;
        const updatedQuestion = action.payload.updatedQuestion;
        state.question = state.question.map((question: any) =>
          question.id === updatedQuestion.id ? updateQuestion : question
        );
      })
      .addCase(updateQuestion.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sortQuestion.fulfilled, (state, action) => {
        state.question = action.payload.updatedQuestions;
      });
  },
});
export default questionSlice.reducer;

// const questionReducer = (state = questionState, action: any) => {
//   switch (action.type) {
//     case GET_ALL_QUESTIONS:
//       return { ...state, questionDaata: action.payload };
//     case SUBMIT_ANSWER:
//       return { ...state, questionDaata: action.payload };
//     case ADD_QUESTION:
//       return { ...state, questionDaata: action.payload };
//     case GET_PREVIEW_PARAMS:
//       return { ...state, questionDaata: action.payload };
//     case GET_QUESTION_BY_SURVEY_ID:
//       return { ...state, questionDaata: action.payload };
//     case DELETE_QUESTION_BY_ID:
//       return { ...state, questionDaata: action.payload };
//     case UPDATE_QUESTION:
//       return { ...state, questionDaata: action.payload };
//     default:
//       return state;
//   }
// };
