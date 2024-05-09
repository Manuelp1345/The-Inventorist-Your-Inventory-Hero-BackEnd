//router main
import { Router } from "express";
import { login, register } from "../../modules/auth";
const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);

export default authRouter;
