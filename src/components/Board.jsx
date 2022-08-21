import React, {useEffect, useState} from 'react';
import {useFetching} from "../hooks/useFetching";
import GameService from "../API/GameService";
import classNames from "classnames";


const Board = () => {
    const [initialBoard, setInitialBoard] = useState([]);
    const [board, setBoard] = useState([]);
    const [rowFocus, setRowFocus] = useState(-1);
    const [colFocus, setColFocus] = useState(-1);
    // const [lastChange, setLastChange] = useState([-1,-1])
    // const [notValidCells, setNotValidCells] = useState([])

    const [fetchPosts, isBoardLoading, postError] = useFetching(async (diff = 'easy') => {
        const response = await GameService.createSudoku(diff);
        setInitialBoard(response);
        setBoard(response);
    })

    useEffect(() => {
        fetchPosts();
    }, [])

    // useEffect(() => {
    //     checkRow()
    // }, [lastChange])


    // const checkRow = () => {
    //     const arr = board.find((val, index) => index === lastChange[0]);
    //     if (arr) {
    //         arr.map((val, index) => {
    //             if(val === board[lastChange[0]][lastChange[1]])
    //             {
    //                 // setNotValidCells([...notValidCells, [lastChange[0], index]])
    //                 console.log([lastChange[0], index])
    //             }
    //             return
    //         })
    //
    //         console.log('----')
    //     }
    // }

    const getDeepCopy = (arr) => {
        return JSON.parse(JSON.stringify(arr))
    }

    const onInputKeyDown = (e, row, col) => {
        let grid = getDeepCopy(board);
        let val = parseInt(e.code[e.code.length - 1]);
        if (e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 48) {
            grid[row][col] = 0;
        } else if (val >= 1 && val <= 9) {
            grid[row][col] = val;
        }
        // setLastChange([row,col])
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
                                    className={classNames('cellInput',
                                        cIndex === colFocus || rIndex === rowFocus ? 'rowColFocus' : '')}
                                    // notValidCells.includes([rIndex,cIndex]) ? 'notValidCells' : '')}
                                    disabled={initialBoard[rIndex][cIndex]}
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