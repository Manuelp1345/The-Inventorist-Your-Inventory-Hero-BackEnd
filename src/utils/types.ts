import { Request } from "express";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";

export interface CustomRequest extends Request {
  user?: User;
}
