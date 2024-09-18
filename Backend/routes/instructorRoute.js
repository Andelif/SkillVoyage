import express from "express"
import { addInstructor,listInstructor ,removeInstructor, addComment, getComments, getInstructorById} from "../controllers/instructorController.js"
import { verifyToken } from '../middleware/verifyToken.js';

const instructorRouter= express.Router();



instructorRouter.post('/add', verifyToken, addInstructor); 
instructorRouter.get('/list', verifyToken, listInstructor);
instructorRouter.post('/remove', verifyToken, removeInstructor);
instructorRouter.get('/:id', verifyToken, getInstructorById);

instructorRouter.post('/:id/comments', verifyToken, addComment); // Add comment
instructorRouter.get('/:id/comments', getComments); // Get all comments for a specific instructor

export default instructorRouter;
