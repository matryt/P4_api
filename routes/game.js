const express = require('express');
let router = express.Router();
let gameMethods = require("../controllers/game")

router.delete("/", gameMethods.clearGames)
router.post("/", gameMethods.createGame)
router.delete("/:id", gameMethods.deleteGame);
router.post("/:id/place", async (req, res, next) => await gameMethods.placePiece(req, res, next));
router.post("/:id/turn", async (req, res, next) => await gameMethods.changeTurn(req, res, next));
router.post("/:id/undo", async (req, res, next) => await gameMethods.undoLastPiece(req, res, next));
router.put("/:id/addPlayer", async (req, res, next) => await gameMethods.addPlayer(req, res, next))
router.get("/find", async (req, res, next) => await gameMethods.findGame(req, res, next));
router.get("/:id/", gameMethods.getGame);
router.get("/:id/hasChanged", gameMethods.hasChanged);

router.get("/", gameMethods.getAllGames)

module.exports = router;