import actionType from "../Constants";

const INITIAL_STATE = {
    BARRA: 0,

}

const reducers  =(state = INITIAL_STATE, action) => {
    switch (action.type){
        case actionType.MODIFICAR_COMPRIMENTO:
            return {BARRA: action.payload}
        default:
            return state
    }
}

export {reducers}

