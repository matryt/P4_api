const express = require('express');
let router = express.Router();
let gameMethods = require("../controllers/game");
let auth = require("../middleware/auth");

router.delete("/", auth.verifyAdminAuth, gameMethods.clearGames)
router.post("/", auth.verifyAuth, async (req, res, next) => await gameMethods.createGame(req, res, next))
router.delete("/:id", auth.verifyAdminAuth, gameMethods.deleteGame);
router.delete("/:id/canStart", auth.verifyAuth, gameMethods.canStart);
router.post("/:id/place", auth.verifyAuth, async (req, res, next) => await gameMethods.placePiece(req, res, next));
router.post("/:id/turn", auth.verifyAuth, async (req, res, next) => await gameMethods.changeTurn(req, res, next));
router.post("/:id/undo", auth.verifyAuth, async (req, res, next) => await gameMethods.undoLastPiece(req, res, next));
router.put("/:id/addPlayer", auth.verifyAuth, async (req, res, next) => await gameMethods.addPlayer(req, res, next))
router.get("/find", auth.verifyAuth, async (req, res, next) => await gameMethods.findGame(req, res, next));
router.get("/:id/", auth.verifyAuth, gameMethods.getGame);
router.get("/:id/hasChanged", auth.verifyAuth, gameMethods.hasChanged);

router.get("/", auth.verifyAuth, gameMethods.getAllGames)

module.exports = router;