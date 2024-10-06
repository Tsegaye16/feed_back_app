import { DataTypes, UUID, UUIDV4 } from "sequelize";

import { sequelize } from "../db.js";

const Company = sequelize.define("Company", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
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
  // managerId: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  //   unique: true,
  // },
});

export default Company;
