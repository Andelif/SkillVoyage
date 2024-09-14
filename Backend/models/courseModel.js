import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {type:String,required : true},
    description : {type: String, required:true},
    price : {type: String, required:true},
    rating: {type: String,required:true},
    duration: {type: String,required:true},
    teacher: {type:String,required : true},
    image: {type: String,required:true},
    
    
})

const courseModel = mongoose.models.course || mongoose.model("course", courseSchema);

export default courseModel;