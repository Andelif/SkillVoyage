import express from "express";
import jwt from "jsonwebtoken";

import {
  loginUser,
  registerUser,
  refreshToken,
  checkUserEmail,
  updateUserImage,
  removeUserImage,
  deleteUserAccount,
  updateUserDetails,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Handle OPTIONS request
userRouter.options("/refresh-token", (req, res) => res.sendStatus(204));

userRouter.post("/update-image", updateUserImage);
userRouter.post("/remove-image", removeUserImage);
userRouter.post("/delete-account", deleteUserAccount);
userRouter.post("/check-email", checkUserEmail);
userRouter.post("/update", updateUserDetails);

// Refresh token endpoint
userRouter.post("/refresh-token", refreshToken);

export default userRouter;
