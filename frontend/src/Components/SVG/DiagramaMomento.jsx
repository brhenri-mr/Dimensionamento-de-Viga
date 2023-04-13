import React from "react";
//Componentes
import Viga from "../SVG/Viga";
import Apoio from "../SVG/Apoios";
//Constante
import PadraoParaDesenho from "../../Constants/PadraoParaDesenho";

const DiagramaMomento= (props) =>{
    const inicio = [0]
    const points = ['0,0 0,0']
    const points_temp = []
    let temp = ""
    //controla o texto 
    const texto = []
    if (Object.keys(props.metrigidez).length !==0){ 
        Object.keys(props.metrigidez["Esforcos Internos"]).forEach((chave,indice)=>{ //roda os EL
            const Cortante = props.metrigidez["Esforcos Internos"][chave]["Momento"]
            const trecho  = props.metrigidez["Esforcos Internos"][chave]["Trecho"]
            for (let i=0;i<=trecho.length-1;i++){
                points_temp.push(`${trecho[i]+50},${147.5+Cortante[i]}`
                    )
                inicio.push(trecho[i+1])
                if (Cortante[i]<0){
                    texto.push([trecho[i]+50,147.5-Cortante[i],Cortante[i],-1.2])
                }
                else{
                    texto.push([trecho[i]+50,147.5-Cortante[i],Cortante[i],0.6])
                }
                
                if(Object.keys(props.metrigidez["Esforcos Internos"]).length===texto.length){
                    if (Cortante[i+1]>0){
                        texto.push([trecho[i+1]+50,147.5+Cortante[i+1],Cortante[i+1],-1.2])
                    }
                    else{
                        texto.push([trecho[i+1]+50,147.5+Cortante[i+1],Cortante[i+1],0.6])
                    }
                }
            }
            points_temp.push('50,147.5')
            points_temp.forEach((valor,indice)=>{
                temp = temp +valor +" "
            })
            points.push(temp)
            console.log(temp)
        })
    }

    return(
        <>
            <svg {...PadraoParaDesenho}>
                <g>
                </g>
                {points.map((item,indice)=>{ 
                    return <polygon points={item} key={indice} className="graficomomento"></polygon>
                })}
                <Viga value={props.barra}></Viga>
                {props.apoios.map((item,index)=>{
                    return <Apoio key= {index} tipo = {item.tipo} value={item.value}></Apoio>
                })}
                
            </svg>
        </>
    )
}

export default DiagramaMomento