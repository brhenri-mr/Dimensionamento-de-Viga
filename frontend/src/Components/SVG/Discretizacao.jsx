import React from "react";
import Barras from "./Armadura";




const Discretizacao = (props)=>{

    const escala = 350/props.h
    const posicoesY = []
    const incrementoX =  ((props.bw - 2*props.cnom - 2*props.bitolaT -props.barras[0][0]*props.bitola)/(props.barras[0][0]-1))*escala
    let totalbarras = 0
    let ytexto = 0


    //Calculo posicao em y das armaduras
    // Sempre utilizarei como incremento em x o valor para a mais secao cheia, no caso, sempre a primeira


    if(props.momento<0){
        ytexto = (props.bitolaT+props.cnom)*escala+10
        for(let camada of [...Array(props.barras[0].length).keys()]){
            posicoesY.push([
                2.5+(props.bitolaT+props.cnom+props.bitola/2+(props.av*camada+props.bitola*camada))*escala,
                props.barras[0][camada]
            ],
                )
        }
    }
    else{

        ytexto = (props.h-props.bitolaT-props.cnom)*escala+5
        for(let camada of [...Array(props.barras[0].length).keys()]){
            posicoesY.push([
                2.5+(props.h-props.bitolaT-props.cnom-props.bitola/2-props.av*camada-props.bitola*camada)*escala,
                props.barras[0][camada]
            ],
                )
    
    
        }
    }
    
   for(let barras of props.barras[0]){
    totalbarras = totalbarras + barras
   }


    return(
        <>
         <rect 
         x={2.5} 
         y={2.5} 
         width={props.bw*escala} 
         height={props.h*escala} 
         style={{fill:'#D9D9D9',strokeWidth:0.8,stroke:'rgb(0,0,0)'}}></rect>

        
        <rect 
        x={2.5+props.cnom*escala+props.bitolaT*escala/2} 
        y={2.5+props.cnom*escala+props.bitolaT*escala/2}
        width={props.bw*escala-props.cnom*2*escala-props.bitolaT*escala} 
        height={props.h*escala-props.cnom*2*escala-props.bitolaT*escala}
        rx={`${props.bitola}px`}
        ry={`${props.bitola}px`}
        style={{fill:'none',strokeWidth:`${props.bitolaT*escala}`,stroke:'rgb(0,0,0)'}}>

         </rect>


        {posicoesY.map((item,chave)=>{
            return <Barras  
                escala ={escala}
                key={chave} 
                barras={item[1]} 
                espacos = {props.barras[0][0]}
                ah={props.ah*escala} 
                y={item[0]} 
                limite={props.limite} 
                cnom={props.cnom*escala} 
                bitolaT={props.bitolaT*escala} 
                bitola={props.bitola} 
                x={incrementoX}
            ></Barras>
        })}

        <line x1={(props.bw-props.cnom)*escala} x2={200} y1={ytexto-5} y2={ytexto-5}  style={{stroke:'black',strokeDasharray:2}}></line>
        {<text x={200+5}  y={ytexto} fontSize={15}>{`${totalbarras} Ø ${props.bitola*10} mm`}</text>}
        </>
    )
}


export default Discretizacao