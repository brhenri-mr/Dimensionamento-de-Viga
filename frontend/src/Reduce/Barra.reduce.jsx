import actionType from "../Constants";

const INITIAL_STATE = {
    BARRA: 0,
    COMB:['Envoltória',false]

}

const reducers  =(state = INITIAL_STATE, action) => {
    switch (action.type){
        case actionType.MODIFICAR_COMPRIMENTO:
            return {BARRA: action.payload,COMB:state.COMB}
        case actionType.COMB:
            return {COMB: [action.payload,true],BARRA:state.BARRA}
        case actionType.COMB_LOGICO:
                return {COMB: [state.COMB[0],false],BARRA:state.BARRA}
        default:
            return state
    }
}

export {reducers}

