import React, {PropsWithChildren} from 'react';
import classes from './MyButton.module.css';


const MyButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.myBtn}>
            <div className={classes.myBtnText}>
                {children}
            </div>
        </button>
    );
};

export default MyButton;