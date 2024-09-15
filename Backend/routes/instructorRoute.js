import express from "express"
import { addInstructor,listInstructor ,removeInstructor} from "../controllers/instructorController.js"
import { verifyToken } from '../middleware/verifyToken.js';

const instructorRouter= express.Router();



instructorRouter.post('/add', verifyToken, addInstructor); 
instructorRouter.get('/list', verifyToken, listInstructor);
instructorRouter.post('/remove', verifyToken, removeInstructor);



export default instructorRouter;
