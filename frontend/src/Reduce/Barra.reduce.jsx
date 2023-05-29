import actionType from "../Constants";

const INITIAL_STATE = {
    BARRA: 0,
    COMB:['Envoltória',false],
    MOMENTOMAX:0

}

const reducers  =(state = INITIAL_STATE, action) => {
    switch (action.type){
        case actionType.MODIFICAR_COMPRIMENTO:
            return {BARRA: action.payload,COMB:state.COMB,MOMENTOMAX:state.MOMENTOMAX}
        case actionType.COMB:
            return {COMB: [action.payload,true],BARRA:state.BARRA,MOMENTOMAX:state.MOMENTOMAX}
        case actionType.COMB_LOGICO:
                return {COMB: [state.COMB[0],false],BARRA:state.BARRA,MOMENTOMAX:state.MOMENTOMAX}
        case actionType.SALVAR:
            return {COMB: state.COMB,BARRA:state.BARRA,MOMENTOMAX:((state.MOMENTOMAX<action.payload[1])?action.payload[1]:state.MOMENTOMAX)}
        default:
            return state
    }
}

export {reducers}

