import Company from "../models/companyModel.js";
import Question from "../models/questionModel.js";
import Servey from "../models/serveyModel.js";
import Answer from "../models/answerModel.js";
import { Op } from "sequelize";
import moment from "moment";
import { sequelize } from "../db.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { GoogleGenAI } from "@google/genai";

import dotenv from 'dotenv';
import User from "../models/userModel.js";

dotenv.config();

export const addOrUpdateCompanyInfo = catchAsync(async (req, res, next) => {
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
});

export const updateCompany = catchAsync(async (req, res, next) => {
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
});

export const getCompanyById = catchAsync(async (req, res, next) => {
  const id = req.params.id; // Parse the id to an integer
  const company = await Company.findOne({ where: { managerId: id } });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  return res.status(200).json({ message: "Company found", result: company });
});

export const getAllquestion = catchAsync(async (req, res) => {
  const companyId = req.params.companyId;
  const questions = await Question.findAll({
    where: { companyId: companyId },
  });
  return res
    .status(200)
    .json({ message: "Questions Fetched", result: questions });
});

export const addServey = catchAsync(async (req, res) => {
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
});

export const publishSurvey = catchAsync(async (req, res) => {
  const surveyId = req.params.surveyId;

  // 1. update the servey column and make isPublished is true when surveyId = surveyId
  const updatedSurvey = await Servey.update(
    { isPublished: true },
    { where: { id: surveyId } }
  );
  res
    .status(200)
    .json({ message: "succussfully published", data: updatedSurvey });
});
export const getAllServey = catchAsync(async (req, res) => {
  const companyId = req.params.companyId;
  const servey = await Servey.findAll({
    where: { companyId: companyId },
  });

  res.status(200).json({ message: "success", servey });
});

export const deleteServey = catchAsync(async (req, res) => {
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
});

export const addQuestion = catchAsync(async (req, res) => {
  const newQuestion = await Question.create(req.body);
  res
    .status(201)
    .json({ message: "question have successfully added", newQuestion });
});

export const getPreviewParams = catchAsync(async (req, res) => {
  const serveyId = req.params.serveyId;

  // Fetch the Servey along with its associated Company in a single query
  const servey = await Servey.findOne({
    where: { id: serveyId },
    include: [
      {
        model: Company,
        attributes: ["name"],
      },
    ],
    attributes: [], // Exclude Servey attributes, we only need the included Company
  });

  if (!servey) {
    return res.status(404).json({ message: "Servey not found" });
  }

  const companyName = servey.Company.name;

  // Send company name, serveyId, and message to client
  res.json({ companyName, serveyId, message: "success" });
});

export const getPreviewData = catchAsync(async (req, res, next) => {
  const { companyName, surveyId } = req.params;

  // Fetch the Company along with its associated Serveys and Questions in a single query
  const company = await Company.findOne({
    where: { name: companyName },
    include: [
      {
        model: Servey,
        where: { id: surveyId },
        include: [
          {
            model: Question,
            order: [["index", "ASC"]],
          },
        ],
      },
    ],
  });

  if (!company) {
    return next(new AppError("Company or Survey not found", 404));
  }

  const questions = company.Serveys[0]?.Questions || [];

  res.status(200).json({
    questions,
    company,
  });
});


export const getQuestionBySurveyId = catchAsync(async (req, res) => {
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
});

export const deleteQuestionById = catchAsync(async (req, res) => {
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
});
// Update question
export const updateQuestion = catchAsync(async (req, res) => {
  const id = req.params.id;
  // I need to update the question based on the id
  const [updatedCount, [updatedQuestion]] = await Question.update(req.body, {
    where: {
      id: id,
    },
    returning: true,
  });
  res.status(200).json({ message: "success", updatedQuestion });
});

export const sortQuestion = catchAsync(async (req, res) => {
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
});

