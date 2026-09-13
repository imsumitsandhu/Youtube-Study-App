const ai = require("../config/gemini");

async function generateSummary(transcript) {
    const prompt = `
You are an expert educator who simplifies complex topics into clear, engaging study notes for students preparing for exams or quick review.

Using the transcript below, generate structured notes with:
- A short summary of the video's main ideas
- Bullet points for key concepts (easy to scan)
- 2-3 multiple-choice questions to reinforce learning
- A brief concluding takeaway

Rules:
- Avoid jargon or overly technical language
- Base everything strictly on the transcript content — do not add unverified claims
- Keep the tone informative and approachable
- Target length: 300-600 words

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