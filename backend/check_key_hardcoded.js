const { GoogleGenerativeAI } = require('@google/generative-ai');

// User provided key
const API_KEY = "AIzaSyCRN-D4Ch5fNS1Qlxm0QeGhtY-d64wu1AE";

const modelsToTest = [
    "gemini-1.5-flash",
    "models/gemini-1.5-flash",
    "gemini-pro",
    "models/gemini-pro"
];

async function testKey() {
    console.log("Testing with provided key...");
    const genAI = new GoogleGenerativeAI(API_KEY);

    for (const modelName of modelsToTest) {
        console.log(`\nAttempting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello via hardcoded key");
            const response = await result.response;
            console.log(`SUCCESS! Model '${modelName}' is working.`);
            console.log("Response fragment:", response.text().substring(0, 50));
            return; // Exit after first success
        } catch (error) {
            console.error(`Failed ${modelName}: ${error.message}`);
        }
    }
    console.error("\nAll models failed with the provided key.");
}

testKey();
