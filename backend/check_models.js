require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.0-pro"
];

async function findWorkingModel() {
    console.log("Starting model connectivity test...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY found via dotenv!");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of modelsToTest) {
        console.log(`Testing: ${modelName} ...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`SUCCESS with ${modelName}`);
            console.log(`Response: ${response.text().substring(0, 50)}`);
            process.exit(0); // Exit on first success
        } catch (error) {
            console.log(`FAILED ${modelName}: ${error.message}`);
            if (error.response) {
                // console.log(`Status: ${error.response.status}`); 
            }
        }
    }
    console.error("All models failed.");
}

findWorkingModel();
