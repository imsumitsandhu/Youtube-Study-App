const ai = require("../config/gemini");

async function generateSummary(transcript) {
    const prompt = `
You are an expert.

Summarize the following YouTube transcript in simple language.
Also give important points to keep in mind.

Transcript:
${transcript}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}

module.exports = generateSummary;