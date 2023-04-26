
import React from "react";
//Componentes
import Viga from "../SVG/Viga";
import Apoio from "../SVG/Apoios";
//Constante
import PadraoParaDesenho from "../../Constants/PadraoParaDesenho";

const DiagramaMomento= (props) =>{

    //variaveis
    const inicio = [0]
    const points = ['0,0 0,0']
    let escala = 1
    let temp = ""
    let points_temp = []

    const tamanhosvg = 240 // 15rem


    //definindo escala
    


    //controla o texto 
    const texto = []
    if (Object.keys(props.metrigidez).length !==0){ 

        Object.keys(props.metrigidez["Esforcos Internos"]).forEach((chave,indice)=>{
            const Momento = props.metrigidez["Esforcos Internos"][chave]["Momento"]
            Momento.forEach((valor,indice)=>{
                if (valor>= tamanhosvg-80){
                    escala = 0.70 - valor/1000
                    console.log(escala)
                }
            })
        })
        

        Object.keys(props.metrigidez["Esforcos Internos"]).forEach((chave,indice)=>{ //roda os EL
            const Cortante = props.metrigidez["Esforcos Internos"][chave]["Momento"]
            const trecho  = props.metrigidez["Esforcos Internos"][chave]["Trecho"]
            for (let i=0;i<=trecho.length-1;i++){
                points_temp.push(`${trecho[i]+50},${147.5-Cortante[i]*escala}`
                    )
                inicio.push(trecho[i+1])
                //definicao do vetor de texto [x,y,valor do momento, escala]
                if (Cortante[i]<0){
                    texto.push([trecho[i]+50,147.5-Cortante[i]*escala,Cortante[i],-1.2])
                }
                else{
                    texto.push([trecho[i]+50,147.5-Cortante[i]*escala,Cortante[i],0.6])
                }
                
                if(Object.keys(props.metrigidez["Esforcos Internos"]).length===texto.length){
                    if (Cortante[i+1]>0){
                        texto.push([trecho[i+1]+50,147.5+Cortante[i+1]*escala,Cortante[i+1],-1.2])
                    }
                    else{
                        texto.push([trecho[i+1]+50,147.5+Cortante[i+1]*escala,Cortante[i+1],0.6])
                    }
                }
            }
            points_temp.push(`${trecho[trecho.length-1]+50},147.5 ${trecho[0]+50},147.5`)
            points_temp.forEach((valor,indice)=>{
                temp = temp +valor +" "
            })
            points.push(temp)
            temp = ''
            points_temp = []
        })
    }

    return(
        <>
            <svg style={{ width:"40rem",height:"15rem"}}>
                <g>
                </g>
                {texto.map((valor,key)=>{
                        return <text key={key} x={valor[0]} y={valor[1]-valor[3]*15}>{`${valor[2]} kN`}</text>
                    })}
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