import React from "react";



const Barras = (props) =>{
    // barras por camada = lista 
    // av = distancia 
    // ah = distancia horizontal 

    const incremento =[]
    const raio = props.bitola*props.escala
    const patternSize = Math.ceil(Math.sqrt(2) * raio * 2); // Calcula o tamanho do padrão

    let incremento_real = []

    for(let i = 0; i<props.espacos; i++ ){
        incremento.push(i)
    }



    for(let i = 0; i<props.barras/2; i++ ){
        incremento_real.push(incremento[i])
        incremento_real.push(incremento.slice(-i-1)[0])

    }
    
    console.log(incremento_real)

    return (
    
        <>
        <pattern id="hachura" patternUnits="userSpaceOnUse" width={patternSize/9} height={patternSize/9} patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2={patternSize/2} style={{ stroke: 'black', strokeWidth: 1.2 }} />
        </pattern>
        {incremento_real.map((item,chave)=>{
            return <circle key={chave}cx={(raio+props.cnom+props.bitolaT)+(props.x+raio)*item} cy={props.y} r={raio} style={{ fill: 'url(#hachura)', stroke:'black' }}></circle>
        })}
        </>
    )
   
}



export default Barras