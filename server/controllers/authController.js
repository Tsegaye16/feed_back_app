import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/userModel.js"; // Adjust the import based on your file structure

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Use any email service provider (e.g., SendGrid, Mailgun)
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  port: 465,
  host: "smtp.gmail.com",
});

export const signup = async (req, res) => {
  try {
    console.log(process.env.MY_EMAIL);
    const tokenExpirationTime = process.env.TOKEN_EXPIRATION_TIME; // Token validity
    const { name, email, password } = req.body;

    // Check if user exists
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      if (!oldUser.isConfirmed) {
        const currentTime = new Date().getTime();
        const createdAtTime = new Date(oldUser.createdAt).getTime();

        if (currentTime - createdAtTime < tokenExpirationTime) {
          return res.status(400).json({
            message:
              "A confirmation email has already been sent. Please check your inbox.",
          });
        }

        const token = jwt.sign(
          { email: oldUser.email, id: oldUser._id },
          process.env.JWT_SECRET,
          {
            expiresIn: tokenExpirationTime,
          }
        );

        const confirmationUrl = `https://customer-feedback-collector.netlify.app/confirm-email?token=${token}`;

        await transporter.sendMail({
          from: process.env.MY_EMAIL,
          to: email,
          subject: "Email Confirmation",
          html: `<h1>Confirm your Email</h1>
                 <p>Your previous confirmation token has expired. Please click the link below:</p>
                 <a href="${confirmationUrl}">Confirm Email</a>`,
        });

        return res.status(400).json({
          message:
            "The previous confirmation token has expired. A new email has been sent.",
        });
      }

      return res
        .status(400)
        .json({ message: "User already exists and confirmed." });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isConfirmed: false,
    });

    const token = jwt.sign({ email, id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: tokenExpirationTime,
    });

    const confirmationUrl = `https://customer-feedback-collector.netlify.app/confirm-email?token=${token}`;

    const mailer = await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Email Confirmation",
      html: `<h1>Confirm your Email</h1>
             <p>Please click the link below:</p>
             <a href="${confirmationUrl}">Confirm Email</a>`,
    });
    console.log("Mailer: ", mailer);

    res.status(201).json({
      message: "You have successfully registered. Please confirm your email.",
      result: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decodedData.email });

    if (!user) {
      return res.status(400).json({ message: "Invalid confirmation link" });
    }

    user.isConfirmed = true;
    await user.save();

    res.status(200).json({ message: "Email confirmed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isConfirmed) {
      return res.status(400).json({ message: "Email is not verified" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Successfully logged in!", token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Success", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const edditProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const image = req.file?.filename;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.image = image || user.image;

    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
