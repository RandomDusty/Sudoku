import React from 'react';
import Board from "../components/Board";
import '../styles/Game.css'
import MyButton from "../components/UI/Button/MyButton";
import {Link} from "react-router-dom";

const Game = () => {
    return (
        <div className='startBd'>
            {/*<div className='topGameBg'>*/}
            {/*</div>*/}
            <div>
                <div className="topGameNav">
                    <p className='textGame'>Sudoku</p>
                    <Link to={"/"} className="myButtonGame">
                        <MyButton>Назад</MyButton>
                    </Link>
                </div>

                <Board className='gameBoard'/>
            </div>

        </div>
    );
};

export default Game;