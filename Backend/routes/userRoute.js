import express from "express"
import jwt from "jsonwebtoken";

import { loginUser, registerUser, refreshToken } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser);

// Handle OPTIONS request
userRouter.options('/refresh-token', (req, res) => res.sendStatus(204));

// Refresh token endpoint
userRouter.post('/refresh-token', refreshToken);

// userRouter.post('/refresh-token', (req, res) => {
//     const refreshToken = req.cookies['refreshToken'];
  
//     if (!refreshToken) {
//       return res.status(401).json({ message: 'Unauthorized, refresh token missing' });
//     }
  
//     try {
//       // Verify refresh token
//       const decoded = jwt.verify(refreshToken, process.env.TOKEN_SECRET_REF_KEY);
  
//       // Generate new access token
//       const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  
//       res.json({ accessToken: newAccessToken });
//     } catch (err) {
//       res.status(403).json({ message: 'Invalid refresh token' });
//     }
//   });
  


export default userRouter;