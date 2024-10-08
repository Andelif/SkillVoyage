import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Function to create access token
const createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30m" });
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
        expires: new Date(Date.now() + 30 * 60 * 1000),
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
  const { name, password, email, image } = req.body;

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

    // Set the access token in the cookies with a 30-minute expiration
    res.cookie("accessToken", accessToken, {
      ...tokenOption,
      expires: new Date(Date.now() + 30 * 60 * 1000),
    });

    res.status(200).json({
      message: "Register successfullyhgfhgf",
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
  const { refreshToken } = req.body; // Receive refreshToken from frontend

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "No refresh token provided" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.TOKEN_SECRET_REF_KEY);

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate new access token
    const newAccessToken = createAccessToken(user._id);

    // Send new access token to client
    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Invalid or expired refresh token",
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
    
    const user = await userModel.findOneAndUpdate(
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


const deleteUserAccount = async (req, res) => {
  const { email } = req.body;

  try {
    // Find and delete the user by email
    const user = await userModel.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Clear cookies after successful deletion
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



const checkUserEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateUserDetails = async (req, res) => {
  const { currentEmail, newName, newEmail } = req.body;

  try {
    
    const user = await userModel.findOne({ email: currentEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Checking if new email is already in use by another user 
    if (newEmail && newEmail !== currentEmail) {
      const emailExists = await userModel.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
    }

    
    user.email = newEmail || user.email;
    user.name = newName || user.name;

    
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,  
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export { loginUser, registerUser, refreshToken, updateUserDetails, updateUserImage, removeUserImage, deleteUserAccount, checkUserEmail };
