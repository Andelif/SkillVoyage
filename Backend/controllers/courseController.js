import courseModel from "../models/courseModel.js";
import s3 from "../config/awsConfig.js";
import { v4 as uuidv4 } from "uuid";

const addCourse = async (req, res) => {
  console.log(req.body);
  const { name, description, price, rating, duration } = req.body;
  const file = req.file; // assuming multer or any other middleware handled the file

  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${uuidv4()}-${file.originalname}`, // Unique filename
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const s3Data = await s3.upload(s3Params).promise();
    const course = new courseModel({
      name,
      description,
      price,
      rating,
      duration,
      image: s3Data.Location, // S3 file URL
    });

    await course.save();
    res.json({ success: true, message: "Course added", data: course });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//all course list
const listCourse = async (req, res) => {
  try {
    const course = await courseModel.find({});
    res.json({ success: true, data: course });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
//remove course
const removeCourse = async (req, res) => {
  try {
    const item = await courseModel.findById(req.body.id);
    

    // Extract the S3 key from the image URL
    const s3Key = item.image.split("/").slice(-1)[0]; // Assuming the last part of the URL is the file key

    // Delete the image from S3
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    };

    await s3.deleteObject(s3Params).promise();

    await courseModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Course removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while removing course" });
  }
};

export { addCourse, listCourse, removeCourse };
