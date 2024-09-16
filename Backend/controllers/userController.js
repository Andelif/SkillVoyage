import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Function to create access token
const createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// Function to create refresh token
const createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET_REF_KEY, {
    expiresIn: "7d",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
        error: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Wrong password",
        error: true,
      });
    } else {
      const accessToken = createAccessToken(user._id);
      const refreshToken = createRefreshToken(user._id);

      const tokenOption = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration for 7days
      };

      res.cookie("refreshToken", refreshToken, tokenOption);

      res.cookie("accessToken", accessToken, {
        ...tokenOption,
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });
      res.status(200).json({
        message: "Login successfullyhgfhgf",
        data: {
          accessToken,
          refreshToken,
          user: {
            name: user.name,
            email: user.email,
            image: user.image,
          },
        },
        success: true,
        error: false,
      });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error in login user",
      error: error.message,
    });
  }
};

// register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    //checking if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    //validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (!password) {
      throw new Error("Please provide password");
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Length of password must be more than 8 characters",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      image: image || "",
    });

    const user = await newUser.save();

    // Create tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    const tokenOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    res.cookie("refreshToken", refreshToken, tokenOption);

    // Set the access token in the cookies with a 15-minute expiration
    res.cookie("accessToken", accessToken, {
      ...tokenOption,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    res
      .status(201)
      .json({ success: true, error: false, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: true,
      message: "Internal Error in register user",
    });
  }
};

// Refresh token endpoint
const refreshToken = async (req, res) => {


  try {
    
    const newAccessToken = createAccessToken(user._id);

    // Update access token in cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error here in Ref Token Endpoint",
    });
  }
};


const updateUserImage = async (req, res) => {
  const { email, image } = req.body;

  try {
    const user = await userModel.findOneAndUpdate({ email }, { image }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "Image updated", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating image" });
  }
};



const removeUserImage = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email and update the image field to an empty string
    const user = await User.findOneAndUpdate(
      { email: email },
      { image: "" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Respond with success
    return res.status(200).json({ success: true, message: "Image removed successfully" });
  } catch (error) {
    console.error("Error removing image:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { loginUser, registerUser, refreshToken, updateUserImage, removeUserImage };
