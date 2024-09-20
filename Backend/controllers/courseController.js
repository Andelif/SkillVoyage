import courseModel from "../models/courseModel.js";



const addCourse = async (req, res) => {
  //console.log(req.body);
  try {
    const { name, description, price, rating, duration, teacher, image, youtubeLink } = req.body;

    const newCourse = new courseModel({
        name,
        description,
        price,
        rating,
        duration,
        teacher,
        image,
        youtubeLink,
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

// Add a new comment
const addComment = async (req, res) => {
  try {
    const { id, text, rating } = req.body; // course ID, comment text, and rating

    // Find the course by ID
    const course = await courseModel.findById(id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Add the comment to the course's comments array
    const newComment = { text, rating };
    course.comments.push(newComment); 
    await course.save();
    
    res.status(200).json({ success: true, message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding comment', error: error.message });
  }
};


// Get all comments for an course
const getComments = async (req, res) => {
  try {
    const { id } = req.params; // course ID
    
    // Find the course by ID
    const course = await courseModel.findById(id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Fetch all comments (without user and date)
    const comments = course.comments || [];
    
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching comments', error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params; // course ID

    // Find the course by ID
    const course = await courseModel.findById(id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'course not found' });
    }
    
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching course', error: error.message });
  }
};


export { addCourse, listCourse, removeCourse, getCourseById,  addComment, getComments };
