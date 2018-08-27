import React, { Component } from "react";
import ReactDOM from "react-dom";
import Canvas from "../presentational/Canvas";
import Menu from "../presentational/Menu";

class CanvasContainer extends Component {
    constructor(){
        super();

        this.state = {
            isPainting: false,
            prevPos: { offsetX: 0, offsetY: 0 },
            line: [],
            ctx: null,
            canvas: null,
            color: '#EE92C2',
            rubber: false,
            text: false,
            textBoxes: []
        };

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
        this.redClick = this.redClick.bind(this);
        this.blueClick = this.blueClick.bind(this);
        this.rubberClick = this.rubberClick.bind(this);
        this.textClick = this.textClick.bind(this);
    }

    updateCanvas(ref) {
        this.canvas = ref;
    }

    onMouseDown(nativeEvent){
        if(this.state.text){
            var event = nativeEvent;
            var textBoxFound = false;
            for(var i = 0; i < this.state.textBoxes.length; i++){
                var item = this.state.textBoxes[i];
                var mouseX = event.clientX;
                var mouseY = event.clientY;
                var x = item.offsetLeft;
                var y = item.offsetTop;
                var xWidth = x + item.offsetWidth;
                var yWidth = y + item.offsetHeight;
                if(mouseX > x && mouseX < xWidth && mouseY > y && mouseY < yWidth){
                    textBoxFound = true;
                    item.focus();
                }
            }
            if(textBoxFound){
                nativeEvent.preventDefault();
                return false;
            }
            this.isPainting = false;
            var box = document.createElement('div');
            box.style.position = 'absolute';
            box.style.left = nativeEvent.clientX + 'px';
            box.style.top = nativeEvent.clientY + 'px';
            box.style.width = 'auto';
            box.style.height = 'auto';
            box.style.minWidth = '200px';
            box.style.minHeight = '100px';
            box.style.border = '1px solid';
            box.tabIndex = '0';
            box.style.zIndex = '-10';

            box.onkeydown = function(event){
                if(event.keyCode === 13){
                    event.target.innerHTML += "<br>";
                }
                else if(event.keyCode === 8){
                    event.target.innerHTML = event.target.innerHTML.substring(0, event.target.innerHTML.length - 1);
                }
                else{
                    event.target.innerHTML += event.key;
                }
                event.preventDefault();
            }

            box.onblur = function(event){
                event.target.style.border = '0px';
            }

            document.getElementById('textboxes').appendChild(box);
            
            this.state.textBoxes.push(box);

            window.requestAnimationFrame(() => {
                box.focus();
            })
        }
        else{
            const { offsetX, offsetY } = nativeEvent;
            this.isPainting = true;
            this.prevPos = { offsetX, offsetY }
        }
    }

    onMouseMove({ nativeEvent }) {
        if(this.isPainting){
            const { offsetX, offsetY } = nativeEvent;
            const offsetData = { offsetX, offsetY };
            const positionData = {
                start: this.prevPos ,
                stop: offsetData,
            };
            this.state.line = this.state.line.concat(positionData);

            this.paint(this.prevPos, offsetData, this.color);
        }
    }

    endPaintEvent() {
        if(this.isPainting){
            this.isPainting = false;
        }
    }

    paint(prevPos, currPos, color) {
        const { offsetX, offsetY } = currPos;
        const { offsetX: x, offsetY: y } = prevPos;

        this.ctx.lineWidth = 5;
        this.ctx.beginPath();

        if(this.state.rubber){
            this.ctx.globalCompositeOperation = "destination-out";
        }
        else{
            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.strokeStyle = this.state.color;
        }

        this.ctx.moveTo(x, y);
        this.ctx.lineTo(offsetX, offsetY);

        this.ctx.stroke();

        this.prevPos = { offsetX, offsetY };
    }

    componentDidMount(){
        this.canvas.width = 1500;
        this.canvas.height = 900;
        this.ctx = this.canvas.getContext('2d')
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5;
    }

    redClick(){
        this.state.color = '#ff0000';
        this.state.rubber = false;
        this.state.text = false;
    }

    blueClick(){
        this.state.color = '#0000ff';
        this.state.rubber = false;
        this.state.text = false;
    }

    rubberClick(){
        this.state.rubber = true;
        this.state.text = false;
    }

    textClick(){
        this.state.text = true;
    }

    render(){
        return (
            <div>
                <Menu redClick={this.redClick} blueClick={this.blueClick} rubberClick={this.rubberClick}
                    textClick={this.textClick}></Menu>
                <Canvas onMouseDown={this.onMouseDown} endPaintEvent={this.endPaintEvent}
                    onMouseMove={this.onMouseMove} updateCanvas={this.updateCanvas} />
            </div>

        );
    }
}

const wrapper = document.getElementById("canvas");
wrapper ? ReactDOM.render(<CanvasContainer />, wrapper) : false;

export default CanvasContainer;