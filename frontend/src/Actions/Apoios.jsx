import actionType from "../Constants";

const actions ={
    adicionar: el =>({
        type: actionType.ADD_APOIO,
        payload: el,
    }),
    remover: el =>({
        type: actionType.REMOVER_APOIO,
        payload: el,
    })
}

export {actions}
