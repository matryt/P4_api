const jwt = require('jsonwebtoken');

exports.verifyAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({
            ok: false,
            message: "Vous devez être connecté !"
        });
    }
}

exports.verifyAdminAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!(decodedToken.admin)) {
            res.status(401).json({
                ok: false,
                message: "Vous devez être admin !"
            });
            return;
        }
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({
            ok: false,
            message: "Vous devez être connecté !"
        });
    }
}