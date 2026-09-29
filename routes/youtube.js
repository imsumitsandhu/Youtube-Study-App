const express = require("express");
const router = express.Router();
const { marked } = require("marked");

const getTranscript = require("../services/youtubetranscript");
const generateSummary = require("../services/geminiservice");
const Lecture = require("../models/lecture");

router.get("/", (req, res) => {
    res.redirect("/");
});

router.post("/", async (req, res) => {
    try {
        const url = req.body.url;
        console.log("1. url:", url);

        const transcript = await getTranscript(url);
        console.log("2. transcript length:", transcript && transcript.length);

        const summary = await generateSummary(transcript);   // markdown text from Gemini
        console.log("3. summary received:", !!summary);

        const htmlSummary = marked(summary);                 // converted to HTML

        const lecture = await Lecture.create({
            user: req.session.userId,
            videoUrl: url,
            title: htmlSummary.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 60),
            notes: htmlSummary,
        });
        console.log("4. saved:", lecture._id);

        res.redirect(`/notes/${lecture._id}`);
    } catch (err) {
        console.log("FAILED:", err);
        res.status(500).send("Error: " + err.message);
    }
});

module.exports = router;