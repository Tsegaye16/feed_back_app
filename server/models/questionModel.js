import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.UUID, // Use UUID if required, else MongoDB uses `_id` by default
      default: () => mongoose.Types.ObjectId(),
      unique: true,
    },
    index: {
      type: Number,
    },
    text: {
      type: String,
      required: [true, "Please insert the question"],
    },
    type: {
      type: String,
      enum: ["True/False", "Choice", "Open", "Rate"],
      required: [true, "Please select question type"],
    },
    options: {
      type: [String], // For multiple-choice questions
    },
    additionalOption: {
      type: String,
      enum: ["True/False", "Agree/Disagree", "Yes/No"],
    },
    singleSelect: {
      type: Boolean, // For single/multiple select
    },
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey", // Reference to Survey model
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
