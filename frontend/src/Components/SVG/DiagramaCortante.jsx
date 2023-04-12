import React from "react";
//Componentes
import Viga from "../SVG/Viga";
import Apoio from "../SVG/Apoios";
//Constante
import PadraoParaDesenho from "../../Constants/PadraoParaDesenho";

const DiagramaCortante = (props) =>{
    const inicio = [0]
    const points = ['0,0 0,0']
    //controla o texto 
    const texto = []
    if (Object.keys(props.metrigidez).length !==0){ 
        Object.keys(props.metrigidez["Esforcos Internos"]).forEach((chave,indice)=>{ //roda os EL
            const Cortante = props.metrigidez["Esforcos Internos"][chave]["Cortante"]
            const trecho  = props.metrigidez["Esforcos Internos"][chave]["Trecho"]
            points.push(`${trecho[1]+50},147.5 ${trecho[0]+50},147.5 ${50+trecho[0]},${147.5-Cortante[0]} ${trecho[1]+50},${147.5+Cortante[1]}`)
            inicio.push(trecho[1])
            if (Cortante[0]<0){
                texto.push([trecho[0]+50,147.5-Cortante[0],Cortante[0],-1.2])
            }
            else{
                texto.push([trecho[0]+50,147.5-Cortante[0],Cortante[0],0.6])
            }
            
            if(Object.keys(props.metrigidez["Esforcos Internos"]).length===texto.length){
                if (Cortante[1]>0){
                    texto.push([trecho[1]+50,147.5+Cortante[1],Cortante[1],-1.2])
                }
                else{
                    texto.push([trecho[1]+50,147.5+Cortante[1],Cortante[1],0.6])
                }
            }



        })
    }

    return(
        <>
            <svg {...PadraoParaDesenho}>
                <g>
                    {texto.map((valor,key)=>{
                        return <text key={key} x={valor[0]} y={valor[1]-valor[3]*15}>{valor[2]}</text>
                    })}
                </g>
                {points.map((item,indice)=>{  
                    return <polygon points={item} key={indice} className="graficocorte"></polygon>
                })}
                <Viga value={props.barra}></Viga>
                {props.apoios.map((item,index)=>{
                    return <Apoio key= {index} tipo = {item.tipo} value={item.value}></Apoio>
                })}
                
            </svg>
        </>
    )
}

export default DiagramaCortante



