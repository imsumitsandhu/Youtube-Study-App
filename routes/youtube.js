const express = require("express");
const router = express.Router();

const getTranscript = require("../services/youtubetranscript");
const generateSummary = require("../services/geminiservice");
router.get("/", (req, res) => {
    res.render("youtube");
});



router.post("/", async (req, res) => {
    try {
        const url = req.body.url;

        const transcript = await getTranscript(url);


const { marked } = require("marked");

const summary = await generateSummary(transcript);

const htmlSummary = marked(summary);

res.render("result", {
    summary: htmlSummary
});
    } catch (err) {
        console.log(err);
        res.send("Error fetching transcript");
    }
});

module.exports = router;