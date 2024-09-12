import express from "express"
import { addCourse,listCourse ,removeCourse} from "../controllers/courseController.js"


const courseRouter= express.Router();



courseRouter.post("/add", addCourse);
courseRouter.get("/list",listCourse)
courseRouter.post("/remove",removeCourse)



export default courseRouter;
