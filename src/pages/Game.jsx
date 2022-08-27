import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Board from '../components/Board';
import MyButton from '../components/UI/Button/MyButton';
import '../styles/Game.css';
import { saveValue } from '../utils/board';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/UI/Modal/Modal';

const Game = () => {
	const [modalActive, setModalActive] = useState(false);
	const [modalResult, setModalResult] = useState(false);
	const { diff } = useParams();
	const navigate = useNavigate();
	const newGame = () => {
		setModalActive(true);
	};

	useEffect(() => {
		if (modalResult) {
			saveValue('board', '');
			saveValue('initialBoard', '');
			saveValue('solvedBoard', '');
			saveValue('invalidCells', '');
			saveValue('invalidRows', '');
			saveValue('invalidCols', '');
			saveValue('invalidBlocks', '');
			navigate('/', { replace: true });
		}
	}, [modalResult]);

	
    
    useEffect(() => {
			saveValue('diffIndex', diff);
		}, [diff]);

	return (
		<div className='startBd'>
			{/*<div className='topGameBg'>*/}
			{/*</div>*/}
			<div>
				<div className='topGameNav'>
					<p className='textGame'>Sudoku</p>
					<MyButton onClick={newGame}>New game</MyButton>
				</div>

				<Board diff={diff} className='gameBoard' />
			</div>
			<Modal active={modalActive} setActive={setModalActive}>
				<span className='modalText'>Are you sure you want to start a new game?</span>
				<div style={{ display: 'flex', flexDirection: 'row',  marginTop: '15px'}}>
					<MyButton
						style={{ width: '60px', height: '30px', padding: 0, marginRight: '10px'}}
						onClick={() => setModalResult(true)}
					>
						Yes
					</MyButton>
					<MyButton
						style={{ width: '60px', height: '30px', padding: 0}}
						onClick={() => setModalActive(false)}
					>
						No
					</MyButton>
				</div>
			</Modal>
		</div>
	);
};

export default Game;
