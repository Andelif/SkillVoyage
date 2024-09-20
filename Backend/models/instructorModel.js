import mongoose from "mongoose";



const instructorSchema = new mongoose.Schema({
    name: {type:String,required : true},
    courseName: {type:String,required : true},
    qualification : {type: String, required:true},
    rating: {type: String, required:true},
    image: {type: String,required:true},
    comments: [
        {
          name: String,
          text: String,
          rating: Number,
        },
      ], 
    
})

const instructorModel = mongoose.models.instructor || mongoose.model("instructor", instructorSchema);

export default instructorModel;