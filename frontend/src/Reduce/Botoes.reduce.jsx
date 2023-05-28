import actionType from "../Constants";

const INITIAL_STATE = {
    APOIOS: [],
    CARREGAMENTOS:[],
    ED:[],
}

const reducers  =(state = INITIAL_STATE, action) => {
    switch (action.type){
        case actionType.ADD_APOIO:
            return {APOIOS: [...state.APOIOS, {...action.payload}], CARREGAMENTOS:state.CARREGAMENTOS,ED:state.ED}
        case actionType.REMOVER_APOIO:
            return {APOIOS: state.APOIOS.filter(x => x.id !== action.payload.id),CARREGAMENTOS:state.CARREGAMENTOS,ED:state.ED}
        case actionType.ADD_CAR:
            return {CARREGAMENTOS: [...state.CARREGAMENTOS, {...action.payload}],APOIOS:state.APOIOS,ED:state.ED}
        case actionType.REMOVER_CAR:
            return {CARREGAMENTOS: state.CARREGAMENTOS.filter(x => x.name !== action.payload.name),APOIOS:state.APOIOS,ED:state.ED}
        case actionType.ADD_COMB:
            //Adiciona a combinacao ao carregamento respectivo
            const temp = state.CARREGAMENTOS
            temp.map((item,indice)=>{
                Object.keys(action.payload).forEach(chave=>{
                    if (item.name === chave){
                        item.comb = action.payload[chave]
                    }
                })
            })

            return {CARREGAMENTOS: [...temp],APOIOS:state.APOIOS,ED:state.ED}
        case actionType.ADD_INF:
            return {CARREGAMENTOS:state.CARREGAMENTOS,APOIOS:state.APOIOS,ED:[...state.ED, {...action.payload}]}
        default:
            return state
    }
}

export {reducers}
