require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test2Flash() {
    try {
        console.log("Testing gemini-2.0-flash...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("hello");
        console.log("gemini-2.0-flash success:", result.response.text());
    } catch (error) {
        console.error("gemini-2.0-flash failed:", error.message);
    }
}

test2Flash();
