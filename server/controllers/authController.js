import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import user from "../models/userModel.js";

const secret = "this_is-my-secrete_password/for$node*mailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any email service provider (e.g., SendGrid, Mailgun)
  auth: {
    user: process.env.MY_EMAIL, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password (use environment variables in production)
  },
});

export const signup = async (req, res) => {
  try {
    const tokenExpirationTime = process.env.TOKEN_EXPIRATION_TIME; // 1 hour in milliseconds
    const { name, email, password } = req.body;

    // Check if user with the given email already exists
    const oldUser = await user.findOne({ where: { email: email } });

    if (oldUser) {
      // If the user exists but hasn't confirmed their email
      if (!oldUser.isConfirmed) {
        const currentTime = new Date().getTime();
        const createdAtTime = new Date(oldUser.createdAt).getTime(); // Get the creation time of the user

        // Check if the token (based on creation time) has expired
        if (currentTime - createdAtTime < tokenExpirationTime) {
          return res.status(400).json({
            message:
              "A confirmation email has already been sent. Please check your inbox and confirm your email.",
          });
        }

        // Generate a new token if the old one (based on createdAt) has expired
        const token = jwt.sign(
          { email: oldUser.email, id: oldUser.id },
          secret,
          {
            expiresIn: tokenExpirationTime, // Token valid for 1 hour
          }
        );

        const confirmationUrl = `http://localhost:3000/confirm-email?token=${token}`;

        await transporter.sendMail({
          from: process.env.MY_EMAIL,
          to: email,
          subject: "Email Confirmation",
          html: `<h1>Confirm your Email</h1>
                 <p>Your previous confirmation token has expired. Please click on the link below to confirm your email:</p>
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

    // Create new user if no existing user with the email
    const token = jwt.sign({ email, id: name }, secret, {
      expiresIn: tokenExpirationTime, // Token valid for 1 hour
    });

    const result = await user.create({
      email,
      password,
      name,
      isConfirmed: false, // Default to false until email is confirmed
    });

    const confirmationUrl = `http://localhost:3000/confirm-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Email Confirmation",
      html: `<h1>Confirm your Email</h1>
             <p>Please click on the link below to confirm your email:</p>
             <a href="${confirmationUrl}">Confirm Email</a>`,
    });

    res.status(201).json({
      message: "You have successfully registered. Please confirm your email.",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmEmail = async (req, res) => {
  const token = req.params.token;

  try {
    // Verify the token
    const decodedData = jwt.verify(token, secret);

    // Find the user by email and mark email as confirmed
    const existingUser = await user.findOne({
      where: { email: decodedData.email },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid confirmation link" });
    }

    // Mark the user as confirmed (you may want to add a field like 'isConfirmed' in the user model)
    const data = await user.update(
      { isConfirmed: true },
      { where: { email: decodedData.email } }
    );

    res
      .status(200)
      .json({ data: data, message: "Email confirmed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await user.findOne({ where: { email: email } }); // FIX: ensure correct email query

    if (!oldUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // check whether it is verified or not
    if (oldUser.isConfirmed === false) {
      return res.status(400).json({ message: "Email is not verified" });
    }

    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Successfully loged in!", token, oldUser });
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
  } catch (error) {
    //console.error(err);

    // Respond with a generic error message
    res.status(500).json({ message: error.message });
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
    const result = await updatingUser.save();

    // 5. Return success response
    return res
      .status(200)
      .json({ message: "Password updated successfully", result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating password" });
  }
};
