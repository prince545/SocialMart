require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // For listing models, we don't need a specific model yet, 
        // but the SDK structure is a bit different. 
        // Actually the SDK doesn't expose listModels directly on the main class easily in some versions.
        // Let's try to just use a known stable model or try to catch the error better in test_ai.js first.

        // Wait, version 0.24.1 should support it.
        // Let's try to just use 'gemini-pro' as a fallback test.

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Testing gemini-1.5-flash...");
        await model.generateContent("test");
        console.log("gemini-1.5-flash works.");

    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
