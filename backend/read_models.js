const fs = require('fs');

try {
    // Try reading as utf16le if node supports it via encoding option
    const content = fs.readFileSync('models.json', 'utf16le');
    try {
        const json = JSON.parse(content);
        console.log("Models found:");
        json.models.forEach(m => console.log(m.name));
    } catch (e) {
        console.log("JSON parse error (utf16le):", e.message);
        // Fallback try utf8 just in case
        const content2 = fs.readFileSync('models.json', 'utf8');
        try {
            const json2 = JSON.parse(content2);
            console.log("Models found:");
            json2.models.forEach(m => console.log(m.name));
        } catch (e2) {
            console.log("JSON parse error (utf8):", e2.message);
        }
    }
} catch (err) {
    console.error(err);
}
