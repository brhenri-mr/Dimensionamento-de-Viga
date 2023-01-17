import actionType from "../Constants";

const actions ={
    modificar: el =>({
        type: actionType.MODIFICAR_COMPRIMENTO,
        payload: el,
    })
}

export {actions}
