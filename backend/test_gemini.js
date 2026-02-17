require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log("Node version:", process.version);
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);

        // Switch to gemini-pro to test if model name is the issue
        const modelName = "gemini-1.5-flash";
        console.log(`Testing model: ${modelName}`);

        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = "Hello";
        console.log("Sending prompt...");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Response text:", response.text());

    } catch (error) {
        console.error("ERROR:");
        console.error(error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("StatusText:", error.response.statusText);
        }
    }
}

testGemini();
