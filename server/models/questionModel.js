import { DataTypes } from "sequelize";

import { sequelize } from "../db.js";

const Question = sequelize.define("Question", {
  text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM("true_false", "multiple_choice", "essay", "rate"),
    allowNull: false,
  },
  options: {
    type: DataTypes.ARRAY(DataTypes.STRING), // For multiple choice questions
    allowNull: true,
  },
  singleSelect: {
    type: DataTypes.BOOLEAN, // For single/multiple select
    allowNull: true,
  },
  rate: {
    type: DataTypes.INTEGER, // For rate question (1-5 stars)
    allowNull: true,
  },
});

export default Question;
