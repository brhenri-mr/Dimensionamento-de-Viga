import React from "react";


const Arrow = (props) => {
    const flechasCima  =`${props.x1},152 ${props.x1+3},157 ${props.x1},149 ${props.x1-3},157 ${props.x1},152`
    const flechasBaixo = `${props.x1},142 ${props.x1+3},139 ${props.x1},147 ${props.x1-3},139 ${props.x1},142`

    const utilizar = (parseFloat(props.mag)>0)?flechasBaixo:flechasCima

    return (
        <>
            <line x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} className="cargaDistribuida"></line>
            <polygon points={utilizar} className="cargaDistribuida"></polygon>
        </>
    )
}


export default Arrow