import React from "react";
// componentes
import Apoio from "../SVG/Apoios";
import CarregamentoPontual from "../SVG/CarregamentoPontual";
import CarregamentoDist from "../SVG/CarregamentosDist";
import Viga from "../SVG/Viga";
//Constante
import PadraoParaDesenho from "../../Constants/PadraoParaDesenho";



function carregamentodistribuidounico(carregamentos){
    //carregamentos: objeto contendo os carregamentos
    let saida = []
    const carregamentoFiltrado = []
    const pontuais = []
    const elementos = []
    const posicoes = []
    let tempMag = 0

    //filtrando por objjetos de tipo distruibuido
    for(let chave of Object.keys(carregamentos)){
        if (carregamentos[chave]['tipo'] === "Distribuido"){
            carregamentoFiltrado.push(carregamentos[chave])
            elementos.push(carregamentos[chave]['pos'][0])
            elementos.push(carregamentos[chave]['pos'][1])  
        }
        else{
            pontuais.push(carregamentos[chave])
            elementos.push(carregamentos[chave]['pos'][0])
            
        }
    }
  
    //posicoes sem ser repedido
    let elementosfiltrados = elementos.filter(function(este, i) {
    return elementos.indexOf(este) === i;});
    //Organizando a lista
    elementosfiltrados.sort(function(a, b){return a-b})

    
    for(let i =0;i<=(elementosfiltrados.length-2);i++){
        posicoes.push([elementosfiltrados[i],elementosfiltrados[i+1]])
    }


    for(let trecho of posicoes){
        for(let valores of carregamentoFiltrado){
            
            if(valores['pos'][0]<=trecho[0] && valores['pos'][1]>=trecho[1]){
                tempMag = tempMag + valores['mag']
            }
        }
        if (tempMag!==0){
            saida.push({'tipo':'Distribuido','mag':tempMag,'pos':trecho})
            tempMag = 0
        }
        
    }


    for(let ponto of pontuais){
        saida.push(ponto)
    }


    return saida
}



const Figura = (props) =>{

    let magmax = 0

    const CarregamentoParaDesenho = carregamentodistribuidounico(props.carregamentos)



    for(let item of props.carregamentos){
        if (Math.abs(magmax)<=Math.abs(item['mag'])){
            magmax = item['mag']
        }
    }

    let escala = (Math.abs(100/magmax)>1)? 1:Math.abs(100/magmax)


    
    if (Math.abs(magmax)<=20){
        escala = 2.5
    }


    return (
        <div>
            <svg {...PadraoParaDesenho}>
                <Viga value={props.barra} mag={magmax*escala-50} apoios={props.apoios}></Viga>
                {props.apoios.map((item,index)=>{
                    return <Apoio key= {index} tipo = {item.tipo} value={item.value}></Apoio>
                })}
                {CarregamentoParaDesenho.map((item,index) =>{
        
                    if(item['tipo']==='Distribuido'){

                        return <CarregamentoDist key={index} comprimento={item['pos'][1]-item['pos'][0]} mag={item['mag']} start={item['pos'][0]+50} escala={escala}></CarregamentoDist>
                    }
                })}
                {CarregamentoParaDesenho.map((item,index) =>{
                    if(item['tipo'] ==='Pontual'){
                        return <CarregamentoPontual key={index} mag={item['mag']} start={item['pos'][0]+50} escala={escala}></CarregamentoPontual>
                    }
                })}
            </svg>
        </div>
    )
}

export default Figura