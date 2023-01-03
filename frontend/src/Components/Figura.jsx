import React from "react";
// componentes
import Apoio from "./SVG/Apoios";
import Viga from "./SVG/Viga";

const Figura = (props) =>{

    return (
        <div>
            <svg width="400px" height="945px" viewBox="0 0 400 945">
                <Viga value={300}></Viga>
                {props.apoios.map((item,index)=>{
                    return <Apoio key= {index} tipo = {item.tipo} value={item.value}></Apoio>
                })}
            </svg>
        </div>
    )
}

export default Figura