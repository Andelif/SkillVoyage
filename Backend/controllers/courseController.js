import courseModel from "../models/courseModel.js";



const addCourse = async (req, res) => {
  //console.log(req.body);
  try {
    const { name, description, price, rating, duration, teacher, image } = req.body;

    const newCourse = new courseModel({
        name,
        description,
        price,
        rating,
        duration,
        teacher,
        image // Save the Base64 image data
    });
    
    await newCourse.save();
    res.status(201).json({ success: true, message: 'Course added successfully', course: newCourse });
} catch (error) {
    res.status(500).json({  success: false, message: 'Error adding course', error: error.message });
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
    if (!item) {
      return res.json({ success: false, message: "Course not found" });
    }

    
    await courseModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Course removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while removing course" });
  }
};

export { addCourse, listCourse, removeCourse };
