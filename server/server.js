import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

// Load environment variables
dotenv.config();

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err.message);
  });

// Start the server
const port = process.env.PORT; // Default to 4000 if no env variable set
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
