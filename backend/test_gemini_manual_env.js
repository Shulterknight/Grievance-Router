const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log("Starting testGemini manual env...");
    try {
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        let apiKey = '';

        // Simple parser for GEMINI_API_KEY
        const lines = envContent.split('\n');
        for (const line of lines) {
            if (line.trim().startsWith('GEMINI_API_KEY=')) {
                apiKey = line.trim().split('=')[1];
                break;
            }
        }

        console.log("API Key found:", apiKey ? "Yes" : "No");
        if (!apiKey) {
            console.error("Could not find GEMINI_API_KEY in .env");
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = "Hello";
        console.log("Sending prompt...");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Response text:", response.text());

    } catch (error) {
        console.error("ERROR:");
        console.error(error);
    }
}

testGemini();
