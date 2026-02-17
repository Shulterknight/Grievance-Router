const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    console.log("Fetching models...");
    try {
        // Use REST endpoint for listing to be sure
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log("\n--- AVAILABLE MODELS ---");
            data.models.forEach(m => {
                console.log(`MODEL: ${m.name}`);
            });
            console.log("------------------------\n");
        } else {
            console.log("No models found in response:", data);
        }
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
