import React, { useEffect, useState } from 'react';
import { useFetching } from '../hooks/useFetching';
import GameService from '../API/GameService';
import classNames from 'classnames';
import {
	checkBlock,
	checkColumn,
	checkRow,
	saveValue,
	getValue,
} from '../utils/board';
import { Box, CircularProgress } from '@mui/material';
import Modal from '../components/UI/Modal/Modal';
import MyButton from '../components/UI/Button/MyButton';
import { useNavigate } from 'react-router-dom';

const Board = ({ diff }) => {
	const [modalActive, setModalActive] = useState(false);
	const [initialBoard, setInitialBoard] = useState([]);
	const [solvedBoard, setSolvedBoard] = useState([]);
	const [board, setBoard] = useState([]);
	const [rowFocus, setRowFocus] = useState(-1);
	const [colFocus, setColFocus] = useState(-1);
	const [lastChangeValue, setLastChangeValue] = useState(-1);
	const [lastChange, setLastChange] = useState([-1, -1]);
	const [invalidCells, setInvalidCells] = useState([]);
	const [invalidRows, setInvalidRows] = useState([]);
	const [invalidCols, setInvalidCols] = useState([]);
	const [invalidBlocks, setInvalidBlocks] = useState([]);
	const navigate = useNavigate();

	const [fetchBoard, isBoardLoading, boardError] = useFetching(
		async (diff = 'easy') => {
			const response = await GameService.createSudoku(diff);
			setInitialBoard(response);
			setBoard(response);
			saveValue('board', response);
			saveValue('initialBoard', response);
			fetchSolution({ board: response });
		}
	);

	const [fetchSolution] = useFetching(async data => {
		const response = await GameService.getSolution(data);
		console.log(response);
		setSolvedBoard(response);
		saveValue('solvedBoard', response);
	});

	useEffect(() => {
		if (!getValue('board')) {
			fetchBoard(diff);
		} else {
			setBoard(getValue('board'));
			setInitialBoard(getValue('initialBoard'));
			setSolvedBoard(getValue('solvedBoard'));
			setInvalidCells(getValue('invalidCells'));
			setInvalidRows(getValue('invalidRows'));
			setInvalidCols(getValue('invalidCols'));
			setInvalidBlocks(getValue('invalidBlocks'));
		}
	}, []);

	useEffect(() => {
		saveValue('board', board);
		saveValue('invalidCells', invalidCells);
		saveValue('invalidRows', invalidRows);
		saveValue('invalidCols', invalidCols);
		saveValue('invalidBlocks', invalidBlocks);
		if (JSON.stringify(board) !== JSON.stringify(initialBoard)) {
			if (JSON.stringify(board) === JSON.stringify(solvedBoard)) {
				setInitialBoard(board);
				setModalActive(true);
			}
		}
	}, [board]);

	useEffect(() => {
		if (board.length > 0 &&
			JSON.stringify(board) === JSON.stringify(solvedBoard) &&
			!modalActive
		) {
			saveValue('board', '');
			saveValue('initialBoard', '');
			saveValue('solvedBoard', '');
			saveValue('invalidCells', '');
			saveValue('invalidRows', '');
			saveValue('invalidCols', '');
			saveValue('invalidBlocks', '');
			navigate('/', { replace: true });
		}
	}, [modalActive]);

	useEffect(() => {
		if (lastChange[0] !== -1) {
			let changedValue = board[lastChange[0]][lastChange[1]];
			let temporaryRows = invalidRows;
			let temporaryCols = invalidCols;
			let temporaryBlocks = invalidBlocks;
			let isDeleted = false;

			if (!board[lastChange[0]][lastChange[1]]) {
				temporaryRows = temporaryRows.filter(
					val => val !== '' + lastChange[0] + lastChange[1]
				);
				temporaryCols = temporaryCols.filter(
					val => val !== '' + lastChange[0] + lastChange[1]
				);
				temporaryBlocks = temporaryBlocks.filter(
					val => val !== '' + lastChange[0] + lastChange[1]
				);
				changedValue = lastChangeValue;
				isDeleted = true;
			}

			if (lastChangeValue && board[lastChange[0]][lastChange[1]]) {
				temporaryRows = temporaryRows.filter(
					val => board[+val[0]][+val[1]] !== lastChangeValue
				);
				temporaryCols = temporaryCols.filter(
					val => board[+val[0]][+val[1]] !== lastChangeValue
				);
				temporaryBlocks = temporaryBlocks.filter(
					val => board[+val[0]][+val[1]] !== lastChangeValue
				);
			}

			let rows = checkRow(
				board,
				lastChange,
				temporaryRows,
				changedValue,
				isDeleted
			);
			let cols = checkColumn(
				board,
				lastChange,
				temporaryCols,
				changedValue,
				isDeleted
			);
			let blocks = checkBlock(
				board,
				lastChange,
				temporaryBlocks,
				changedValue,
				isDeleted
			);

			setInvalidCells([...rows, ...cols, ...blocks]);
			setInvalidRows(rows);
			setInvalidCols(cols);
			setInvalidBlocks(blocks);
		}
	}, [lastChange]);

	const getDeepCopy = arr => {
		return JSON.parse(JSON.stringify(arr));
	};

	const onInputKeyDown = (e, row, col) => {
		let grid = getDeepCopy(board);
		let val = parseInt(e.code[e.code.length - 1]);
		setLastChangeValue(grid[row][col]);
		if (e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 48) {
			grid[row][col] = 0;
		} else if (e.code[0] !== 'F' && val >= 1 && val <= 9) {
			grid[row][col] = val;
		}
		setLastChange([row, col]);
		setBoard(grid);
	};

	const onInputClick = (row, col) => {
		setRowFocus(row);
		setColFocus(col);
	};

	const fill = () => {
		setBoard(solvedBoard);
	}

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{isBoardLoading ? (
				<Box sx={{ display: 'flex', mt: '45px' }}>
					<CircularProgress />
				</Box>
			) : (
				<table>
					<tbody>
						{board.map((row, rIndex) => {
							return (
								<tr
									key={rIndex}
									className={(rIndex + 1) % 3 === 0 ? 'bBorder' : ''}
								>
									{row.map((val, cIndex) => {
										return (
											<td
												key={rIndex + cIndex}
												className={(cIndex + 1) % 3 === 0 ? 'rBorder' : ''}
												onClick={() => {
													onInputClick(rIndex, cIndex);
												}}
											>
												<input
													value={val ? val : ''}
													onChange={e => {
														e.preventDefault();
													}}
													disabled={initialBoard[rIndex][cIndex]}
													className={classNames(
														'cellInput',
														cIndex === colFocus || rIndex === rowFocus
															? 'rowColFocus'
															: '',
														invalidCells.findIndex(
															elem => elem === '' + rIndex + cIndex
														) !== -1
															? 'notValidCells'
															: ''
													)}
													onKeyDown={e => {
														onInputKeyDown(e, rIndex, cIndex);
													}}
													maxLength={1}
												/>
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
			<Modal active={modalActive} setActive={setModalActive}>
				<span className='modalText'>
					You solved the puzzle! Congratulations!
				</span>
				<MyButton
					style={{
						width: '80px',
						height: '30px',
						padding: 0,
						marginTop: '15px',
					}}
					onClick={() => setModalActive(false)}
				>
					OK
				</MyButton>
			</Modal>
		</div>
	);
};

export default Board;
