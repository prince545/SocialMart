require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testPro() {
    try {
        console.log("Testing gemini-pro...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("hello");
        console.log("gemini-pro success:", result.response.text());
    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }
}

testPro();
