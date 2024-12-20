const Game = require("../models/Game")
const gameLogic = require("../gameLogic/main");

exports.getAllGames = (req, res, next) => {
    Game.find()
        .then(games => res.status(200).json({ok: true, games: games}))
        .catch(error => res.status(400).json({ok: false, error: error.message}));
}

exports.createGame = (req, res, next) => {
    const game = new Game({
        time: req.body.time,
        players: req.body.players,
        pieces: req.body.pieces
    });
    game.save().then(
        (savedGame) => {
            res.status(201).json({
                ok: true,
                message: "Game created !",
                gameId: savedGame._id
            })
        }
    ).catch(
        (e) => {
            res.status(400).json({
                ok: false,
                error: e.message
            })
        }
    )
}

exports.deleteGame = (req, res, next) => {
    Game.deleteOne(
        {_id: req.params.id}
    ).then(
        () => {
            res.status(200).json({
                ok: true,
                message: "Game deleted !",
            })
        }
    ).catch(
        (e) => res.status(400).json({
            ok: false,
            error: e.message})
    );
}

exports.clearGames = (req, res, next) => {
    Game.deleteMany(
        {}
    ).then(
        () => {
            res.status(200).json({
                ok: true,
                message: "All entries cleaned"})
        }
    ).catch(
        (e) => res.status(400).json({
            ok: false,
            error: e.message})
    )
}

exports.placePiece = async (req, res, next) => {
    try {
        let g = await Game.findById(
            req.params.id
        );
        if (g.isFinished) res.status(400).json({ok: false, error_ID:"END"});
        else {
            let index = g.isFirstTurn ? 0 : 1;
            if (g.pieces[0].some(subArray => JSON.stringify(subArray) === JSON.stringify(req.body.piece)) || g.pieces[1].some(subArray => JSON.stringify(subArray) === JSON.stringify(req.body.piece))) {
                res.status(400).json({
                    ok: false,
                    error_ID: "EXISTS"
                });
                return;
            }
            else {
                g.pieces[index].push(req.body.piece);
                g.isFirstTurn = !g.isFirstTurn;
                g.markModified('pieces');
                g.modifs = g.modifs+1;
                try {
                    let result = gameLogic.isFinished(g.pieces);
                    if (result !== false) {
                        g.isFinished = true;
                    }
                } catch(error) {
                    res.status(400).json({
                        ok: false,
                        error: error.message,
                    });
                    return;
                }
                await g.save();
                res.status(200).json({ok: true, message: "Piece placed successfully"});
            }
        }
    } catch (e) {
        res.status(400).json({
            ok: false,
            error: e.message
        })
    }
}

exports.changeTurn = async (req, res, next) => {
    try {
        let g = await Game.findById(
            req.params.id
        );
        if (g.isFinished) res.status(400).json({ok: false, error_ID:"FIN"});
        else {
            g.isFirstTurn = !g.isFirstTurn;
            await g.save();
            res.status(200).json({ok: true, message: "Turn changed"});
            }
    } catch (e) {
        res.status(400).json({
            ok: false,
            error: e.message
        })
    }
}

exports.getGame = (req, res, next) => {
    Game.findOne(
        {_id: req.params.id}
    ).then(
        (g) => {
            res.status(200).json({
                ok: true,
                game: g,
            })
        }
    ).catch(
        (e) => res.status(400).json({
            ok: false,
            error: e.message})
    );
}

exports.hasChanged = (req, res, next) => {
    Game.findOne(
        {_id: req.params.id}
    ).then(
        (g) => {
            res.status(200).json({
                ok: true,
                hasChanged: req.body.modifs != g.modifs,
            })
        }
    ).catch(
        (e) => res.status(400).json({
            ok: false,
            error: e.message})
    );
}

exports.undoLastPiece = async (req, res, next) => {
    try {
        let g = await Game.findById(
            req.params.id
        );
        if (g.isFinished) res.status(400).json({ok: false, error_ID:"FIN"});
        else {
            let index = g.isFirstTurn ? 1 : 0;
            g.isFirstTurn = !g.isFirstTurn;
            g.pieces[index].pop();
            g.markModified('pieces');
            await g.save();
            res.status(200).json({ok: true, message: "Last piece removed !"});
        }
    } catch (e) {
        res.status(400).json({
            ok: false,
            error: e.message
        })
    }
}

exports.addPlayer = async (req, res, next) => {
    try {
        let g = await Game.findById(
            req.params.id
        );
        if (g.isFinished) res.status(400).json({ok: false, error_ID:"FIN"});
        else {
            if (g.players.length > 1) {
                res.status(400).json({ok: false, error_ID: "ALREADY_FOUND"});
                return;
            }
            g.players.push(req.body.players);
            g.markModified('players');
            await g.save();
            res.status(200).json({ok: true, message: "Player added !"});
        }
    } catch (e) {
        res.status(400).json({
            ok: false,
            error: e.message
        })
    }
}

exports.findGame = async (req, res, next) => {
    let ids = [];
    let games = await Game.find();
    for (let game of games) {
        if (game.players.length < 2) ids.push(game.id);
    }
    res.status(200).json({
        ok: true,
        IDs: ids
    })
}