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
    validate: {
      len: {
        args: [8],
        msg: "Password should be at least 8 characters long",
      },
    },
  },
  //   passwordConfirm: {
  //     type: DataTypes.STRING,
  //     allowNull: true,
  //     validate: {
  //       notEmpty: true,
  //       matchesPassword(value) {
  //         if (value !== this.password) {
  //           throw new Error("Passwords are not the same!");
  //         }
  //       },
  //     },
  //   },
});

// Before saving, hash the password and remove passwordConfirm
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  //user.passwordConfirm = undefined;
});

export default User;
