import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.UUID, // Use UUID if required, else MongoDB uses `_id` by default
      default: () => mongoose.Types.ObjectId(),
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please insert the name of the survey"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    secretePhrase: {
      type: String,
      required: [true, "Please insert the secret phrase of the survey"],
      unique: true,
      minlength: [
        6,
        "The secret phrase must be greater than or equal to 6 characters",
      ],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Reference to Company model
      required: true,
    },
  },
  { timestamps: true }
);

const Survey = mongoose.model("Survey", surveySchema);
export default Survey;
