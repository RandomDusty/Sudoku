import React from 'react';
import {Route, Routes} from "react-router-dom";
import Start from "../pages/Start";
import Game from "../pages/Game";

const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Start/>}/>
            <Route path='/game/:diff' element={<Game/>}/>
        </Routes>
    );
};

export default AppRouter;