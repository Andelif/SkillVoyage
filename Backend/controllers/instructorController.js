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
    res.status(201).json({ success: true, message: 'Instructor added successfullyfds', instructor: newInstructor });
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

// Add a new comment
const addComment = async (req, res) => {
  try {
    const { id, text, rating } = req.body; // Instructor ID, comment text, and rating

    // Find the instructor by ID
    const instructor = await instructorModel.findById(id);
    
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }
    
    // Add the comment to the instructor's comments array
    const newComment = { text, rating };
    instructor.comments.push(newComment); 
    await instructor.save();
    
    res.status(200).json({ success: true, message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding comment', error: error.message });
  }
};


// Get all comments for an instructor
const getComments = async (req, res) => {
  try {
    const { id } = req.params; // Instructor ID
    
    // Find the instructor by ID
    const instructor = await instructorModel.findById(id);
    
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }
    
    // Fetch all comments (without user and date)
    const comments = instructor.comments || [];
    
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching comments', error: error.message });
  }
};

const getInstructorById = async (req, res) => {
  try {
    const { id } = req.params; // Instructor ID

    // Find the instructor by ID
    const instructor = await instructorModel.findById(id);
    
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }
    
    res.status(200).json({ success: true, data: instructor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching instructor', error: error.message });
  }
};



export { addInstructor, listInstructor, removeInstructor, getInstructorById,  addComment, getComments };
