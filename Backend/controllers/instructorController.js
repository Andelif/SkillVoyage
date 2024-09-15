import instructorModel from "../models/instructorModel.js";



const addInstructor = async (req, res) => {
  //console.log(req.body);
  try {
    const { name,courseName,qualification,rating,image } = req.body;

    const newInstructor = new instructorModel({
        name,
        courseName,
        qualification,
        rating,
        image // Save the Base64 image data     
    });
    
    await newInstructor.save();
    res.status(201).json({ success: true, message: 'Instructor added successfully', instructor: newInstructor });
} catch (error) {
    res.status(500).json({  success: false, message: 'Error adding Instructor', error: error.message });
}
};


//all Instructor list
const listInstructor = async (req, res) => {
  try {
    const instructor = await instructorModel.find({});
    res.json({ success: true, data: instructor });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


//remove Instructor
const removeInstructor = async (req, res) => {
  try {
    const item = await instructorModel.findById(req.body.id);
    if (!item) {
      return res.json({ success: false, message: "Instructor not found" });
    }

    
    await instructorModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Instructor removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while removing Instructor" });
  }
};

export { addInstructor, listInstructor, removeInstructor };
