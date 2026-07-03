const { YoutubeTranscript } = require("youtube-transcript");

async function getTranscript(url) {
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(url);

        const text = transcript.map(item => item.text).join(" ");
        
        return text;
    } catch (err) {
        console.error(err);
        throw new Error("Could not fetch transcript");
    }
}

module.exports = getTranscript;