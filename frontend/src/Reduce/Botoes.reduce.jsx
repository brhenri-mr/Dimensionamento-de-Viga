import actionType from "../Constants";

const INITIAL_STATE = {
    APOIOS: [],
    CARREGAMENTOS:[],
}

const reducers  =(state = INITIAL_STATE, action) => {
    switch (action.type){
        case actionType.ADD_APOIO:
            console.log(state)
            return {APOIOS: [...state.APOIOS, {...action.payload}], CARREGAMENTOS:state.CARREGAMENTOS}
        case actionType.REMOVER_APOIO:
            return {APOIOS: state.APOIOS.filter(x => x.id !== action.payload.id),CARREGAMENTOS:state.CARREGAMENTOS}
        case actionType.ADD_CAR:
            return {CARREGAMENTOS: [...state.CARREGAMENTOS, {...action.payload}],APOIOS:state.APOIOS}
        case actionType.REMOVER_CAR:
            return {CARREGAMENTOS: state.CARREGAMENTOS.filter(x => x.id !== action.payload.id),APOIOS:state.APOIOS}
        default:
            return state
    }
}

export {reducers}
