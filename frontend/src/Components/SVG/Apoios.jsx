import React from "react";
//Components
import ApoioRotulado from "./ApoioRotulado";
import ApoioSimples from "./ApoioSimples";
import Engastado from "./Engastado";


const Apoio = (props) =>{

    if (props.tipo === 'Apoio Rotulado'){
        return (
            <ApoioRotulado value={props.value}></ApoioRotulado>

        )
    }
    else if (props.tipo === 'Apoio Simples'){
        return (
            <ApoioSimples value={props.value}></ApoioSimples>
        )
    }
    else if (props.tipo === 'Apoio Engastado'){
        
        return (
            <Engastado value={props.value}></Engastado>
        )
    }
}

export default Apoio


