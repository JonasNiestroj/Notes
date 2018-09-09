import React, { Component } from "react";
import ReactDOM from "react-dom";
import Canvas from "../presentational/Canvas";
import Menu from "../presentational/Menu";
import reducer from "../../reducers";
import {createStore} from "redux";
import {getPaintingModeAction} from "../../actions/paintingMode";
import {getRubberModeAction} from "../../actions/rubberMode";
import {getTextModeAction} from "../../actions/textMode";

const initialState = {
    isPainting: false,
    color: '#EE92C2',
    rubber: false,
    text: false,
};

const store = createStore(reducer, initialState);

class CanvasContainer extends Component {
    constructor(){
        super();

        this.state = {
            prevPos: { offsetX: 0, offsetY: 0 },
            line: [],
            ctx: null,
            canvas: null,
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
        this.saveClick = this.saveClick.bind(this);
        this.loadClick = this.loadClick.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    updateCanvas(ref) {
        this.canvas = ref;
    }

    onMouseDown(nativeEvent){
        if(store.getState().text){
            var textBoxFound = false;
            for(var i = 0; i < this.state.textBoxes.length; i++){
                var item = this.state.textBoxes[i];
                var mouseX = nativeEvent.clientX;
                var mouseY = nativeEvent.clientY;
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
            store.isPainting = false;
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
            store.isPainting = true;
            this.prevPos = { offsetX, offsetY }
        }
    }

    onMouseMove({ nativeEvent }) {
        if(store.isPainting){
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
        if(store.isPainting){
            store.isPainting = false;
        }
    }

    paint(prevPos, currPos) {
        const { offsetX, offsetY } = currPos;
        const { offsetX: x, offsetY: y } = prevPos;

        this.ctx.lineWidth = 5;
        this.ctx.beginPath();

        if(store.getState().rubber){
            this.ctx.globalCompositeOperation = "destination-out";
        }
        else{
            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.strokeStyle = store.getState().color;
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
        store.dispatch(getPaintingModeAction('#ff0000'));
    }

    blueClick(){
        store.dispatch(getPaintingModeAction('#0000ff'));
    }

    rubberClick(){
        store.dispatch(getRubberModeAction());
    }

    textClick(){
        store.dispatch(getTextModeAction());
    }

    saveClick(){
        this.download()

    }

    download(){
        var element = document.createElement('a');

        var data = this.ctx.getImageData(0,0,1500,900);

        var pixelArray = [];

        for(var i = 0; i < data.data.length; i += 4){
            var red = data.data[i];
            var green = data.data[i + 1];
            var blue = data.data[i + 2];
            var alpha = data.data[i + 3];
            if(red == 0 && green == 0 && blue == 0){
                continue;
            }
            var index = i;
            pixelArray.push((index & 0xFF000000) >> 24);
            pixelArray.push((index & 0x00FF0000) >> 16);
            pixelArray.push((index & 0x0000FF00) >> 8);
            pixelArray.push((index & 0x000000FF));
            pixelArray.push(red);
            pixelArray.push(green);
            pixelArray.push(blue);
            pixelArray.push(alpha);
        }
        var blob = new Blob([new Int8Array(pixelArray)], {type: "octet/stream"});

        element.setAttribute('href', URL.createObjectURL(blob));
        element.setAttribute('download', 'notes.notes');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    loadClick() {
        var input = document.getElementById('file-input');
        input.addEventListener('change', this.inputChange, false);
        input.click();
    }

    str2ab(str) {
        var buf = new ArrayBuffer(str.length); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i=0, strLen=str.length; i < strLen; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return buf;
      }

    inputChange(){
        var input = document.getElementById('file-input');
        var reader = new FileReader();
        reader.onload = (function(theFile) {
          return function(e) {
            var arrayBuffer = this.str2ab(e.target.result);
            var dataArray = new Uint8Array(arrayBuffer);
            var imageData = this.ctx.createImageData(1500, 900);
            for(var i = 0; i < dataArray.length; i += 8){
                var position = (dataArray[i] << 24) + (dataArray[i + 1] << 16)
                     + (dataArray[i + 2] << 8) + (dataArray[i + 3]);
                imageData.data[position] = dataArray[i + 4];
                imageData.data[position + 1] = dataArray[i + 5];
                imageData.data[position + 2] = dataArray[i + 6];
                imageData.data[position + 3] = dataArray[i + 7];
            }
            this.ctx.putImageData(imageData, 0, 0);
          }.bind(this);
        }.bind(this))(input.files[0]);
  
        reader.readAsBinaryString(input.files[0]);
    }

    render(){
        return (
            <div>
                <Menu redClick={this.redClick} blueClick={this.blueClick} rubberClick={this.rubberClick}
                    textClick={this.textClick} saveClick={this.saveClick} loadClick={this.loadClick}></Menu>
                <Canvas onMouseDown={this.onMouseDown} endPaintEvent={this.endPaintEvent}
                    onMouseMove={this.onMouseMove} updateCanvas={this.updateCanvas} />
            </div>

        );
    }
}

const wrapper = document.getElementById("canvas");
wrapper ? ReactDOM.render(<CanvasContainer />, wrapper) : false;

export default CanvasContainer;