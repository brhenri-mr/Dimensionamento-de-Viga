import actionType from "../Constants";

const actions ={
    adicionar: el =>({
        type: actionType.COMB,
        payload: el,
    }),
    atualizar:el =>({
        type: actionType.COMB_LOGICO,
        payload: el,
    }),

}

export {actions}