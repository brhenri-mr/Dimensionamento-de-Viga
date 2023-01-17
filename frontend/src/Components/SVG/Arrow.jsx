import React from "react";


const Arrow = (props) => {
    return (
        <>
            <line x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} className="cargaDistribuida"></line>
            <polygon points={`${props.x1},142 ${props.x1+3},139 ${props.x1},147 ${props.x1-3},139 ${props.x1},142`} className="cargaDistribuida"></polygon>
        </>
    )
}


export default Arrow