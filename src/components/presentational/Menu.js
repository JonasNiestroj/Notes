import React from 'react';
import Button from './Button';

const Menu = ({ redClick, blueClick, rubberClick, textClick, saveClick, loadClick }) => (
    <div>
        <Button onClick={redClick} classes="" text="Red"></Button>
        <Button onClick={blueClick} classes="" text="Blue"></Button>
        <Button onClick={rubberClick} classes="" text="Eraser"></Button>
        <Button onClick={textClick} classes="" text="Text"></Button>
        <Button onClick={saveClick} classes="" text="Save"></Button>
        <Button onClick={loadClick} classes="" text="Load"></Button>
    </div>
);
 
export default Menu;