import express from "express"
import jwt from "jsonwebtoken";
import { loginUser, registerUser, refreshToken } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)


router.post('/refresh-token', (req, res) => {
    const refreshToken = req.cookies['refreshToken'];
  
    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.TOKEN_SECRET_REF_KEY);
  
      // Generate new access token
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  
      res.json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(403).json({ message: 'Invalid refresh token' });
    }
  });
  
//Refresh token route

// // Protect this route using the authToken middleware
// userRouter.get("/account", authToken, (req, res) => {
//     // Handle the request to retrieve the user's profile
//     res.json({
//         message: "This is the user's profile.",
//         userId: req.userId, // Assuming the userId is set in the authToken middleware
//     });
// });


export default userRouter;