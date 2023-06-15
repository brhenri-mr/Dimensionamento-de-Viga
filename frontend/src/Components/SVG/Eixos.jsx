import React from "react";


const Eixos= (props) =>{

    const flechasBaixo = `${50},32 ${50+3},29 ${50},37 ${50-3},29 ${50},32`



    return (
        <>
            <line x1={50} y1={3} x2={50} y2={32} className="cargaDistribuida"></line>
            <polygon points={flechasBaixo} className="cargaDistribuida"></polygon>
            <text x="47" y="50">y</text>
            <line x1={50} y1={3} x2={82} y2={3} className="cargaDistribuida"></line>
            <polygon points={`${82},3 ${82-3},6 ${82+5},3 ${82-3},0 ${82},3`} className="cargaDistribuida"></polygon>
            <text  x="95" y="12">x</text>
        </>
    )
}

export default Eixos