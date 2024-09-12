import mongoose from "mongoose";
import userModel from "./userModel.js";// Adjust the path to your user model

try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error: ", error);
    throw error; // Propagate error to catch block in server.js
  }

async function setAdmin(email) {
  try {
    await userModel.updateOne({ email }, { isAdmin: true });
    console.log(`User with email ${email} is now an admin.`);
  } catch (error) {
    console.error('Error setting admin user', error);
  } finally {
    mongoose.connection.close(); // Close the connection after the operation
  }
}

// Replace with the actual admin email you want to set
setAdmin('andelif33@gmail.com');