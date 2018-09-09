export default (state, action) => {
    switch(action.type){
        case "paintingMode":
            return {
                ...state,
                isPainting: true,
                text: false,
                rubber: false,
                color: action.payload.color
            }
        case "rubberMode":
            return {
                ...state,
                rubber: true,
                text: false
            }
        case "textMode":
            return {
                ...state,
                text: true,
                rubber: false,
                isPainting: false
            }
    }
    return state;
}