import React from 'react';
import MyButton from "../components/UI/Button/MyButton";
import {Link} from "react-router-dom";
import '../styles/Start.css';


const Start = () => {
    return (
        <div className='startBd'>
            <div className='topBg'>
                <h1>Sudoku</h1>
            </div>

            <p className='text'>
                    <span>
                        To place a number in a square — <span className='subText'>type the</span><br/>
                        <span className='subText'>number on your keyboard</span> whilst hovering<br/>
                        over the square, or after clicking on it
                    </span>
            </p>
            <div className='MyButton'>
                <Link to={'/game'}>
                    <MyButton>
                        Play
                    </MyButton>
                </Link>
            </div>
        </div>
    );
};

export default Start;