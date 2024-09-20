import express from "express"
import { addCourse, listCourse, removeCourse, addComment, getComments, getCourseById} from "../controllers/courseController.js"
import { verifyToken } from '../middleware/verifyToken.js';

const courseRouter= express.Router();



courseRouter.post('/add', verifyToken, addCourse); 
courseRouter.get('/list', verifyToken, listCourse);
courseRouter.post('/remove', verifyToken, removeCourse);

courseRouter.get('/:id', verifyToken, getCourseById);

courseRouter.post('/:id/comments', verifyToken, addComment); 
courseRouter.get('/:id/comments', getComments);



export default courseRouter;
