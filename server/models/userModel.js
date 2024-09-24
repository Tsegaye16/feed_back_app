import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../db.js";

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please tell us your name!" },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    lowercase: true,
    validate: {
      isEmail: { msg: "Please provide a valid email" },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Before saving, hash the password and remove passwordConfirm
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

export default User;
