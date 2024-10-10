import { Sequelize, DataTypes, UUID, UUIDV4 } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../db.js";

const User = sequelize.define("User", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
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
      notEmpty: { msg: "Please provide a password" },
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Before saving, hash the password and remove passwordConfirm
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;
