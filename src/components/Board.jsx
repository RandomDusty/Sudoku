import React, {useEffect, useState} from 'react';
import {useFetching} from "../hooks/useFetching";
import GameService from "../API/GameService";
import classNames from "classnames";
import {checkBlock, checkColumn, checkRow} from "../utils/board";


const Board = () => {
    const [initialBoard, setInitialBoard] = useState([]);
    const [board, setBoard] = useState([]);
    const [rowFocus, setRowFocus] = useState(-1);
    const [colFocus, setColFocus] = useState(-1);
    const [lastChangeValue, setLastChangeValue] = useState(-1);
    const [lastChange, setLastChange] = useState([-1, -1]);
    const [invalidCells, setInvalidCells] = useState([]);
    const [invalidRows, setInvalidRows] = useState([]);
    const [invalidCols, setInvalidCols] = useState([]);
    const [invalidBlocks, setInvalidBlocks] = useState([]);

    const [fetchBoard, isBoardLoading, postError] = useFetching(async (diff = 'easy') => {
        const response = await GameService.createSudoku(diff);
        setInitialBoard(response);
        setBoard(response);
    })

    useEffect(() => {
        fetchBoard();
    }, [])

    useEffect(() => {
        if (lastChange[0] !== -1){
            let changedValue = board[lastChange[0]][lastChange[1]];
            let temporaryRows = invalidRows;
            let temporaryCols = invalidCols;
            let temporaryBlocks = invalidBlocks;
            let isDeleted = false;

            if (!board[lastChange[0]][lastChange[1]]) {
                temporaryRows = temporaryRows.filter(val => val !== '' + lastChange[0] + lastChange[1]);
                temporaryCols = temporaryCols.filter(val => val !== '' + lastChange[0] + lastChange[1]);
                temporaryBlocks = temporaryBlocks.filter(val => val !== '' + lastChange[0] + lastChange[1]);
                changedValue = lastChangeValue;
                isDeleted = true;
            }

            let rows = checkRow(board, lastChange,temporaryRows, changedValue, isDeleted);
            let cols = checkColumn(board, lastChange,temporaryCols, changedValue, isDeleted);
            let blocks = checkBlock(board, lastChange,temporaryBlocks, changedValue, isDeleted)

            setInvalidCells([...rows, ...cols, ...blocks]);
            setInvalidRows(rows);
            setInvalidCols(cols);
            setInvalidBlocks(blocks);
        }

    }, [lastChange])


    const getDeepCopy = (arr) => {
        return JSON.parse(JSON.stringify(arr))
    }

    const onInputKeyDown = (e, row, col) => {
        let grid = getDeepCopy(board);
        let val = parseInt(e.code[e.code.length - 1]);
        if (e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 48) {
            setLastChangeValue(grid[row][col])
            grid[row][col] = 0;
        } else if (val >= 1 && val <= 9) {
            grid[row][col] = val;
        }
        setLastChange([row,col])
        setBoard(grid);
    }

    const onInputClick = (row, col) => {
        setRowFocus(row);
        setColFocus(col);
    }

    return (
        <table>
            <tbody>
            {
                board.map((row, rIndex) => {
                    return <tr
                        key={rIndex}
                        className={(rIndex + 1) % 3 === 0 ? 'bBorder' : ''}>
                        {row.map((val, cIndex) => {
                            return <td
                                key={rIndex + cIndex}
                                className={(cIndex + 1) % 3 === 0 ? 'rBorder' : ''}
                                onClick={() => {
                                    onInputClick(rIndex, cIndex)
                                }}>
                                <input
                                    value={val ? val : ''}
                                    onChange={(e) => {
                                        e.preventDefault()
                                    }}
                                    disabled={initialBoard[rIndex][cIndex]}
                                    className={classNames('cellInput',
                                        cIndex === colFocus || rIndex === rowFocus ? 'rowColFocus' : '',
                                        invalidCells.findIndex(elem => elem === '' + rIndex + cIndex) !== -1 ? 'notValidCells' : '')}
                                    onKeyDown={(e) => {
                                        onInputKeyDown(e, rIndex, cIndex)
                                    }}
                                    maxLength={1}
                                />
                            </td>
                        })
                        }
                    </tr>
                })
            }
            </tbody>
        </table>
    );
};

export default Board;