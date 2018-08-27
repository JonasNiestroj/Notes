import React from 'react';
import Button from './Button';

const Menu = ({ redClick, blueClick, rubberClick, textClick }) => (
    <div>
        <Button onClick={redClick} classes="" text="Rot"></Button>
        <Button onClick={blueClick} classes="" text="Blau"></Button>
        <Button onClick={rubberClick} classes="" text="Radiergummi"></Button>
        <Button onClick={textClick} classes="" text="Text"></Button>
    </div>
);
 
export default Menu;