import { DataTypes } from "sequelize";

import { sequelize } from "../db.js";

const Company = sequelize.define("Company", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  backGroundColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  textColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Company;
