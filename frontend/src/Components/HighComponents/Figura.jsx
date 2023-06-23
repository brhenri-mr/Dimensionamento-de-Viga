import React, { useState } from "react";
// componentes
import Apoio from "../SVG/Apoios";
import CarregamentoPontual from "../SVG/CarregamentoPontual";
import CarregamentoDist from "../SVG/CarregamentosDist";
import Viga from "../SVG/Viga";
//Constante
import PadraoParaDesenho from "../../Constants/PadraoParaDesenho";
import Eixos from "../SVG/Eixos";
import { FormControl } from "@mui/material";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { Box } from "@mui/system"



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
        else{//pontual
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

function carregamentospossiveis_label(carregamentos,ed){

    let saida = []
    let indices = []
    let temp = []
    let i = 0

    for (let item of carregamentos){
        if (item['patter']==="Carregamento permanente"){
            if (saida.includes(item['describe'])){

            }
            else{
                saida.push(`${item['describe']}`)
            }

            
        }
        else{
            if (saida.includes(`${item['describe']} - ${ed[i]['informacao']}`)){

            }
            else{
                saida.push(`${item['describe']} - ${ed[i]['informacao']}`)
            }   

        }

        i = i+1
    }
    i = 0
    for(let tipo of saida){
        for (let item of carregamentos){
               if(tipo === `${item['describe']}`|| tipo ===`${item['describe']} - ${ed[i]['informacao']}`){
                   temp.push(i)
               }
               i = 1+i
        }
        indices.push(temp)
        temp =[]
        i = 0
    }



    return [saida,indices]
}


function carregamentofiltrado(indices,carregamentos){

    let saida = []
    for(let item of indices){
        saida.push(carregamentos[item])
    }

    return saida

}

const Figura = (props) =>{

    let magmax = 0
    const [label,setLabel] = useState('')


    let carregamentospossiveis = (props.carregamentos.length ===0)?[[''],['']]:carregamentospossiveis_label(props.carregamentos,props.ed)

    let caso = 0
    let i = 0

    if(props.carregamentos.length !==0){
    //Procurando o caso a ser procurado
        for(let item of carregamentospossiveis[0]){
            if (item ===label){
                caso = i
                break
            }
            i = 1+ i
        }
    }


    let CarregamentoFiltrado = (props.carregamentos.length ===0)?props.carregamentos:carregamentofiltrado(carregamentospossiveis[1][caso],props.carregamentos)
    


    const CarregamentoParaDesenho = carregamentodistribuidounico(CarregamentoFiltrado)
    let escalabarra = (500/props.barra>1)? 1:500/props.barra


    for(let item of CarregamentoFiltrado){
        if (Math.abs(magmax)<=Math.abs(item['mag'])){
            magmax = item['mag']
        }
    }

    let escala = (Math.abs(100/magmax)>1)? 1:Math.abs(100/magmax)


    
    if (Math.abs(magmax)<=20){
        escala = 2.5
    }

    if (props.ignorar){
        return (
            <div>
                <svg {...PadraoParaDesenho}>
                    <Viga value={props.barra*escalabarra} mag={magmax*escala-50} apoios={props.apoios} escala={escalabarra}></Viga>
                    {props.apoios.map((item,index)=>{
                        return <Apoio key= {index} tipo = {item.tipo} value={item.value*escalabarra} escala={escalabarra}></Apoio>
                    })}
                
                </svg>
            </div>
        )
    }
    else{
        return (
            <div>
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                    <FormControl>
                        <InputLabel>Descrição do carregamento</InputLabel>
                        <Select 
                        value={label} 
                        onChange={(event) =>{event.preventDefault();return setLabel(event.target.value)}} 
                        label="Descrição do carregamento"  
                        variant="outlined"  
                        sx={{backgroundColor:'white'}}>
                        {carregamentospossiveis[0].map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                        </Select> 
                    </FormControl>
                </Box>
                <br></br>
                <svg {...PadraoParaDesenho}>
                    <Eixos></Eixos>
                    <Viga value={props.barra*escalabarra} mag={magmax*escala-50} apoios={props.apoios} escala={escalabarra}></Viga>
                    {props.apoios.map((item,index)=>{
                        return <Apoio key= {index} tipo = {item.tipo} value={item.value*escalabarra} escala={escalabarra}></Apoio>
                    })}
                    {CarregamentoParaDesenho.map((item,index) =>{
            
                        if(item['tipo']==='Distribuido'){
    
                            return <CarregamentoDist key={index} comprimento={(item['pos'][1]-item['pos'][0])*escalabarra} mag={item['mag']} start={(item['pos'][0]*escalabarra)+50} escala={escala} ></CarregamentoDist>
                        }
                    })}
                    {CarregamentoParaDesenho.map((item,index) =>{
                        if(item['tipo'] ==='Pontual'){
                            return <CarregamentoPontual key={index} mag={item['mag']} start={item['pos'][0]*escalabarra+50} escala={escala}></CarregamentoPontual>
                        }
                    })}
                    
                </svg>
            </div>
        )
    }
    
}

export default Figura