import actionType from "../Constants";

const actions ={
    salvar: el =>({
        type: actionType.SALVAR,
        payload: el,
    }),

}

export {actions}