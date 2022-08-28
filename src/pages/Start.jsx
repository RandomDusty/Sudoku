import React, { useEffect, useState } from 'react';
import MyButton from '../components/UI/Button/MyButton';
import { Link } from 'react-router-dom';
import '../styles/Start.css';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { getValue, saveValue } from '../utils/board';
import { useNavigate } from 'react-router-dom';

const Start = () => {
	const diff = ['easy', 'medium', 'hard'];
	const [diffIndex, setDiffIndex] = useState(0);

	const navigate = useNavigate();
	const newGame = () => {
		saveValue('board', '');
		saveValue('initialBoard', '');
		saveValue('solvedBoard', '');
		saveValue('invalidCells', '');
		saveValue('invalidRows', '');
		saveValue('invalidCols', '');
		saveValue('invalidBlocks', '');
		navigate('/game/' + diff[diffIndex], { replace: true });
	};
	useEffect(() => {
		document.title = 'Sudoku';
	}, []);
	return (
			<div className='startBd'>
				<div className='topBg'>
					<h1>Sudoku</h1>
				</div>

				<p className='text'>
					<span>
						To place a number in a square —{' '}
						<span className='subText'>type the</span>
						<br />
						<span className='subText'>number on your keyboard</span> after
						clicking on it
					</span>
				</p>

				{getValue('board') && (
					<div className='MyButton'>
						<Link to={'/game/' + getValue('diffIndex')}>
							<MyButton>Continue</MyButton>
						</Link>
						<p className='text'>
							<span style={{ fontSize: '20px' }}>
								<span className='subText'>OR</span>
							</span>
						</p>
					</div>
				)}

				<div className='arrows'>
					<div
						className={diffIndex === 0 ? 'arrow_hidden' : 'arrow'}
						onClick={() => {
							if (diffIndex) setDiffIndex(diffIndex - 1);
						}}
					>
						<KeyboardArrowLeftIcon sx={{ display: 'flex' }} color='#000000' />
					</div>
					<span className='diffText'>{diff[diffIndex].toUpperCase()}</span>
					<div
						className={diffIndex === 2 ? 'arrow_hidden' : 'arrow'}
						onClick={() => {
							if (diffIndex !== 2) setDiffIndex(diffIndex + 1);
						}}
					>
						<KeyboardArrowRightIcon sx={{ display: 'flex' }} color='#000000' />
					</div>
				</div>

				<div className='MyButton'>
					<MyButton onClick={newGame}>Play new game</MyButton>
				</div>
			</div>
	);
};

export default Start;
