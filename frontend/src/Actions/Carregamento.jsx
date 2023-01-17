import actionType from "../Constants";

const actions ={
    adicionar: el =>({
        type: actionType.ADD_CAR,
        payload: el,
    }),
    remover: el =>({
        type: actionType.REMOVER_CAR,
        payload: el,
    })
}

export {actions}
