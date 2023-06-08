import actionType from "../Constants";

const INITIAL_STATE = {
    CARACTERISTICAS: {
        fck:0,
        fyk:0,
        h:0,
        dmax:0,
        bw:0,
        dL:0,
        dT:0,
        classeambiental:0,
        fykt:0,
        agregado:0,
        ductilidade:0
    }
}

const reducers = (state = INITIAL_STATE, action)=>{
    switch (action.type){
        case actionType.ADD_CARACTERISTICAS:
            return {CARACTERISTICAS:action.payload}
        default:
                return state
    }
}


export {reducers}