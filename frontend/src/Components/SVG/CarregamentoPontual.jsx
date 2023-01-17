import React from "react";
import Arrow from "./Arrow";



const CarregamentoPontual = (props) =>{
    return (
    <>
        <Arrow x1={props.start} y1={147} x2={props.start} y2={147-props.mag}></Arrow>
    </>
    )
}

export default CarregamentoPontual
