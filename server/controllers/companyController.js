import Company from "../models/companyModel.js";
import Question from "../models/questionModel.js";
import Servey from "../models/serveyModel.js";
import Answer from "../models/answerModel.js";
import { Op } from "sequelize";
import moment from "moment";
import { sequelize } from "../db.js";

export const addOrUpdateCompanyInfo = async (req, res) => {
  try {
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

export const publishSurvey = async (req, res) => {
  try {
    const surveyId = req.params.surveyId;

    // 1. update the servey column and make isPublished is true when surveyId = surveyId
    const updatedSurvey = await Servey.update(
      { isPublished: true },
      { where: { id: surveyId } }
    );
    res
      .status(200)
      .json({ message: "succussfully published", data: updatedSurvey });
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

    res.status(200).json({ message: "success", result });
  } catch (error) {
    //console.error("Error deleting servey:", err);
    res.status(400).json({ message: error.message });
  }
};

export const addQuestion = async (req, res) => {
  try {
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
      return res.status(404).json({ message: "Company not found" });
    }

    const companyId = CompanyInfo.id;

    // 2. Check whether surveyId exists in Serveys table with the correct companyId
    const SurveyInfo = await Servey.findOne({
      where: {
        id: surveyId, // Include surveyId in the query
        companyId: companyId, // Ensure the survey belongs to the company
      },
    });

    if (!SurveyInfo) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // 3. Fetch all questions from the Questions table where surveyId matches
    const QuestionInfo = await Question.findAll({
      where: {
        serveyId: surveyId,
      },
      order: [["index", "ASC"]],
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

    const Answers = await Answer.count({
      where: {
        surveyId: id,
      },
      group: sequelize.fn("date_trunc", "minute", sequelize.col("createdAt")),
    });

    // console.log("Answers: ", Answers);

    // 8. Get total distinct answers for this week (grouped by createdAt)
    const startOfThisWeek = moment().startOf("isoWeek").toDate(); // Start of this week (Monday)
    const endOfToday = moment().endOf("day").toDate(); // End of today

    const thisWeekAnswers = await Answer.count({
      where: {
        surveyId: id,
        createdAt: {
          [Op.between]: [startOfThisWeek, endOfToday], // Answers between start of this week and end of today
        },
      },
      group: sequelize.fn("date_trunc", "minute", sequelize.col("createdAt")), // Group by createdAt truncated to the minute
    });

    //console.log("thisWeekAnswers: ", thisWeekAnswers);

    res.status(200).json({
      question: question,
      tottalFeedback: Answers.length,
      weeklyFeedback: thisWeekAnswers.length,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteQuestionById = async (req, res) => {
  try {
    const id = req.body;

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
    const [updatedCount, [updatedQuestion]] = await Question.update(req.body, {
      where: {
        id: id,
      },
      returning: true,
    });
    res.status(200).json({ message: "success", updatedQuestion });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(400).json({ message: error.message });
  }
};

export const sortQuestion = async (req, res) => {
  try {
    const questionsToUpdate = req.body; // Array of { id, index } objects

    // Execute all updates in parallel for better performance
    const updatePromises = questionsToUpdate.map(({ id, index }) =>
      Question.update({ index }, { where: { id } })
    );
    await Promise.all(updatePromises);

    // Retrieve the updated questions sorted by their new indices
    const updatedQuestions = await Question.findAll({
      where: {
        id: questionsToUpdate.map((q) => q.id),
      },
      order: [["index", "ASC"]],
    });

    // Send the updated list of questions back in the response
    res.status(200).json({ message: "Success.", updatedQuestions });
  } catch (error) {
    console.error("Error updating question indices:", error);
    res.status(500).json({ error: "Failed to reorder questions." });
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
// import { pipeline } from "@xenova/transformers";
// let pip;
// (async () => {
//   pip = await pipeline("sentiment-analysis");
// })();

export const submitAnswer = async (req, res) => {
  try {
    const answers = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid request body format" });
    }

    // Iterate over the answers array and analyze sentiment for each answer before inserting
    const insertPromises = answers.map(async (item) => {
      const { id, surveyId, answer } = item; // Assuming 'id' is the questionId

      let sentiment = "NEUTRAL"; // Default sentiment for non-string answers (e.g., number)

      // If answer is a string, analyze its sentiment
      if (typeof answer === "string") {
        try {
          // Analyze sentiment using the loaded pipeline
          //const sentimentAnalysisResult = await pip(answer);
          // sentiment = sentimentAnalysisResult[0]?.label || "NEUTRAL"; // Default to "NEUTRAL" if no result
        } catch (error) {
          console.error("Error analyzing sentiment:", error);
        }
      }

      // Create or insert into the Answer table with the sentiment
      return await Answer.create({
        questionId: id, // Assuming id refers to the question
        surveyId: surveyId,
        answer: typeof answer === "string" ? answer : JSON.stringify(answer), // Store multi-select as JSON or keep string
        sentiment: sentiment, // Store the sentiment result or "NEUTRAL" for non-string answers
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

    // 2. Fetch survey IDs and names
    const surveyData = await Promise.all(
      surveys.map(async (survey) => {
        // Fetch and count answers grouped by createdAt truncated to the minute
        const answersGrouped = await Answer.findAll({
          where: { surveyId: survey.id },
          attributes: [
            [
              sequelize.fn("date_trunc", "minute", sequelize.col("createdAt")),
              "createdAt",
            ],
            [sequelize.fn("COUNT", sequelize.col("id")), "answerCount"],
          ],
          group: [
            sequelize.fn("date_trunc", "minute", sequelize.col("createdAt")),
          ],
          raw: true,
        });

        // Count unique grouped entries
        const answerCount = answersGrouped.length;

        return {
          surveyId: survey.id,
          surveyName: survey.name,
          answerCount, // Count of unique 'createdAt' groups for the survey
        };
      })
    );

    console.log("surveyData: ", surveyData);

    res.status(200).json({ message: "success", feedback: surveyData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getStatData = async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Extract total number of published surveys from Servey table where companyId = id
    const publishedSurveys = await Servey.count({
      where: { companyId: id, isPublished: true },
    });

    // 2. Extract total number of drafted surveys from Servey table where companyId = id
    const draftedSurvey = await Servey.count({
      where: { companyId: id, isPublished: false },
    });

    // 3. Get all survey IDs from Servey where companyId = id
    const result = await Servey.findAll({
      attributes: ["id"],
      where: { companyId: id },
    });
    const surveyIds = result.map((survey) => survey.id);

    // 4. Get total number of questions for each survey based on the surveyIds list

    const totalQuestions = await Question.count({
      where: {
        serveyId: {
          [Op.in]: surveyIds, // Match surveyIds from the list
        },
      },
    });

    // 5. Get all answers for the given surveys
    const allAnswers = await Answer.findAll({
      where: {
        surveyId: {
          [Op.in]: surveyIds, // Match surveyIds from the list
        },
      },
    });

    // 6. Filter numeric answers (those representing rates) and calculate the average rate
    const numericAnswers = allAnswers
      .map((answer) => parseFloat(answer.answer))
      .filter((value) => !isNaN(value)); // Filter only valid numeric values

    const averageRate =
      numericAnswers.length > 0
        ? numericAnswers.reduce((sum, value) => sum + value, 0) /
          numericAnswers.length
        : 0; // Calculate average, default to 0 if no numeric answers

    // 7. Get total number of distinct answers grouped by createdAt based on surveyIds
    const totalAnswers = await Answer.count({
      where: {
        surveyId: {
          [Op.in]: surveyIds, // Match surveyIds from the list
        },
      },
      group: sequelize.fn("date_trunc", "minute", sequelize.col("createdAt")), // Group by createdAt truncated to the minute
    });
    // console.log("totalAnswers: ", totalAnswers);
    // 8. Get total distinct answers for this week (grouped by createdAt)
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
      group: sequelize.fn("date_trunc", "minute", sequelize.col("createdAt")), // Group by createdAt truncated to the minute
    });

    // 9. Get total distinct answers for each day of this week (grouped by createdAt)
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
          group: sequelize.fn(
            "date_trunc",
            "minute",
            sequelize.col("createdAt")
          ), // Group by createdAt truncated to the minute
        });

        return { day: moment(dayStart).format("dddd"), count: count.length }; // Format day as a readable string (e.g., Monday, Tuesday), and count distinct entries
      })
    );

    // 10. Calculate sentiment breakdown (positive, negative, neutral)
    const sentimentCounts = {
      POSITIVE: 0,
      NEGATIVE: 0,
      NEUTRAL: 0,
    };

    allAnswers.forEach((answer) => {
      const sentiment = answer.sentiment;
      if (sentimentCounts[sentiment] !== undefined) {
        sentimentCounts[sentiment]++;
      }
    });

    const totalSentiments =
      sentimentCounts.POSITIVE +
      sentimentCounts.NEGATIVE +
      sentimentCounts.NEUTRAL;
    const averageSentiment = {
      POSITIVE:
        totalSentiments > 0
          ? Math.round((sentimentCounts.POSITIVE / totalSentiments) * 100)
          : 0,
      NEGATIVE:
        totalSentiments > 0
          ? Math.round((sentimentCounts.NEGATIVE / totalSentiments) * 100)
          : 0,
      NEUTRAL:
        totalSentiments > 0
          ? Math.round((sentimentCounts.NEUTRAL / totalSentiments) * 100)
          : 0,
    };

    res.status(200).json({
      status: "success",
      data: {
        publishedSurveys,
        draftedSurvey,
        totalQuestions,
        totalAnswers: totalAnswers.length, // Length of distinct entries
        thisWeekAnswers: thisWeekAnswers.length, // Length of distinct entries
        dailyAnswersThisWeek,
        averageRate,
        averageSentiment,
      },
    });
  } catch (error) {
    // console.error("Error getting stat data:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getFeedbackDetail = async (req, res) => {
  try {
    const surveyId = req.params.surveyId;

    // 1. Fetch all answers based on the surveyId
    const answers = await Answer.findAll({
      where: {
        surveyId: surveyId,
      },
      raw: true, // Fetch data as raw objects
    });

    if (!answers || answers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No answers found for the given survey ID.",
      });
    }

    // 2. Group the fetched answers by createdAt (including hour, minute, second, millisecond)
    const groupedAnswers = answers.reduce((acc, answer) => {
      const createdAtFull = moment(answer.createdAt).format(
        "YYYY-MM-DD HH:mm:ss"
      ); // Full timestamp including milliseconds

      if (!acc[createdAtFull]) {
        acc[createdAtFull] = [];
      }
      acc[createdAtFull].push(answer);
      return acc;
    }, {});

    // 3. Fetch the questions related to the grouped answers (question.id = answer.questionId)
    const questionIds = [
      ...new Set(answers.map((answer) => answer.questionId)),
    ]; // Get unique question IDs

    const questions = await Question.findAll({
      where: {
        id: {
          [Op.in]: questionIds,
        },
      },
      raw: true,
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No questions found for the related answers.",
      });
    }

    // 4. Send the grouped question with answer to the client-side
    const response = Object.keys(groupedAnswers).map((timestamp) => {
      const answersForTimestamp = groupedAnswers[timestamp];

      const questionsWithAnswers = answersForTimestamp.map((answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        return {
          question: question ? question.text : "Question not found", // You can adjust to return full question details if needed
          answer: answer.answer, // Assuming your Answer model has an 'answerText' field
        };
      });

      return {
        timestamp, // Full timestamp (YYYY-MM-DD HH:mm:ss.SSS)
        questionsWithAnswers,
      };
    });

    return res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    // console.error("Error fetching feedback details:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getRecentFeedback = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // 1. Get all surveys from Survey table where companyId = companyId
    const surveys = await Servey.findAll({
      where: {
        companyId,
      },
      attributes: ["id"], // Only fetching the survey ids
    });

    if (!surveys || surveys.length === 0) {
      return res
        .status(404)
        .json({ message: "No surveys found for this company." });
    }

    // Extract survey IDs
    const surveyIds = surveys.map((survey) => survey.id);

    const todayStart = moment().startOf("day").toDate(); // Start of today
    const todayEnd = moment().endOf("day").toDate(); // End of today

    // 2. Fetch all answers based on the surveyIds and within today's date range
    const answers = await Answer.findAll({
      where: {
        surveyId: {
          [Op.in]: surveyIds, // Fetch answers for the surveys from the given companies
        },
        createdAt: {
          [Op.between]: [todayStart, todayEnd], // Fetch only today's answers
        },
      },
      raw: true, // Fetch data as raw objects
    });

    if (!answers || answers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No answers found for today for the given survey IDs.",
      });
    }

    // 3. Group the fetched answers by createdAt (including hour, minute, second, millisecond)
    const groupedAnswers = answers.reduce((acc, answer) => {
      const createdAtFull = moment(answer.createdAt).format(
        "YYYY-MM-DD HH:mm:ss"
      ); // Full timestamp including milliseconds

      if (!acc[createdAtFull]) {
        acc[createdAtFull] = [];
      }
      acc[createdAtFull].push(answer);
      return acc;
    }, {});

    // 4. Fetch the questions related to the grouped answers (question.id = answer.questionId)
    const questionIds = [
      ...new Set(answers.map((answer) => answer.questionId)),
    ]; // Get unique question IDs

    const questions = await Question.findAll({
      where: {
        id: {
          [Op.in]: questionIds,
        },
      },
      raw: true,
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No questions found for the related answers.",
      });
    }

    // 5. Send the grouped questions with answers to the client-side
    const response = Object.keys(groupedAnswers).map((timestamp) => {
      const answersForTimestamp = groupedAnswers[timestamp];

      const questionsWithAnswers = answersForTimestamp.map((answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        return {
          question: question ? question.text : "Question not found", // Return question text or default
          answer: answer.answer, // Assuming your Answer model has an 'answer' field
        };
      });

      return {
        timestamp, // Full timestamp (YYYY-MM-DD HH:mm:ss.SSS)
        questionsWithAnswers,
      };
    });
    return res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching feedback: ", error);
    res.status(400).json({ message: error.message });
  }
};

export const checkSecretePhrase = async (req, res) => {
  try {
    const { phrase } = req.body;
    //const secretPhrase = Object.keys(phrase)[0];
    // 1. check the secrete survey is present or not on survey table

    const survey = await Servey.findOne({
      where: {
        secretePhrase: phrase,
      },
    });
    if (survey) {
      res.status(400).json({ message: "currently in use" });
    } else {
      res.status(200).json({ message: "available" });
    }
  } catch (erro) {
    console.error("Error fetching feedback: ", erro);
    res.status(400).json({ message: erro.message });
  }
};
