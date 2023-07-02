// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const __dirname = path.resolve();

// Routes
import GitRepoRouter from './routes/GitRepoRouter.js';
app.use('/', GitRepoRouter);

import GptRouter from './routes/GptRouter.js';
app.use('/gpt', GptRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
