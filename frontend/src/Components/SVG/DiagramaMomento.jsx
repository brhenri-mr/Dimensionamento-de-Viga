import React from "react";
//Componentes
import Viga from "../SVG/Viga";
import Apoio from "../SVG/Apoios";
//Constante




const DiagramaMomento= (props) =>{

    let graficomomento = []
    const points =[]
    let temp = ''
    let maximo = [0,0] //maximo[0] = valor de momento , maximo[1] = posicao
    let texto = []
    const escalajanela = props.momento
    let primeiro = true



    try{
        //rodando cada elemento
        for(let chave of Object.keys(props.metrigidez['Esforcos Internos'])){
            //rodando momento e posicao simultaneamente
            for(let i=0;i<=props.metrigidez['Esforcos Internos'][chave]['Momento'].length-1 ;i++){
                const momento = props.metrigidez["Esforcos Internos"][chave]["Momento"]
                const trecho  = props.metrigidez["Esforcos Internos"][chave]["Trecho"]

                //garantindo o primeiro ponto na altura da viga, para poder ter um solido
                if (i===0){
                    graficomomento.push(`${trecho[0]*props.escalabarra+50},147.5`)
                }

                graficomomento.push(`${trecho[i]*props.escalabarra+50},${147.5-momento[i]*props.escala}`)

                //garantirndo o ultimo ponto na altura da viga, para pode ter um solido
                if (i===props.metrigidez['Esforcos Internos'][chave]['Momento'].length-1){
                    graficomomento.push(`${trecho[i]*props.escalabarra+50},${147.5}`)

                }


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
            if( primeiro){
                texto.push([props.metrigidez["Esforcos Internos"][chave]["Momento"][0],props.metrigidez["Esforcos Internos"][chave]["Trecho"][0]],'normal')
                primeiro = false
            }
           


            //Verificando a necessidade de adicionar um ponto de maximo (se não foi igual ao ponto mais a esquerda)
            if (maximo[1] !== props.metrigidez["Esforcos Internos"][chave]["Trecho"][0]){
                maximo.push('max')
                texto.push(maximo)
            }   


            //verificando se o elemento é o ultimo e se nao é igual ao momento maximo na secao 
            if (chave === Object.keys(props.metrigidez['Esforcos Internos'])[[Object.keys(props.metrigidez['Esforcos Internos']).length-1]] && maximo[1]!==props.metrigidez["Esforcos Internos"][chave]["Trecho"][props.metrigidez['Esforcos Internos'][chave]['Momento'].length-1]){
                //Ultimo elemento
                texto.push([props.metrigidez["Esforcos Internos"][chave]["Momento"][props.metrigidez['Esforcos Internos'][chave]['Momento'].length-1],props.metrigidez["Esforcos Internos"][chave]["Trecho"][props.metrigidez['Esforcos Internos'][chave]['Momento'].length-1]],'normal')
                
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
            <svg style={{ width:"40rem",height:(escalajanela<0)? "18rem":"15rem"}}>
               
                {points.map((item,indice)=>{  
                    return <polygon points={item} key={indice} className="graficomomento"></polygon>
                })}
                <Viga value={props.barra*props.escalabarra} ignorar={true} apoios={[]}></Viga>
                {props.apoios.map((item,index)=>{
                    return <Apoio key= {index} tipo = {item.tipo} value={item.value*props.escalabarra}></Apoio>
                })}
                <circle cx={parseFloat(props.barra)*props.escalabarra+135} cy="147.5" r="20" stroke="black" strokeWidth="3" className="graficomomento" />
                <text x={parseFloat(props.barra)*props.escalabarra+128} y='152'>M</text>
                 {texto.map((valor,key)=>{
                    if(valor[0]===0){
                        return 1
                    }
                    else{
                        if(valor[2]==='max'){
                            return (valor[0]<0) ?(<text fontSize='13' key={key} x={valor[1]*props.escalabarra+25} y={147.5-15-valor[0]*props.escala}>{`${(-valor[0]).toString().replace('.',',')} kN.m`}</text>):<text fontSize='13' key={key} x={valor[1]*props.escalabarra+25} y={147.5-valor[0]*props.escala-15}>{`${(-valor[0]).toString().replace('.',',')} kN.m`}</text>
                        }
                        else{
                            return (valor[0]<0) ?<text fontSize='13' key={key} x={valor[1]*props.escalabarra+25} y={147.5+10-valor[0]*props.escala}>{`${(-valor[0]).toString().replace('.',',')} kN.m`}</text>:<text fontSize='13' key={key} x={valor[1]*props.escalabarra+25} y={147.5-valor[0]*props.escala-15}>{`${(-valor[0]).toString().replace('.',',')} kN.m`}</text>
                        }
        
                    }
                    })}
                    {texto.map((valor,key)=>{
 
                    if(valor[2]==='max'){
                            return 1
                    }
    
                    })}
            </svg>
        </>
    )
}

export default DiagramaMomento