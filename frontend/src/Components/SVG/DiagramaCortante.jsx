import React from "react";
//Componentes
import Viga from "../SVG/Viga";
import Apoio from "../SVG/Apoios";
//Constante
import PadraoParaDesenho from "../../Constants/PadraoParaDesenho";

const DiagramaCortante = (props) =>{

    let graficomomento = []
    const points =[]
    let temp = ''
    let maximo = [0,0] //maximo[0] = valor de momento , maximo[1] = posicao
    let texto = []


    try{
        //rodando cada elemento
        for(let chave of Object.keys(props.metrigidez['Esforcos Internos'])){
            //rodando momento e posicao simultaneamente
            for(let i=0;i<=props.metrigidez['Esforcos Internos'][chave]['Cortante'].length-1 ;i++){
                const momento = props.metrigidez["Esforcos Internos"][chave]["Cortante"]
                const trecho  = props.metrigidez["Esforcos Internos"][chave]["Trecho"]

                //garantindo o primeiro ponto na altura da viga, para poder ter um solido
                if (i===0){
                    graficomomento.push(`${trecho[0]+50},147.5`)
                }

                graficomomento.push(`${trecho[i]+50},${147.5-momento[i]*props.escala}`)

                //garantirndo o ultimo ponto na altura da viga, para pode ter um solido
                if (i===props.metrigidez['Esforcos Internos'][chave]['Cortante'].length-1){
                    graficomomento.push(`${trecho[i]+50},${147.5}`)

                }

                //momento maximo
                if (Math.abs(maximo[0])<Math.abs(momento[i])){
                    maximo[0] = momento[i]
                    maximo[1] = trecho[i]
                }

            }
            //depois que rodei todo um elemento eu preciso tranformar tudo em um unico string do elemento inteiro
            for(let parte of graficomomento){
                temp = temp + parte+ ' '
            }
            points.push(temp)


            // as logica vai ser sempre tagear o ponto de tras
            
            //adicionando o ponto mais a esquerda
            texto.push([props.metrigidez["Esforcos Internos"][chave]["Cortante"][0],props.metrigidez["Esforcos Internos"][chave]["Trecho"][0]])

            //Verificando a necessidade de adicionar um ponto de maximo (se não foi igual ao ponto mais a esquerda)
            if (maximo[1] === props.metrigidez["Esforcos Internos"][chave]["Trecho"][0]){

            }
            else{
                texto.push(maximo)
            }

            //verificando se o elemento é o ultimo e se nao é igual ao momento maximo na secao 
            if (chave === Object.keys(props.metrigidez['Esforcos Internos'])[[Object.keys(props.metrigidez['Esforcos Internos']).length-1]] && maximo[1]!==props.metrigidez["Esforcos Internos"][chave]["Trecho"][props.metrigidez['Esforcos Internos'][chave]['Momento'].length-1]){
                //Ultimo elemento
                texto.push([props.metrigidez["Esforcos Internos"][chave]["Momento"][props.metrigidez['Esforcos Internos'][chave]['Momento'].length-1],props.metrigidez["Esforcos Internos"][chave]["Trecho"][props.metrigidez['Esforcos Internos'][chave]['Momento'].length-1]])
            }

            //limpando os iteradores
            temp =''
            graficomomento = []
            maximo = [0,0]

        }
    }

    catch(erro){
        console.log(erro)

    }


    return(
        <>
            <svg style={{ width:"40rem",height:(props.metrigidez['Maximo'][1]<0)? "24rem":"12rem"}}>
                {texto.map((valor,key)=>{
                    if(valor[0]==0){
                        return 1
                    }
                    else{
                        return (valor[0]<0) ?<text x={valor[1]+50} y={147.5+20-valor[0]*props.escala}>{`${valor[0]} kN.m`}</text>:<text x={valor[1]+50} y={147.5-valor[0]*props.escala-15}>{`${valor[0]} kN.m`}</text>
                    }
                    })}
                {points.map((item,indice)=>{  
                    return <polygon points={item} key={indice} className="graficocorte"></polygon>
                })}
                <Viga value={props.barra} ignorar={true} apoios={[]}></Viga>
                {props.apoios.map((item,index)=>{
                    return <Apoio key= {index} tipo = {item.tipo} value={item.value}></Apoio>
                })}
            </svg>
        </>
    )
}
export default DiagramaCortante



