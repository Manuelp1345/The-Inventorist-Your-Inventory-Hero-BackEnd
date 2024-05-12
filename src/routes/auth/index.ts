//router main
import { Router } from "express";
import {
  changePassword,
  login,
  register,
  resetPassword,
} from "../../modules/auth";
const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/change-password", changePassword);

export default authRouter;
