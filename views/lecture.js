const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        videoUrl: String,
        title: String,
        notes: String,
    },
    { timestamps: true } // adds createdAt automatically
);

module.exports = mongoose.model("Lecture", lectureSchema);
