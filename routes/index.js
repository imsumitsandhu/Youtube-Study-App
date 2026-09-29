const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/users");

// simple guard, use it on any route you want protected
function isLoggedIn(req, res, next) {
    if (!req.session.userId) return res.redirect("/login");
    next();
}

router.get("/", isLoggedIn, (req, res) => {
    res.render("index", { title: "YT Notes", isLoggedIn: true });
});

router.get("/login", (req, res) => {
    if (req.session.userId) return res.redirect("/");
    res.render("login", { error: null });
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: (email || "").toLowerCase().trim() });

        const isMatch = user && (await bcrypt.compare(password || "", user.password));
        if (!isMatch) {
            return res.status(400).render("login", { error: "Invalid email or password" });
        }

        req.session.userId = user._id;
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.get("/register", (req, res) => {
    if (req.session.userId) return res.redirect("/");
    res.render("register", { error: null });
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).render("register", { error: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (await userModel.findOne({ email: normalizedEmail })) {
            return res.status(400).render("register", { error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({ name, email: normalizedEmail, password: hashedPassword });

        res.redirect("/login");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.get("/profile", isLoggedIn, async (req, res) => {
    const user = await userModel.findById(req.session.userId).select("-password");
    res.render("profile", { user });
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
});

module.exports = router;