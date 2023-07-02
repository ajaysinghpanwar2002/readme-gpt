import { generateResponse } from "../models/GptModel.js";
import { INITIAL_PHRASE, LAST_PHRASE } from "../constant.js";

async function processRequest(req, res) {
    try {
        const { packageJsonContent } = req.body;
        const prompt = `${INITIAL_PHRASE} + ${packageJsonContent} + ${LAST_PHRASE}`
        const result = await generateResponse(prompt);
        console.log(result);
        res.send(result);
    } catch (error) {
        console.log(error);
    }
}

export { processRequest };