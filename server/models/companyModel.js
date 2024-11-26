import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.UUID, // Use UUID if required, else MongoDB uses `_id` by default
      default: () => mongoose.Types.ObjectId(),
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please insert your company name"],
    },
    logo: {
      type: String,
    },
    backGroundColor: {
      type: String,
    },
    textColor: {
      type: String,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
