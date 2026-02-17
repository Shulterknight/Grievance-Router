require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// List of models to try in order of preference
const MODEL_CANDIDATES = [
  "models/gemini-2.5-flash",
  "models/gemini-1.5-flash",
  "models/gemini-1.5-flash-latest",
  "models/gemini-pro",
  "gemini-1.5-flash",
  "gemini-pro"
];

let activeModelName = "models/gemini-2.5-flash"; // Default

async function findWorkingModel() {
  console.log("Checking available Gemini models...");
  for (const modelName of MODEL_CANDIDATES) {
    try {
      console.log(`Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      await model.generateContent("Test");
      console.log(`✅ SUCCESS: Model '${modelName}' is working.`);
      activeModelName = modelName;
      return;
    } catch (e) {
      console.log(`❌ Failed ${modelName}`);
    }
  }
  console.warn("⚠️ All model checks failed. Defaulting to 'models/gemini-1.5-flash'.");
}

app.get('/', (req, res) => {
  res.json({ status: 'server running', activeModel: activeModelName });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    console.log(`Analyzing grievance using model: ${activeModelName}`);

    const model = genAI.getGenerativeModel({
      model: activeModelName,
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are an expert Indian Consumer Rights legal advisor. Analyze the user's problem and output ONLY a raw JSON object following this exact schema:
    {
      "urgencyLevel": "High | Medium | Low",
      "suggestedPortals": [
        { "name": "Portal Name (e.g., PGPortal, Jansunwai)", "url": "https://...", "reason": "Short reason" }
      ],
      "documentsAndDraft": {
        "checklist": ["Doc 1", "Doc 2"],
        "draftText": "Formal 100-word complaint..."
      }
    }
    
    User Complaint: ${description}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      console.log("Gemini Response snippet:", text.substring(0, 100) + "...");

      // Clean cleanup
      text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

      const jsonResponse = JSON.parse(text);
      res.json(jsonResponse);

    } catch (apiError) {
      console.error("Gemini API Error:", apiError);
      res.status(500).json({
        error: `Failed to analyze grievance using ${activeModelName}`,
        details: apiError.message,
        tip: "Check server console for details on which models failed."
      });
    }

  } catch (error) {
    console.error('Server Handler Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server and check models
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await findWorkingModel();
  console.log(`Server ready. Active Model: ${activeModelName}`);
});
