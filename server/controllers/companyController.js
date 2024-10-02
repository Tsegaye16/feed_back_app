import Company from "../models/companyModel.js";
import Question from "../models/questionModel.js";
import Servey from "../models/serveyModel.js";
import { Op } from "sequelize";

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
    const { surveyName, isPublished, companyId, id } = req.body;
    if (!id) {
      const newQuestion = await Servey.create({
        name: surveyName,
        isPublished: isPublished,
        companyId: companyId,
      });
      return res.status(201).json({
        message: "Survey added successfully",
        result: newQuestion,
      });
    }
    const updatedQuestion = await Servey.update(
      {
        name: surveyName,
        isPublished: isPublished,
        companyId: companyId,
      },
      { where: { id: id } }
    );
    return res.status(200).json({
      message: "Survey updated successfully",
      result: updatedQuestion,
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

    res.status(200).json({ message: "success", servey });
  } catch (error) {
    console.error("Error getting all servey:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteServey = async (req, res) => {
  try {
    const { id } = req.body;
    // delete all rows from surver based on the list of id
    const result = await Servey.destroy({
      where: {
        id: {
          [Op.in]: id,
        },
      },
    });
    //console.log("result: ", result);
    res.status(200).json({ message: "success", result });
  } catch (err) {
    console.error("Error deleting servey:", err);
    res.status(400).json({ message: error.message });
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

export const addQuestion = async (req, res) => {
  try {
    console.log("Req.Body: ", req.body);
    const newQuestion = await Question.create(req.body);
    res
      .status(201)
      .json({ message: "question have successfully added", newQuestion });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getPreviewParams = async (req, res) => {
  try {
    const serveyId = req.params.serveyId;

    // 1. fetch companyId from Serveys where serveyId = serveyId
    const ServerInfo = await Servey.findOne({
      where: {
        id: serveyId,
      },
      attributes: ["companyId"],
    });
    const companyId = ServerInfo.dataValues.companyId;

    // 2. fetch company name from Companies where id = companyId
    const CompanyInfo = await Company.findOne({
      where: {
        id: companyId,
      },
      attributes: ["name"],
    });
    const companyName = CompanyInfo.dataValues.name;

    // 3. send company name, servey is and message to client
    res.json({ companyName, serveyId, message: "succuss" });
  } catch (error) {
    console.error("Error getting preview:", error);
  }
};

export const getPreviewData = async (req, res) => {
  try {
    const { companyName, surveyId } = req.params;

    // 1. Fetch the company data from Companies by its name
    const CompanyInfo = await Company.findOne({
      where: {
        name: companyName,
      },
    });

    if (!CompanyInfo) {
      console.log(`Company ${companyName} was not found`);
      return res.status(404).json({ message: "Company not found" });
    }

    const companyId = CompanyInfo.id;
    console.log("companyId: ", companyId);

    // 2. Check whether surveyId exists in Serveys table with the correct companyId
    const SurveyInfo = await Servey.findOne({
      where: {
        id: surveyId, // Include surveyId in the query
        companyId: companyId, // Ensure the survey belongs to the company
      },
    });

    if (!SurveyInfo) {
      console.log(
        `Survey with id ${surveyId} was not found for company ${companyId}`
      );
      return res.status(404).json({ message: "Survey not found" });
    }

    console.log("SurveyInfo: ", SurveyInfo);

    // 3. Fetch all questions from the Questions table where surveyId matches
    const QuestionInfo = await Question.findAll({
      where: {
        serveyId: surveyId,
      },
    });

    res.status(200).json({
      questions: QuestionInfo,
      CompanyInfo,
    });
  } catch (error) {
    console.error("Error getting preview:", error);
    res.status(400).json({ message: error.message });
  }
};
