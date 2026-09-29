const express = require("express");
const router = express.Router();
const Lecture = require("../models/lecture");
const { requireAuth } = require("../middleware/auth");

// History: all notes of the logged-in user, newest first
router.get("/history", requireAuth, async (req, res) => {
    try {
        const lectures = await Lecture.find({ user: req.session.userId }).sort({ createdAt: -1 });
        res.render("result", { lectures, lecture: null });
    } catch (err) {
        res.status(500).send("Could not load history");
    }
});

// One note (only if it belongs to the logged-in user) + the history list
router.get("/notes/:id", requireAuth, async (req, res) => {
    try {
        const lecture = await Lecture.findOne({ _id: req.params.id, user: req.session.userId });
        if (!lecture) return res.redirect("/history");

        const lectures = await Lecture.find({ user: req.session.userId }).sort({ createdAt: -1 });
        res.render("result", { lectures, lecture });
    } catch (err) {
        res.redirect("/history");
    }
});

module.exports = router;
