import { Sequelize, DataTypes, UUID, UUIDV4 } from "sequelize";

import { sequelize } from "../db.js";

const Answer = sequelize.define("Answer", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },

  answer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  surveyId: {
    type: UUID,
    allowNull: false,
  },
  sentiment: {
    type: DataTypes.ENUM("POSITIVE", "NEGATIVE", "NEUTRAL"),
    allowNull: false,
  },
});

export default Answer;
