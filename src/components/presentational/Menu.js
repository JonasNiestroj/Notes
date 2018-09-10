import React from 'react';
import Button from './Button';

const Menu = ({ redClick, blueClick, rubberClick, textClick, saveClick, loadClick }) => (
    <div className="menu">
        <div className="colorpicker">
            <Button classes="fa fa-pen"></Button>
            <div className="colors">
                <Button onClick={redClick} classes="red" text=""></Button>
                <Button onClick={blueClick} classes="blue" text=""></Button>
            </div>
        </div>


        <Button onClick={rubberClick} classes="fa fa-eraser" text=""></Button>
        <Button onClick={textClick} classes="fa fa-font" text=""></Button>
        <Button onClick={saveClick} classes="fa fa-save" text=""></Button>
        <Button onClick={loadClick} classes="fa fa-upload" text=""></Button>
    </div>
);
 
export default Menu;