import actionType from "../Constants";

const actions ={
    adicionar: el =>({
        type: actionType.ADD_CAR,
        payload: el,
    }),
    remover: el =>({
        type: actionType.REMOVER_CAR,
        payload: el,
    }),
    adicionar_comb: el =>({
        type:actionType.ADD_COMB,
        payload:el
    })
}

export {actions}
