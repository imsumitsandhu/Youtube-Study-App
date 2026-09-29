exports.requireAuth = (req, res, next) => {
    if (!req.session.userId) return res.redirect("/users/login");
    next();
};

exports.redirectIfAuth = (req, res, next) => {
    if (req.session.userId) return res.redirect("/dashboard");
    next();
};