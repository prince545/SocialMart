require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testConfig() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    console.log("--- Test 1: gemini-1.5-flash (default) ---");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("hello");
        console.log("Result:", result.response.text());
        console.log("✅ Success!");
    } catch (e) {
        console.log("❌ Failed:", e.message.split('\n')[0]);
    }

    console.log("\n--- Test 2: gemini-1.5-flash-latest (default) ---");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("hello");
        console.log("Result:", result.response.text());
        console.log("✅ Success!");
    } catch (e) {
        console.log("❌ Failed:", e.message.split('\n')[0]);
    }

    console.log("\n--- Test 3: gemini-1.5-flash-latest (v1 explicit) ---");
    try {
        // Try to force v1 via constructor hack if possible
        // Actually, let's try getGenerativeModel second arg
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }, { apiVersion: 'v1' });
        const result = await model.generateContent("hello");
        console.log("Result:", result.response.text());
        console.log("✅ Success!");
    } catch (e) {
        console.log("❌ Failed:", e.message.split('\n')[0]);
    }
}

testConfig();
