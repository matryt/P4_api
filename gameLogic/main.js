const jwt = require("jsonwebtoken");
const Game = require("../models/Game");

function buildArray(positions) {
    let tableau = Array.from({ length: 6 }, () => Array(7).fill(""));
    let characters = ["*", "o"];
    let i = 0;
    for (let playerPositions of positions) {
        for (let p of playerPositions) {
            if (p !== []) tableau[p[1]][p[0]] = characters[i];
        }
        i++;
    }
    return tableau;
}

function isFinished(positions) {
    let array = buildArray(positions);
    let diags = verifyDiags(array);
    if (diags !== false) {
        return diags;
    }
    let lines = verifyLines(array);
    if (lines !== false) {
        return lines;
    }
    let columns = verifyColumns(array);
    if (columns !== false) {
        return columns;
    }
    return false;

}

function verifyDiags(positions) {
    let characters = ["*", "o"];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if ((positions[i][j] === positions[i+1][j+1]) && (positions[i+1][j+1] === positions[i+2][j+2]) && (positions[i+2][j+2] === positions[i+3][j+3]) && positions[i][j] !== ""
            ) return characters.indexOf(positions[i][j]);
        }
        for (let j = 3; j < 7; j++) {
            if ((positions[i][j] === positions[i+1][j-1]) && (positions[i+1][j-1] === positions[i+2][j-2]) && (positions[i+2][j-2] === positions[i+3][j-3]) && positions[i][j] !== ""
            ) return characters.indexOf(positions[i][j]);
        }
    }
    return false;
}

function verifyLines(positions) {
    let characters = ["*", "o"];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            if ((positions[i][j] === positions[i][j+1]) && (positions[i][j] === positions[i][j+2]) && (positions[i][j] === positions[i][j+3]) && positions[i][j] !== ""
            ) return characters.indexOf(positions[i][j]);
        }
    }
    return false;
}

function verifyColumns(positions) {
    let characters = ["*", "o"];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 7; j++) {
            if ((positions[i][j] === positions[i+1][j]) && (positions[i+1][j] === positions[i+2][j]) && (positions[i+2][j] === positions[i+3][j]) && positions[i][j] !== ""
            ) return characters.indexOf(positions[i][j]);
        }
    }
    return false;
}

function getBearer(req) {
    return req.headers.authorization.split('Bearer ')[1];
}

function getIdWithBearer(bearer) {
    try {
        const decodedToken = jwt.verify(bearer, process.env.JWT_SECRET);
        return decodedToken.userId;
    } catch(error) {
        return false;
    }
}

async function existsGame(userId) {
    try {
        const games = await Game.find({});
        for (let game of games) {
            if (game.players.includes(userId)) return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

function verifyAdminAuth(req) {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken.admin;

    } catch(error) {
        return false;
    }
}

exports.existsGame = existsGame;
exports.isFinished = isFinished;
exports.getBearer = getBearer;
exports.getIdWithBearer = getIdWithBearer;
exports.verifyAdminAuth = verifyAdminAuth;