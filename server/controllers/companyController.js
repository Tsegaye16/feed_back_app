import Company from "../models/companyModel.js";
import Question from "../models/questionModel.js";
import Servey from "../models/serveyModel.js";

export const addOrUpdateCompanyInfo = async (req, res) => {
  try {
    const { name, backGroundColor, textColor, managerId } = req.body;
    const logo = req.file?.filename; // Extract the filename for the logo
    const id = parseInt(managerId); // Parse managerId to an integer

    // Check if a company with this managerId already exists
    let company = await Company.findOne({ where: { managerId: id } });

    if (company) {
      // Company with this managerId exists, update the information
      company.name = name;
      company.logo = logo || company.logo; // Update logo if provided, otherwise keep the existing one
      company.backGroundColor = backGroundColor;
      company.textColor = textColor;

      await company.save(); // Save the updated company information

      return res.status(200).json({
        message: "Company info updated successfully",
        result: company,
      });
    } else {
      // Company with this managerId does not exist, create a new one
      const newCompany = await Company.create({
        name,
        logo,
        backGroundColor,
        textColor,
        managerId: id,
      });

      return res.status(201).json({
        message: "Company info added successfully",
        result: newCompany,
      });
    }
  } catch (error) {
    console.error("Error adding or updating company info:", error);
    res.status(500).json({ message: "Internal Server Error", Error: error });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const id = parseInt(req.params.id); // Parse the id to an integer
    const company = await Company.findOne({ where: { managerId: id } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ message: "Company found", result: company });
  } catch (error) {
    console.error("Error getting company by id:", error);
    res.status(500).json({ message: "Internal Server Error", Error: error });
  }
};

export const addTrueFalseQuestion = async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body);
    return res.status(201).json({
      message: "Question added successfully",
      result: newQuestion,
    });
  } catch (err) {
    console.error("Error adding question:", err);
  }
};

export const getAllquestion = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const questions = await Question.findAll({
      where: { companyId: companyId },
    });
    return res
      .status(200)
      .json({ message: "Questions Fetched", result: questions });
  } catch (err) {
    console.error("Error getting questions:", err);
  }
};

export const updateTrueFalse = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedQuestion = await Question.update(req.body, {
      where: { id: id },
    });

    return res.status(200).json({
      message: "Question updated successfully",
      result: updatedQuestion,
    });
  } catch (err) {
    console.error("Error updating question:", err);
  }
};

export const deleteTrueFalse = async (req, res) => {
  try {
    const id = req.params.id;
    await Question.destroy({ where: { id: id } });
    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err);
  }
};

export const addChoiceQuestion = async (req, res) => {
  try {
    console.log("updatedQuestion:", req.body);
    const { text, options, type, singleSelect, companyId } = req.body;

    // Validate request body
    if (!text || !type) {
      return res
        .status(400)
        .json({ message: "Question text and type are required." });
    }

    // Check if the type is valid for the available options
    if (type !== "multiple_choice" && options && options.length > 0) {
      return res.status(400).json({
        message: "Options are only allowed for multiple choice questions.",
      });
    }

    // Determine if it's single select (radio button) or multiple select (checkbox)

    // Create the question in the database
    const newQuestion = await Question.create({
      text: text,
      type: type === "radio" || type === "checkbox" ? "multiple_choice" : type,
      options: type === "multiple_choice" ? options : null,
      singleSelect: singleSelect,
      rate: null,
      companyId: companyId,
    });

    // Return success response
    return res.status(201).json({
      message: "Question added successfully",
      question: newQuestion,
    });
  } catch (err) {
    console.error("Error adding question:", err);
    return res.status(500).json({
      message: "An error occurred while adding the question",
      error: err.message,
    });
  }
};

export const addServey = async (req, res) => {
  try {
    console.log("updatedQuestion:", req.body);
    const newQuestion = await Servey.create({
      name: req.body.surveyName,
      isPublished: req.body.isPublished,
      companyId: req.body.companyId,
    });
    return res.status(201).json({
      message: "Question added successfully",
      result: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllServey = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const servey = await Servey.findAll({
      where: { companyId: companyId },
    });
    console.log("servey:", servey);
    res.status(200).json({ message: "success", servey });
  } catch (error) {
    console.error("Error getting all servey:", error);
    res.status(400).json({ message: "failed", error });
  }
};

// export const submitAnswer = async(req, res) => {
//   try {
//     const { questionId, answer, companyId } = req.body;
//     const question = await Question.findById(questionId);
//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//       }

//     }
// }
