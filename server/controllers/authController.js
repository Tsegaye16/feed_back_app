import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import user from "../models/userModel.js";

const secret = "my-secret";

export const signin = async (req, res) => {
  console.log("Req", req.body);
  const { email, password } = req.body;

  try {
    const oldUser = await user.findOne({ where: { email: email } }); // FIX: ensure correct email query
    // console.log("oldUser", oldUser); // Log oldUser.password to verify the password is fetched

    if (!oldUser) {
      console.log("User does not exist");
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Successfully loged in!", token, oldUser });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const oldUser = await user.findOne({ where: { email: email } });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const result = await user.create({
      email,
      password,
      name,
    });

    // const token = jwt.sign({ email: result.email, id: result._id }, secret, {
    //   expiresIn: "1h",
    // });

    res
      .status(201)
      .json({ message: "You have successfully registered", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.userId;

    // Ensure the id is a valid number
    //const parsedId = parseInt(id, 10);

    const newUser = await user.findByPk(id);

    if (!newUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user data
    res.status(200).json({ message: "success", newUser });
  } catch (err) {
    console.error(err);

    // Respond with a generic error message
    res.status(500).json({ message: "Something went wrong" });
  }
};
