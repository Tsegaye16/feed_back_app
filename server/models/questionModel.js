import { DataTypes } from "sequelize";

import { sequelize } from "../db.js";

const Question = sequelize.define("Question", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("True/False", "Choice", "Open", "Rate"),
    allowNull: false,
  },
  options: {
    type: DataTypes.ARRAY(DataTypes.STRING), // For multiple choice questions
    allowNull: true,
  },
  additionalOption: {
    type: DataTypes.ENUM("True/False", "Agree/Disagree", "Yes/No"),
    allowNull: true,
  },
  singleSelect: {
    type: DataTypes.BOOLEAN, // For single/multiple select
    allowNull: true,
  },
});

export default Question;
