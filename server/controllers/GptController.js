import { generateResponse } from "../models/GptModel.js";

async function processRequest(req, res) {
    try {
        const { prompt } = req.body;
        const result = await generateResponse(prompt);
        console.log(result);
        res.send(result);
    } catch (error) {
        console.log(error);
    }
}

export { processRequest };