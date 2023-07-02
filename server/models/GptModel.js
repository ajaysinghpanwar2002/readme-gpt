import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateResponse(prompt) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.0,
        max_tokens: 2000,
        top_p: 0.1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
    });
    return response.data.choices[0].text;
}

export { generateResponse };
