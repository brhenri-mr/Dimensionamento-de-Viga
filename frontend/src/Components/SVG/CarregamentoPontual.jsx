import React from "react";
import Arrow from "./Arrow";



const CarregamentoPontual = (props) =>{
    return (
    <>
        <text text-anchor="middle" transform={`translate(${props.start-4},${147-props.mag*props.escala}) rotate(-90)`} fontSize={12}>{`${props.mag}kN`}</text>
        <Arrow x1={props.start} y1={147} x2={props.start} y2={147-props.mag*props.escala} mag={props.mag}></Arrow>
    </>
    )
}

export default CarregamentoPontual
