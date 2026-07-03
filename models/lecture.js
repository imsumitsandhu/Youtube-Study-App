const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    youtubeUrl: {
        type: String,
        required: true,
    },

    videoId: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        default: "",
    },

    transcript: {
        type: String,
        required: true,
    },

    summary: {
        type: String,
        default: "",
    },

    notes: {
        type: String,
        default: "",
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Lecture", lectureSchema);