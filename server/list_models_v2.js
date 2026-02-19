require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    try {
        // Unfortunately the high-level SDK doesn't expose listModels easily.
        // We can try to guess common models:
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro", "gemini-2.0-flash-exp"];

        console.log("Checking models...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        for (const modelName of models) {
            try {
                console.log(`Trying ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                await model.generateContent("test");
                console.log(`✅ ${modelName} is VALID.`);
                return; // Stop after finding one
            } catch (e) {
                console.log(`❌ ${modelName} failed: ${e.message.split('\n')[0]}`);
            }
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
