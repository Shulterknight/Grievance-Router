const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API Key found.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function findWorkingModel() {
    console.log("Fetching available models...");

    let models = [];
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            models = data.models.map(m => m.name);
        }
    } catch (e) {
        console.error("Failed to list models:", e);
        return;
    }

    console.log(`Found ${models.length} models. Testing generation capability...`);

    for (const modelName of models) {
        if (modelName.includes('embedding')) continue;

        console.log(`Testing: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;

            // Success! Write to file
            fs.writeFileSync('working_model.txt', modelName);
            console.log(`✅ SUCCESS: ${modelName} works!`);
            process.exit(0);
        } catch (e) {
            console.log(`❌ Failed: ${modelName}`);

            // Try removing prefix
            if (modelName.startsWith("models/")) {
                const shortName = modelName.replace("models/", "");
                try {
                    const model = genAI.getGenerativeModel({ model: shortName });
                    const result = await model.generateContent("Hello");

                    fs.writeFileSync('working_model.txt', shortName);
                    console.log(`✅ SUCCESS: ${shortName} works!`);
                    process.exit(0);
                } catch (e2) {
                    console.log(`   ❌ Failed: ${shortName}`);
                }
            }
        }
    }
    console.error("All models failed.");
}

findWorkingModel();
