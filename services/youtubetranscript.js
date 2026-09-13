const { YoutubeTranscript } = require("youtube-transcript");

async function getTranscript(url) {
    if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
        throw new Error("Please provide a valid YouTube URL");
    }

    try {
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        const text = transcript.map(item => item.text).join(" ");
        return text;
    } catch (err) {
        console.error(err);
        throw new Error("Could not fetch transcript. The video may not have captions available.");
    }
}

module.exports = getTranscript;