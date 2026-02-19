require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

async function main() {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: "Say hello in one sentence." }] }],
        });

        console.log(response.candidates[0].content.parts[0].text);
    } catch (err) {
        console.error("ERROR:", err);
    }
}

main();
