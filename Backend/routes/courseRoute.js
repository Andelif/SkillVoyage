import express from "express"
import { addCourse,listCourse ,removeCourse} from "../controllers/courseController.js"
import multer from "multer"

const courseRouter= express.Router();

// //Image Storage Engine
 const storage= multer.diskStorage({
     destination: "uploads",
     filename :(req,file,cb)=>{
         return cb(null,`${Date.now()}${file.originalname}`)
     }
 })

 const upload = multer({storage:storage})

courseRouter.post("/add", upload.single("image"),addCourse);
courseRouter.get("/list",listCourse)
courseRouter.post("/remove",removeCourse)



export default courseRouter;
