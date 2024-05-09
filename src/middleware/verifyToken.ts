import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../utils/types";
import { User } from "../entities/user.entity";
import { JWT_SECRET } from "../utils/contants";

const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No se proporcionó un token de autenticación" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    let getUser;

    try {
      getUser = await User.findOne({
        where: { username: (decoded as User).username },
      });
    } catch (error) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.user = getUser as User;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export default verifyToken;
