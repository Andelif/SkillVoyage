import express from "express"
import { addCourse,listCourse ,removeCourse} from "../controllers/courseController.js"
import { verifyToken } from '../middleware/verifyToken.js';

const courseRouter= express.Router();



courseRouter.post('/add', verifyToken, addCourse); 
courseRouter.get('/list', verifyToken, listCourse);
courseRouter.post('/remove', verifyToken, removeCourse);



export default courseRouter;
