import React from "react";
import Barras from "./Armadura";




const Discretizacao = (props)=>{

    const escala = 1
    const posicoesY = []
    const incrementoX =  ((props.bw - 2*props.cnom - 2*props.bitolaT -props.limite*props.bitola)/(props.limite-1))*escala


    //Calculo posicao em y das armaduras
    // Sempre utilizarei como incremento em x o valor para uma secao cheia


    for(let camada of [...Array(props.barras[0].length).keys()]){
        posicoesY.push([(
            props.h-props.bitolaT-props.cnom-props.bitola/2-props.av*camada-props.bitola*camada)*escala,
            props.barras[0][camada]
        ],
            )


    }



    return(
        <>
         <rect x={2.5} y={2.5} width={props.bw*escala} height={props.h*escala} style={{fill:'#D9D9D9',strokeWidth:0.8,stroke:'rgb(0,0,0)',}}></rect>

        
        <rect x={2.5+props.cnom*escala} y={2.5+props.cnom*escala} width={props.bw*escala-props.cnom*2*escala} height={props.h*escala-props.cnom*2*escala} style={{fill:'none',strokeWidth:`${props.bitolaT*escala}`,stroke:'rgb(0,0,0)',}}></rect>


        {posicoesY.map((item,chave)=>{
            return <Barras  
                escala ={escala}
                key={chave} 
                barras={item[1]} 
                ah={props.ah*escala} 
                y={item[0]} 
                limite={props.limite} 
                cnom={props.cnom*escala} 
                bitolaT={props.bitolaT*escala} 
                bitola={props.bitola} 
                x={incrementoX}
            ></Barras>
        })}
        </>
    )
}


export default Discretizacao