// get a full servey for client
export const getFullSurvey = catchAsync(async (req, res, next) => {
  const secretePhrase = req.params.secretePhrase;

  // Fetch the Servey along with its associated Company and Questions in a single query
  const servey = await Servey.findOne({
    where: { secretePhrase: secretePhrase, isPublished: true },
    include: [
      {
        model: Company,
        include: [
          {
            model: User,
            as: "manager",
            attributes: ["id", "name", "email"], // Include manager details if needed
          },
        ],
      },
      {
        model: Question,
        order: [["index", "ASC"]],
      },
    ],
    attributes: ["id", "companyId", "isPublished"],
  });

  if (!servey) {
    return next(new AppError("Survey not found or not published", 404));
  }

  const companyData = servey.Company;
  const questionData = servey.Questions;

  res.status(200).json({ message: "success", companyData, questionData });
});



const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

const analyzeSentiment = async (text) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze the sentiment of the following text: "${text}"`,
    });
    const sentimentText = response.text.toLowerCase();
    if (sentimentText.includes("positive")) {
      return "POSITIVE";
    } else if (sentimentText.includes("negative")) {
      return "NEGATIVE";
    } else {
      return "NEUTRAL";
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return "NEUTRAL";
  }
};

export const submitAnswer = catchAsync(async (req, res, next) => {
  const answers = req.body;

  if (!answers || !Array.isArray(answers)) {
    return next(new AppError("Invalid request body format", 400));
  }

  // Iterate over the answers array and analyze sentiment for each answer before inserting
  const insertPromises = answers.map(async (item) => {
    const { id, surveyId, answer } = item; // Assuming 'id' is the questionId

    let sentiment = "NEUTRAL"; // Default sentiment for non-string answers (e.g., number)

    if (typeof answer === "string") {
      sentiment = await analyzeSentiment(answer);
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

  res.status(200).json({ message: "Answers submitted successfully", answer: result });
});


export const getFeedback = catchAsync(async (req, res, next) => {
  const companyId = req.params.id;

  // 1. Fetch surveys based on companyId
  const surveys = await Servey.findAll({ where: { companyId } });

  if (!surveys.length) {
    return next(new AppError("No surveys found for the company", 404));
  }

  // 2. Fetch survey IDs and names along with aggregated answers
  const surveyData = await Promise.all(
      surveys.map(async (survey) => {
        // Fetch and count answers grouped by createdAt truncated to the minute
        const answersGrouped = await Answer.findAll({
          where: { surveyId: survey.id },
          attributes: [
            [sequelize.fn("date_trunc", "minute", sequelize.col("createdAt")), "createdAt"],
            [sequelize.fn("COUNT", sequelize.col("id")), "answerCount"],
          ],
          group: [sequelize.fn("date_trunc", "minute", sequelize.col("createdAt"))],
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

  res.status(200).json({ message: "success", feedback: surveyData });
});

export const getStatData = catchAsync(async (req, res) => {
  const companyId = req.params.id;

  // Fetch survey counts and IDs
  const surveyCounts = await Servey.findAll({
    where: { companyId },
    attributes: [
      "id",
      [sequelize.fn("COUNT", sequelize.col("id")), "totalSurveys"],
      [sequelize.literal("SUM(CASE WHEN \"isPublished\" = true THEN 1 ELSE 0 END)"), "publishedSurveys"],
      [sequelize.literal("SUM(CASE WHEN \"isPublished\" = false THEN 1 ELSE 0 END)"), "draftedSurveys"],
    ],
    group: ["Servey.id"],
    raw: true,
  });

  const surveyIds = surveyCounts.map((survey) => survey.id);

  // Fetch total questions and answers
  const totalQuestions = await Question.count({
    where: { serveyId: { [Op.in]: surveyIds } },
  });

  const allAnswers = await Answer.findAll({
    where: { surveyId: { [Op.in]: surveyIds } },
  });

  // Calculate average rate
  const numericAnswers = allAnswers
      .map((answer) => parseFloat(answer.answer))
      .filter((value) => !isNaN(value));

  const averageRate =
      numericAnswers.length > 0
          ? numericAnswers.reduce((sum, value) => sum + value, 0) / numericAnswers.length
          : 0;

  // Calculate total distinct answers grouped by createdAt
  const totalAnswers = await Answer.count({
    where: { surveyId: { [Op.in]: surveyIds } },
    group: sequelize.fn("date_trunc", "minute", sequelize.col("createdAt")),
  });

  // Calculate answers for this week
  const startOfThisWeek = moment().startOf("isoWeek").toDate();
  const endOfToday = moment().endOf("day").toDate();

  const thisWeekAnswers = await Answer.count({
    where: {
      surveyId: { [Op.in]: surveyIds },
      createdAt: { [Op.between]: [startOfThisWeek, endOfToday] },
    },
    group: sequelize.fn("date_trunc", "minute", sequelize.col("createdAt")),
  });

  // Calculate daily answers for this week
  const dailyAnswersThisWeek = await Promise.all(
      Array.from({ length: 7 }).map(async (_, index) => {
        const dayStart = moment().subtract(index, "days").startOf("day").toDate();
        const dayEnd = moment(dayStart).endOf("day").toDate();

        const count = await Answer.count({
          where: {
            surveyId: { [Op.in]: surveyIds },
            createdAt: { [Op.between]: [dayStart, dayEnd] },
          },
          group: sequelize.fn("date_trunc", "minute", sequelize.col("createdAt")),
        });

        return { day: moment(dayStart).format("dddd"), count: count.length };
      })
  );

  // Calculate sentiment breakdown
  const sentimentCounts = { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 };

  allAnswers.forEach((answer) => {
    const sentiment = answer.sentiment;
    if (sentimentCounts[sentiment] !== undefined) {
      sentimentCounts[sentiment]++;
    }
  });

  const totalSentiments =
      sentimentCounts.POSITIVE + sentimentCounts.NEGATIVE + sentimentCounts.NEUTRAL;
  const averageSentiment = {
    POSITIVE: totalSentiments > 0 ? Math.round((sentimentCounts.POSITIVE / totalSentiments) * 100) : 0,
    NEGATIVE: totalSentiments > 0 ? Math.round((sentimentCounts.NEGATIVE / totalSentiments) * 100) : 0,
    NEUTRAL: totalSentiments > 0 ? Math.round((sentimentCounts.NEUTRAL / totalSentiments) * 100) : 0,
  };

  res.status(200).json({
    status: "success",
    data: {
      publishedSurveys: parseInt(surveyCounts[0]?.publishedSurveys || 0),
      draftedSurvey: parseInt(surveyCounts[0]?.draftedSurveys || 0),
      totalQuestions,
      totalAnswers: totalAnswers.length,
      thisWeekAnswers: thisWeekAnswers.length,
      dailyAnswersThisWeek,
      averageRate,
      averageSentiment,
    },
  });
});



export const getFeedbackDetail = catchAsync(async (req, res, next) => {
  const surveyId = req.params.surveyId;

  // 1. Fetch all answers based on the surveyId
  const answers = await Answer.findAll({
    where: {
      surveyId: surveyId,
    },
    raw: true, // Fetch data as raw objects
  });

  if (!answers || answers.length === 0) {
    return next(new AppError("No answers found for the given survey ID.", 404));
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
  const questionIds = [...new Set(answers.map((answer) => answer.questionId))]; // Get unique question IDs

  const questions = await Question.findAll({
    where: {
      id: {
        [Op.in]: questionIds,
      },
    },
    raw: true,
  });

  if (!questions || questions.length === 0) {
    return next(
      new AppError("No questions found for the given survey ID.", 404)
    );
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
});

export const getRecentFeedback = catchAsync(async (req, res, next) => {
  const companyId = req.params.companyId;

  // 1. Get all surveys from Survey table where companyId = companyId
  const surveys = await Servey.findAll({
    where: {
      companyId,
    },
    attributes: ["id"], // Only fetching the survey ids
  });

  if (!surveys || surveys.length === 0) {
    return next(new AppError("No surveys found for this company.", 404));
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
    return next(
      new AppError("No answers found for today for the given survey IDs.", 404)
    );
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
  const questionIds = [...new Set(answers.map((answer) => answer.questionId))]; // Get unique question IDs

  const questions = await Question.findAll({
    where: {
      id: {
        [Op.in]: questionIds,
      },
    },
    raw: true,
  });

  if (!questions || questions.length === 0) {
    return next(
      new AppError("No questions found for the related answers.", 404)
    );
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
});


export const checkSecretePhrase = catchAsync(async (req, res, next) => {
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
});