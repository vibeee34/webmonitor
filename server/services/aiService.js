const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getSummary = async (oldText, newText) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Compare these versions and summarize changes.
        PREVIOUS: "${oldText}"
        CURRENT: "${newText}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

module.exports = { getSummary };