export const checkRow = (board, lastChange, temporaryCells, changedValue, isDeleted) => {
    let indexes = [];
    for(let i = 0; i < 9; i++){
        if (board[lastChange[0]][i] === changedValue){
            indexes.push('' + lastChange[0] + i);
        }
    }

    if (indexes.length === 1) {
        return temporaryCells.filter(val => val !== indexes[0]);
    } else if (isDeleted) {
        return temporaryCells;
    } else {
        return [...temporaryCells, ...indexes.filter(val => temporaryCells.findIndex(elem => elem === val) === -1)];
    }
}

export const checkColumn = (board, lastChange, temporaryCells, changedValue, isDeleted) => {
    let indexes = [];

    for(let i = 0; i < 9; i++){
        if (board[i][lastChange[1]] === changedValue){
            indexes.push(''+ i + lastChange[1]);
        }
    }

    if (indexes.length === 1) {
        return temporaryCells.filter(val => val !== indexes[0]);
    } else if (isDeleted) {
        return temporaryCells;
    } else {
        return [...temporaryCells, ...indexes.filter(val => temporaryCells.findIndex(elem => elem === val) === -1)];
    }
}

export const checkBlock = (board, lastChange, temporaryCells, changedValue, isDeleted) => {
    let indexes = [];
    const startRowIndex = lastChange[0] <= 2 ? 0 : lastChange[0] <= 5 ? 3 : 6;
    const startColIndex = lastChange[1] <= 2 ? 0 : lastChange[1] <= 5 ? 3 : 6

    for(let i = 0; i < 3; i++){
        if (board[startRowIndex][startColIndex + i] === changedValue){
            indexes.push( '' + (startRowIndex) + (startColIndex + i));
        }
        if (board[startRowIndex + 1][startColIndex + i] === changedValue){
            indexes.push('' + (startRowIndex + 1) + (startColIndex + i));
        }
        if (board[startRowIndex + 2][startColIndex + i] === changedValue){
            indexes.push('' + (startRowIndex + 2) + (startColIndex + i));
        }
    }

    if (indexes.length === 1) {
        return temporaryCells.filter(val => val !== indexes[0]);
    } else if (isDeleted) {
        return temporaryCells;
    } else {
        return [...temporaryCells, ...indexes.filter(val => temporaryCells.findIndex(elem => elem === val) === -1)];
    }
}