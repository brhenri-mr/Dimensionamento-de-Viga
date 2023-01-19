import React from "react";
import Arrow from "./Arrow";

const CarregamentoDist = (props)=>{

    const comprimentoreal = props.comprimento + props.start
    let espacos = 0
    let quantidade_arrow = []
    let temp = props.start

    for(let i of [9,7,5,3]){
        if (props.comprimento%i === 0){
            espacos = props.comprimento/i
            break
        }
    }

    while(temp<=comprimentoreal){
        quantidade_arrow.push(temp)
        temp=temp+espacos
    }

    return (<>

        <rect x={props.start} y={147-props.mag} width={props.comprimento} height={props.mag} className="cargaDistribuidaFundo"></rect>
        <line x1={props.start} y1={147-props.mag} x2={comprimentoreal} y2={147-props.mag} className="cargaDistribuida"></line>
        {quantidade_arrow.map((item,index)=>{return <Arrow key ={index} x1={item} y1={147} x2={item} y2={147-props.mag}></Arrow> })}
        
    </>
    )

}


export default CarregamentoDist






