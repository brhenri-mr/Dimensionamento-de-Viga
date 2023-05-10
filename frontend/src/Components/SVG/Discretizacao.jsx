import React from "react";




const Discretizacao = (props)=>{


    const escala = props.bw/props.h

    return(
        <>
         <rect  width={(props.h>115)? props.h*escala:props.bw} height={(props.h>115)?115:props.h} style={{fill:'#D9D9D9',strokeWidth:1.2,stroke:'rgb(0,0,0)',}}></rect>
         <rect x={2.5} y={2.5} width={35} height={95} style={{fill:'#D9D9D9',strokeWidth:0.8,stroke:'rgb(0,0,0)',}}></rect>

        </>
    )
}


export default Discretizacao