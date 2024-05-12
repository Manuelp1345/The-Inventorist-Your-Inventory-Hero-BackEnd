import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../../utils/types";
import { User } from "../../entities/user.entity";
import Joi from "joi";
import { Resend } from "resend";
import {
  JWT_SECRET,
  REACT_APP_URL,
  RESEND_API_KEY,
} from "../../utils/contants";

const LoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const RegisterSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

export const login = async (req: CustomRequest, res: Response) => {
  const { error } = LoginSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { username, password } = req.body;

  let user = await User.findOne({
    where: { username },
  });

  try {
    user = await User.findOne({
      where: { username },
    });
  } catch (error) {
    return res.status(404).send("User or password incorrect");
  }

  if (!user && user === null) {
    return res.status(404).send("User or password incorrect");
  }

  const validPassword = await bcrypt.compare(password, user?.password);

  if (!validPassword) {
    return res.status(404).send("User or password incorrect");
  }

  const token = jwt.sign({ userName: user?.username }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.send({ token, expiresIn: 3600 });
};

export const register = async (req: CustomRequest, res: Response) => {
  const { error } = RegisterSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { username, password, email } = req.body;

  const userExistsUsername = await User.findOne({
    where: { username },
  });

  const userExistsEmail = await User.findOne({
    where: { email },
  });

  if (userExistsUsername) {
    return res.status(400).send("Username already exists");
  }

  if (userExistsEmail) {
    return res.status(400).send("User email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = User.create({
    username,
    password: hashedPassword,
    email,
  });

  try {
    await user.save();
  } catch (error) {
    return res.status(400).send("Error al crear el usuario");
  }

  res.send(user);
};

export const resetPassword = async (req: CustomRequest, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return res.status(404).send("Email not found");
  }
  const resend = new Resend(RESEND_API_KEY);

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "10m",
  });

  const { data, error } = await resend.emails.send({
    from: "The Inventorist <theInventorist@devmanuel.online>",
    to: [user.email],
    subject: "Reset Password - The Inventorist",
    html: ` <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                color: white;
                font-family: Arial, sans-serif;
            }
            .container {
                background: rgb(46,51,77);
                background: linear-gradient(153deg, rgba(46,51,77,1) 0%, rgba(65,29,40,1) 50%, rgba(237,76,75,1) 100%);
                margin: 0 auto;
                max-width: 600px;
                padding: 20px;
                color: #fff;
            }
            .button {
                background-color: #ED4C4B;
                border: none;
                color: #fff;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>The Inventorist</h1>
            <h2>Your Inventory Hero</h2>
            <p>Click on the following link to reset your password</p>
            <a href="${REACT_APP_URL}/reset-password/${user.id}?token=${token}" class="button">Reset Password</a>
            <p>If you didn't request a password reset, you can ignore this email</p>
            <p>this request expires in 10 minutes</p>
        </div>
    </body>
    </html>
    `,
  });

  if (error) {
    return res.status(400).json({ error });
  }
  console.log(data);
  return res.send("Email sent");
};

export const changePassword = async (req: CustomRequest, res: Response) => {
  const { password, id } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  const user = await User.findOne({
    where: { id: id },
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  jwt.verify(token as string, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).send("The request is invalid or expired");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    try {
      await user.save();
    } catch (error) {
      return res.status(500).send("Error updating password");
    }

    return res.send("Password updated");
  });
};
