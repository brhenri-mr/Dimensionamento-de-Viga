import React from "react";
// componentes
import Apoio from "../SVG/Apoios";
import CarregamentoPontual from "../SVG/CarregamentoPontual";
import CarregamentoDist from "../SVG/CarregamentosDist";
import Viga from "../SVG/Viga";
//Constante
import PadraoParaDesenho from "../../Constants/PadraoParaDesenho";

const Figura = (props) =>{

    return (
        <div>
            <svg {...PadraoParaDesenho}>
                <Viga value={props.barra}></Viga>
                {props.apoios.map((item,index)=>{
                    return <Apoio key= {index} tipo = {item.tipo} value={item.value}></Apoio>
                })}
                {Object.values(props.carregamentos).map((item,index) =>{
                    if(item['tipo'] ==='Pontual'){
                        return <CarregamentoPontual key={index} mag={item['mag']} start={item['pos'][0]}></CarregamentoPontual>
                    }
                    else if(item['tipo']==='Distribuido'){
                        return <CarregamentoDist key={index} comprimento={item['pos'][1]-item['pos'][0]} mag={item['mag']} start={item['pos'][0]}></CarregamentoDist>
                    }
                })}
            </svg>
        </div>
    )
}

export default Figura