export function saveToFile (data) {
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

    var element = document.createElement('a');

    element.setAttribute('href', URL.createObjectURL(blob));
    element.setAttribute('download', 'notes.notes');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}