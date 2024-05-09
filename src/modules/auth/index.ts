import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../../utils/types";
import { User } from "../../entities/user.entity";
import Joi from "joi";
import { JWT_SECRET } from "../../utils/contants";

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

  res.send({ token });
};

export const register = async (req: CustomRequest, res: Response) => {
  const { error } = RegisterSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { username, password, email } = req.body;

  const userExists = await User.findOne({
    where: { email },
  });

  if (userExists) {
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
