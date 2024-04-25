const gameLogic = require("../gameLogic/main");

let start = [];

let firstPlayerWins = [
    [[[1, 1], [2, 2], [3, 3], [0, 0]], []],
    [[[0, 0], [1, 0], [2, 0], [3, 0]], []],
    [[[0, 0], [0, 1], [0, 2], [0, 3]], []]
]

test("start", () => {
    expect(gameLogic.isFinished(start)).toBe(false);
})

test("win of first player", () => {
    for (let first of firstPlayerWins) {
        expect(gameLogic.isFinished(first)).toBe(0);
    }
}
)