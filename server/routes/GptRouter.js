import express from 'express';
const router = express.Router();
import { processRequest } from '../controllers/GptController.js';

router.post('/', processRequest);
export default router;
