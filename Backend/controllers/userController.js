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
    console.log('Finding user...');
    const user = await userModel.findOne({ email });
    console.log('User found:', user);

    if (!user) {
      return res.json({ success: false, message: "User does not exist", error: true });
    }

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.json({ success: false, message: "Wrong password", error: true });

    } else {
      console.log('Creating tokens...');
      const accessToken = createAccessToken(user._id);
      const refreshToken = createRefreshToken(user._id);
      console.log('Tokens created:', { accessToken, refreshToken });

      const tokenOption = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "None",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration for 7days
      };

      res.cookie("refreshToken", refreshToken, tokenOption);

      res.cookie("accessToken", accessToken, {
          ...tokenOption,
          expires: new Date(Date.now() + 15 * 60 * 1000),
        })
        .status(200)
        .json({
          message: "Login successfullyhgfhgf",
          data: {
            accessToken,
            refreshToken,
            user: {
              name: user.name,
              email: user.email
            }
          },
          success: true,
          error: false,
        });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
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

    if(!password){
      throw new Error("Please provide password")
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
    });

    const user = await newUser.save();

    // Create tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "None",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration for 7 days
    });

    //res.cookie("refreshToken", refreshToken, tokenOption);

    // Set the access token in the cookies with a 15-minute expiration
    res.cookie("accessToken", accessToken, {
      ...tokenOption,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    res.status(201).json({ success: true, error: false, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: true, message: "Internal Error in register user" });
  }
};

// Refresh token endpoint
const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    jwt.verify(refreshToken, process.env.TOKEN_SECRET_REF_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid token here in Ref Token Endpoint",
        });
      }
      const newAccessToken = createAccessToken(user.id);

      // Update access token in cookies
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });

      res.status(200).json({ success: true, accessToken: newAccessToken });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error here in Ref Token Endpoint",
      });
  }
};

export { loginUser, registerUser, refreshToken };
