import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.UUID, // Use UUID if required, else MongoDB uses `_id` by default
      default: () => mongoose.Types.ObjectId(),
      unique: true,
    },
    answer: {
      type: String,
    },
    sentiment: {
      type: String,
      enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"],
      required: true,
    },
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey", // Reference to Survey model
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question", // Reference to Question model
      required: true,
    },
  },
  { timestamps: true }
);
const Answer = mongoose.model("Answer", answerSchema);
export default Answer;
