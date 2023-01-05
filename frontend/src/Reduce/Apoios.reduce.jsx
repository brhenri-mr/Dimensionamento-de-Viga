import actionType from "../Constants";

const INITIAL_STATE = {
    APOIOS: []
}

const reducers  =(state = INITIAL_STATE, action) => {
    switch (action.type){
        case actionType.ADD_APOIO:
            return {APOIOS: [...state.APOIOS, {...action.payload}]}
        case actionType.REMOVER_APOIO:
            return {APOIOS: state.APOIOS.filter(x => x.id !== action.payload.id)}
        default:
            return state
    }
}

export {reducers}
