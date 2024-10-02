import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./db.js";
import app from "./app.js";
import User from "./models/userModel.js";
import Question from "./models/questionModel.js";
import Company from "./models/companyModel.js";
import Servey from "./models/serveyModel.js";

// Load environment variables
dotenv.config();

/////////////////////////////////////////////////////////////////////////////////////
//Define table Relations
//A company has one manager (user)
Company.belongsTo(User, { as: "manager", foreignKey: "managerId" });
User.hasMany(Company, { foreignKey: "managerId" });

// A company has many Servey
Company.hasMany(Servey, { foreignKey: "companyId" });
Servey.belongsTo(Company, { foreignKey: "companyId" });
//*************************** */
// A Servey has many questions
Servey.hasMany(Question, { foreignKey: "serveyId" });
Question.belongsTo(Servey, { foreignKey: "serveyId" });
//************************* */
///////////////////////////////////////////////////////////////////////////////////

// Test DB connectivity
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

// Sync all models
const syncDatabase = async () => {
  try {
    // Adjust force as per your needs: force: true in development, force: false in production
    await sequelize.sync({ force: false }); // Use force: true only when you want to reset tables
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  }
};
//console
syncDatabase();

// Start the server
const port = process.env.PORT || 3000; // Default to 3000 if no env variable set
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
