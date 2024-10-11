import Company from "../models/companyModel.js";
import Question from "../models/questionModel.js";
import Servey from "../models/serveyModel.js";
import Answer from "../models/answerModel.js";
import { Op } from "sequelize";
import moment from "moment";

export const addOrUpdateCompanyInfo = async (req, res) => {
  try {
    console.log("managerIdd: ", req.body);
    console.log("Image: ", req.file);
    const { name, backgroundColor, textColor, managerId } = req.body;
    const logo = req.file?.filename;

    let company = await Company.findOne({ where: { managerId: managerId } });

    if (company) {
      company.name = name;
      company.logo = logo || company.logo; // Update logo if provided, otherwise keep the existing one
      company.backGroundColor = backgroundColor;
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
        backGroundColor: backgroundColor,
        textColor,
        managerId: managerId,
      });

      return res.status(201).json({
        message: "Company info added successfully",
        result: newCompany,
      });
    }
  } catch (error) {
    console.error("Error adding or updating company info:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, backGroundColor, textColor } = req.body;
    console.log("Req.Body: ", req.body);
    const logo = req.file?.filename;
    const company = await Company.findOne({ where: { id: id } });
    if (company) {
      company.name = name || company.name;
      company.logo = logo || company.logo; // Update logo if provided, otherwise keep the existing one
      company.backGroundColor = backGroundColor || company.backGroundColor;
      company.textColor = textColor || company.textColor;
      await company.save(); // Save the updated company information
      return res.status(200).json({
        message: "Company info updated successfully",
        result: company,
      });
    }
  } catch (error) {
    console.error("Error updating company info:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const id = req.params.id; // Parse the id to an integer
    const company = await Company.findOne({ where: { managerId: id } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ message: "Company found", result: company });
  } catch (error) {
    //console.error("Error getting company by id:", error);
    res.status(400).json({ message: error.message });
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
    // console.log("updatedQuestion:", req.body);
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
    const { surveyName, secretPhrase, isPublished, companyId, id } = req.body;
    if (!id) {
      const newQuestion = await Servey.create({
        name: surveyName,
        secretePhrase: secretPhrase,
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
        secretePhrase: secretPhrase,
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
    //console.error("Error getting all servey:", error);
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
  } catch (error) {
    //console.error("Error deleting servey:", err);
    res.status(400).json({ message: error.message });
  }
};

export const addQuestion = async (req, res) => {
  try {
    // console.log("Req.Body: ", req.body);
    const newQuestion = await Question.create(req.body);
    res
      .status(201)
      .json({ message: "question have successfully added", newQuestion });
  } catch (error) {
    // console.error("Error adding question:", error);
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
      // console.log(`Company ${companyName} was not found`);
      return res.status(404).json({ message: "Company not found" });
    }

    const companyId = CompanyInfo.id;
    // console.log("companyId: ", companyId);

    // 2. Check whether surveyId exists in Serveys table with the correct companyId
    const SurveyInfo = await Servey.findOne({
      where: {
        id: surveyId, // Include surveyId in the query
        companyId: companyId, // Ensure the survey belongs to the company
      },
    });

    if (!SurveyInfo) {
      // console.log(
      //   `Survey with id ${surveyId} was not found for company ${companyId}`
      // );
      return res.status(404).json({ message: "Survey not found" });
    }

    // console.log("SurveyInfo: ", SurveyInfo);

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
    // console.error("Error getting preview:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getQuestionBySurveyId = async (req, res) => {
  try {
    const id = req.params.surveyId;
    // get all question from question where surveyId = id
    const question = await Question.findAll({
      where: {
        serveyId: id,
      },
    });
    console.log("question: ", question);

    res.status(200).json({ question });
  } catch (error) {
    console.error("Error getting question by survey id:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteQuestionById = async (req, res) => {
  try {
    const id = req.body;
    console.log("ID's: ", id);
    // delete all rows from surver based on the list of id
    const result = await Question.destroy({
      where: {
        id: {
          [Op.in]: id,
        },
      },
    });

    res.status(200).json({ message: "success", result });
  } catch (error) {
    //console.error("Error deleting servey:", err);
    res.status(400).json({ message: error.message });
  }
};
// Update question
export const updateQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    // I need to update the question based on the id
    const result = await Question.update(req.body, {
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "success", result });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(400).json({ message: error.message });
  }
};

// get a full servey for client
export const getFullSurvey = async (req, res) => {
  try {
    const secretePhrase = req.params.secretePhrase;
    // 1. get companyId from survey table where secretePhrase = secretePhrase
    const data = await Servey.findOne({
      where: {
        secretePhrase: secretePhrase,
      },
      attributes: ["id", "companyId", "isPublished"],
    });
    console.log("DDAATTAA: ", data);
    if (!data) {
      return res
        .status(404)
        .json({ message: "Survey not found on this secrete phrase" });
    }
    const isPublished = data.dataValues.isPublished;
    if (!isPublished) {
      return res.status(404).json({ message: "Survey is not published" });
    }
    const companyId = data.dataValues.companyId;
    const surveyId = data.dataValues.id;
    console.log("surveyId: ", surveyId);
    // 2. get entire question data from question table where surveyId = surveyId

    const questionData = await Question.findOne({
      where: {
        serveyId: surveyId,
      },
    });

    if (!questionData) {
      return res
        .status(404)
        .json({ message: "Question not found on this survey" });
    }

    // 3. get full company information where companyId = companyId
    const companyData = await Company.findOne({
      where: {
        id: companyId,
      },
    });

    // 4. get managerId from Company where companyId = companyId

    if (!companyData) {
      return res
        .status(404)
        .json({ message: "Company not found on this secrete phrase" });
    }

    res.status(200).json({ message: "success", companyData, questionData });
  } catch (error) {
    console.error("Error getting full survey:", error);
    res.status(400).json({ message: error.message });
  }
};

// Submit Answer

export const submitAnswer = async (req, res) => {
  try {
    const answers = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid request body format" });
    }

    // Iterate over the answers array and insert each into the Answer table
    const insertPromises = answers.map(async (item) => {
      const { id, surveyId, answer } = item; // Assuming 'id' is the questionId

      // Create or insert into the Answer table
      return await Answer.create({
        questionId: id, // Assuming id refers to the question
        surveyId: surveyId,
        answer: typeof answer === "string" ? answer : JSON.stringify(answer), // Store multi-select as JSON
      });
    });

    // Wait for all inserts to finish
    const result = await Promise.all(insertPromises);

    res
      .status(200)
      .json({ message: "Answers submitted successfully", answer: result });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const id = req.params.id; // Get companyId from the request parameters

    // 1. Fetch surveys based on companyId
    const surveys = await Servey.findAll({ where: { companyId: id } });

    if (!surveys.length) {
      return res
        .status(404)
        .json({ message: "No surveys found for this company." });
    }

    // 2. Fetch questions based on fetched surveys
    const surveyIds = surveys.map((survey) => survey._id);
    const questions = await Question.findAll({ serveyId: { $in: surveyIds } });

    if (!questions.length) {
      return res
        .status(404)
        .json({ message: "No questions found for these surveys." });
    }

    // 3. Fetch answers based on fetched questions
    const questionIds = questions.map((question) => question.id);
    const answers = await Answer.findAll({ questionId: { $in: questionIds } });
    console.log("answers: ", answers);
    // 4. Format the data into an easy-to-read format
    const feedbackData = surveys.map((survey) => {
      const surveyQuestions = questions.filter((q) => q.serveyId === survey.id);
      return {
        survey: {
          id: survey.id,
          name: survey.name,
        },
        questions: surveyQuestions.map((question) => {
          const questionAnswers = answers.filter(
            (a) => a.questionId === question.id
          );
          return {
            id: question.id,
            text: question.text,
            type: question.type,
            answers: questionAnswers.map((answer) => ({
              id: answer.id,
              text: answer.answer,
            })),
          };
        }),
      };
    });

    // 5. Send the formatted data back to the client
    res.status(200).json({ feedback: feedbackData });
  } catch (error) {
    console.error("Error getting feedback:", error);
    {
      message: error.message;
    }
  }
};

export const getStatData = async (req, res) => {
  try {
    const id = req.params.id;
    // 1. extract total number of published surveys from Servey table where comnayId = id
    const publishedSurveys = await Servey.count({
      where: { companyId: id, isPublished: true },
    });
    // 1. extract total number of drafted surveys from Servey table where comnayId = id

    const draftedSurvey = await Servey.count({
      where: { companyId: id, isPublished: false },
    });
    // 3. get all survey id from Servey where companyId = id
    const result = await Servey.findAll({
      attributes: ["id"],
      where: { companyId: id },
    });
    const surveyIds = result.map((survey) => survey.id);
    // 4. get total number of question on each survey based on the surveyIds list
    const totalQuestions = await Question.count({
      where: {
        serveyId: {
          [Op.in]: surveyIds, // Match surveyIds from the list
        },
      },
    });

    // 5. Get total number of answers based on surveyIds
    const totalAnswers = await Answer.count({
      where: {
        surveyId: {
          [Op.in]: surveyIds, // Match surveyIds from the list
        },
      },
    });
    // 6. Get total this week's answers (including today)
    const startOfThisWeek = moment().startOf("isoWeek").toDate(); // Start of this week (Monday)
    const endOfToday = moment().endOf("day").toDate(); // End of today

    const thisWeekAnswers = await Answer.count({
      where: {
        surveyId: {
          [Op.in]: surveyIds,
        },
        createdAt: {
          [Op.between]: [startOfThisWeek, endOfToday], // Answers between start of this week and end of today
        },
      },
    });

    // 7. Get total answers for each day of this week (including today)
    const dailyAnswersThisWeek = await Promise.all(
      Array.from({ length: 7 }).map(async (_, index) => {
        const dayStart = moment()
          .subtract(index, "days") // Subtract index from today to get the day for each iteration
          .startOf("day")
          .toDate(); // Start of each day
        const dayEnd = moment(dayStart).endOf("day").toDate(); // End of each day

        const count = await Answer.count({
          where: {
            surveyId: {
              [Op.in]: surveyIds,
            },
            createdAt: {
              [Op.between]: [dayStart, dayEnd], // Answers for each day
            },
          },
        });

        return { day: moment(dayStart).format("dddd"), count }; // Format day as a readable string (e.g., Monday, Tuesday)
      })
    );

    res.status(200).json({
      status: "success",
      data: {
        publishedSurveys,
        draftedSurvey,
        totalQuestions,
        totalAnswers,
        thisWeekAnswers,
        dailyAnswersThisWeek,
      },
    });
  } catch (error) {
    console.error("Error getting stat data:", error);
  }
};
