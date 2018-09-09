export default (state, action) => {
    switch(action.type){
        case "paintingMode":
            state.isPainting = true;
            state.text = false;
            state.rubber = false;
            state.color = action.payload.color;
            break;
        case "rubberMode":
            state.rubber = true;
            state.text = false;
            break;
        case "textMode":
            state.text = true;
            state.rubber = false;
            state.isPainting = false;
            break;
    }
    return state;
}