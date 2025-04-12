// src/controllers/summarize.controller.ts
import { Request, Response } from "express";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not defined");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getSurveySummary = async (req, res) => {
  try {
    // 1. Get data from your API
    if (!process.env.SUMMARY_SOURCE_API) {
      throw new Error("SUMMARY_SOURCE_API environment variable is not defined");
    }
    const surveyResponse = await axios.get(process.env.SUMMARY_SOURCE_API);
    const surveyData = JSON.stringify(surveyResponse.data);

    // 2. Prepare Gemini prompt
    const prompt = `
You are an assistant that summarizes user survey data.

Survey Data:
${surveyData}

Provide a clear and short summary of the key insights.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const summary = await result.response.text();

    // 3. Return the summary
    res.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};
