require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testAI() {
    try {
        console.log("Checking API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Explain how AI works in one sentence.";
        console.log("Sending prompt to Gemini...");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Success! Response:", text);
    } catch (error) {
        console.error("Error connecting to Gemini:", error.message);
        if (error.response) {
            console.error("Error details:", JSON.stringify(error.response, null, 2));
        }
    }
}

testAI();
