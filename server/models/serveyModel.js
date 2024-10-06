import { Sequelize, DataTypes, UUID, UUIDV4 } from "sequelize";

import { sequelize } from "../db.js";

const Servey = sequelize.define("Servey", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please insert the name of the servey" },
    },
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  secretePhrase: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please insert the secrete phrase of the servey" },
    },
    unique: {
      args: true,
      msg: "The secrete phrase already exists, try another",
    },
    // I need to validate that the secretePhrase must be greater tha or equel to 6 character
    validate: {
      len: {
        args: [6],
        msg: "The secrete phrase must be greater than or equal to 6 characters",
      },
    },
  },
});

export default Servey;
