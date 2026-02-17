const fs = require('fs');
const path = require('path');

async function testFetch() {
    console.log("Starting testFetch (List Models)...");

    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    let apiKey = '';
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.trim().startsWith('GEMINI_API_KEY=')) {
            const parts = line.split('=');
            parts.shift();
            apiKey = parts.join('=').trim();
            break;
        }
    }

    if (!apiKey) {
        console.error("No API Key");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const json = await response.json();

        console.log("Status:", response.status);
        if (json.models) {
            console.log("Available Models:");
            json.models.forEach(m => console.log(m.name));
        } else {
            console.log("No models found:", JSON.stringify(json));
        }

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testFetch();
