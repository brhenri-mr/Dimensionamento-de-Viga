import actionType from "../Constants";

const actions= {
    adicionar: el =>({
        type: actionType.ADD_CARACTERISTICAS,
        payload: el,
    }),

}

export default actions