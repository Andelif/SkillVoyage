import express from "express"
import { loginUser, registerUser, refreshToken } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/refresh-token", refreshToken); // Refresh token route

// // Protect this route using the authToken middleware
// userRouter.get("/account", authToken, (req, res) => {
//     // Handle the request to retrieve the user's profile
//     res.json({
//         message: "This is the user's profile.",
//         userId: req.userId, // Assuming the userId is set in the authToken middleware
//     });
// });


export default userRouter;