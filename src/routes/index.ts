//router main
import { Router } from "express";
import { Request, Response } from "express";
import authRouter from "./auth";
import { getConnection } from "../middleware/getDB";
import authProduct from "./product";
import verifyToken from "../middleware/verifyToken";
const router = Router();

router.use("/auth", authRouter);
router.use("/product", verifyToken, authProduct);

export default router;
