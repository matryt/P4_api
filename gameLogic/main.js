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

exports.isFinished = isFinished;