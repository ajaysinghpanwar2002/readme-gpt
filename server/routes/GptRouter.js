import express from 'express';
import { processRequest } from '../controllers/GptController';

const router = express.Router();

router.post('/', processRequest);
export default router;
