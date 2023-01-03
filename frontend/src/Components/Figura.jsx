import React from "react";
import Apoio from "./SVG/Apoios";

const Figura = (props) =>{

    console.log(props.apoios)

    return (
        <div>
            <svg width="400px" height="945px" viewBox="0 0 400 945">
                {Object.keys(props.apoios).map((item,index)=>{
                    return <Apoio key= {index} {...props.apoios[item]}></Apoio>
                })}
            </svg>
        </div>
    )
}

export default Figura