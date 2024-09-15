import express from "express"
import { addInstructor,listInstructor ,removeInstructor} from "../controllers/instructorController.js"
import { verifyToken } from '../middleware/verifyToken.js';

const instructorRouter= express.Router();



instructorRouter.post('/addInstructor', verifyToken, addInstructor); 
instructorRouter.get('/listInstructor', verifyToken, listInstructor);
instructorRouter.post('/removeInstructor', verifyToken, removeInstructor);



export default instructorRouter;
