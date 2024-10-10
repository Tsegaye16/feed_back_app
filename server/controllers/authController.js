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

export const edditProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const id = req.params.id;
    const image = req.file?.filename;
    // 1. get user bay id
    const updatingUser = await user.findByPk(id);
    // 2. if user does not exist return
    if (!updatingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // 3. update user
    updatingUser.name = name || updatingUser.name;
    updatingUser.email = email || updatingUser.email;
    updatingUser.image = image || updatingUser.image;
    // 4. save user
    const saved = await updatingUser.save();
    // 5. return user
    res.status(200).json({ message: "success", user: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, email } = req.body;

    // 1. Fetch user based on email
    const updatingUser = await user.findOne({ where: { email } });

    // 2. If user does not exist, return an error
    if (!updatingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Check if the current password is correct
    const isValidPassword = await updatingUser.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // 4. Hash the new password and update it
    updatingUser.password = await bcrypt.hash(newPassword, 12);
    await updatingUser.save();

    // 5. Return success response
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating password" });
  }
};
