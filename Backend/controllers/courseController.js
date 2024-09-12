import courseModel from "../models/courseModel.js";



const addCourse =async(req,res) => {
  
    let image_filename= req.body.image;
    
    const course =new courseModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        rating: req.body.rating,
        duration: req.body.duration,
        image: req.body.image
    })
    try{
       await course.save();
       res.json({success:true,message:"Course added"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:error})

    }
}
//all course list
const listCourse =async(req,res)=>{
    try {
        const course= await courseModel.find({});
        res.json({success:true,data:course})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
//remove course
const removeCourse= async (req,res)=>{
  try {
    const item= await courseModel.findById(req.body.id);
   // fs.unlink(`uploads/${item.image}`,()=>{})
     
    await courseModel.findByIdAndDelete(req.body.id);
    res.json({success:true,message:"Course removed"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error while removing course"})
  }
}

export {addCourse, listCourse, removeCourse};