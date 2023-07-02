import express from 'express';
const router = express.Router();
import { getRepoDetails } from '../controllers/GitRepoController.js';

// Define the dynamic route
router.get('/:githubname/:reponame', getRepoDetails);
export default router;
