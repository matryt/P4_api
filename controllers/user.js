const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Game = require("../models/Game");

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
            res.status(400).json({
                ok: false,
                error: error.message
            });
            return;
        }

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({
                ok: true
            }))
            .catch((error) => res.status(400).json({
                ok: false,
                error: error.message
                })
            )
    })
}

exports.signin = async (req, res, next) => {
    try {
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            res.status(418).json({
                ok: false,
                error: "Utilisateur inconnu !"
            });
            return;
        }
        console.log(req.body.email);
        bcrypt.compare(req.body.password, user.password, (e, hash) => {
            if (e) {
                res.status(401).json({
                    ok: false,
                    error: e.message
                });
                return;
            }
            res.status(200).json({
                ok: true,
                userId: user._id,
                token: jwt.sign(
                    {
                        lastName: user.lastName,
                        userId: user._id,
                        admin: user.admin
                    },
                    process.env.JWT_SECRET,
                    {expiresIn: '24h'}
                )
            })
        });
    } catch (e) {
        res.status(400).json({
            ok: false,
            error: e.message
        })
    }

}

exports.delete = async (req, res, next) => {
    try {
        let user = await User.deleteOne({email: req.body.email});
        res.status(200).json({
            ok: true,
        })
    } catch (e) {
        res.status(400).json({
            ok: false,
            error: e.message
        })
    }
}

