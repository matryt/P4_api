const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
    time: {type: Number, required: true},
    players: {type: Array, required: true},
    pieces: {type: Array, required: true},
    isFinished: {type: Boolean, required: true, default: false},
    isFirstTurn: {type: Boolean, required: true, default: true}
})

module.exports = mongoose.model("Game", GameSchema)