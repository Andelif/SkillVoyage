import express from "express"
import { loginUser, registerUser, refreshToken } from "../controllers/userController.js";

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/refresh-token", refreshToken); // Refresh token route


export default userRouter;