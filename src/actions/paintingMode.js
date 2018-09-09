export function getPaintingModeAction(color){
    return{
        type: "paintingMode",
        payload: {color: color}
    }
}