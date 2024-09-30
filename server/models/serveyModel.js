import { Sequelize, DataTypes } from "sequelize";

import { sequelize } from "../db.js";

const Servey = sequelize.define("Servey", {
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
});

export default Servey;
