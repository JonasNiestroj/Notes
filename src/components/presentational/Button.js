import React from 'react'

const Button = ({ onClick, classes, text }) => (
    <button onClick={onClick} className={classes}>{text}</button>
);

export default Button;