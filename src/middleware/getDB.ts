import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../utils/types";
import { connectToDatabase } from "../utils/db";

export const getConnection = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let connection;
  try {
    connection = await connectToDatabase();
  } catch (error) {
    console.error("Error al conectar a la base de datos", error);
    throw error;
  }

  next();
};
