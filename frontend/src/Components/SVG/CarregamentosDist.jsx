import React from "react";
import Arrow from "./Arrow";

const CarregamentoDist = (props)=>{

    const comprimentoreal = props.comprimento + props.start
    let espacos = 0
    let quantidade_arrow = []
    let temp = props.start
    const posicao = (props.mag<0)?1.40:1.15


    const cotainicial = (props.mag>0)?147:147

    for(let i of [9,7,5,3]){
        if (props.comprimento%i === 0){
            espacos = props.comprimento/i
            break
        }
        else{
            espacos = props.comprimento/7
        }
    }

    while(temp<=comprimentoreal){
        quantidade_arrow.push(temp)
        temp=temp+espacos
    }

    return (<>
        <text x={props.start+(props.comprimento-3*12)/2} y={147.5-props.mag*posicao*props.escala} fontSize={12}>{`${props.mag} kN/m`}</text>
        <rect x={props.start} y={cotainicial-props.mag*props.escala} width={props.comprimento} height={props.mag*props.escala} className="cargaDistribuidaFundo"></rect>
        <line x1={props.start} y1={cotainicial-props.mag*props.escala} x2={comprimentoreal} y2={cotainicial-props.mag*props.escala} className="cargaDistribuida"></line>
        {quantidade_arrow.map((item,index)=>{return <Arrow key ={index} x1={item} y1={147} x2={item} y2={147-props.mag*props.escala} mag={props.mag*props.escala}></Arrow> })}
        
    </>
    )

}


export default CarregamentoDist






