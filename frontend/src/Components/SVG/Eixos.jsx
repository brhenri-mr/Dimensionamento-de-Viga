import React from "react";


const Eixos= (props) =>{

    const flechasBaixo = `${50},62 ${50+3},59 ${50},67 ${50-3},59 ${50},62`



    return (
        <>
            <line x1={50} y1={30} x2={50} y2={62} className="cargaDistribuida"></line>
            <polygon points={flechasBaixo} className="cargaDistribuida"></polygon>
            <text x="47" y="85">y</text>
            <line x1={50} y1={30} x2={82} y2={30} className="cargaDistribuida"></line>
            <polygon points={`${82},30 ${82-3},33 ${82+5},30 ${82-3},27 ${82},30`} className="cargaDistribuida"></polygon>
            <text  x="95" y="35">x</text>
        </>
    )
}

export default Eixos