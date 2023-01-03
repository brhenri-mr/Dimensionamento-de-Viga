import React from "react";

const ApoioSimples = (props) =>
{
    return(
                <g className="apoios">
                    <polygon points={`${50.0 +props.value},${150} ${60+props.value},${165} ${40 +props.value}, ${165}`}></polygon>
                    <line x1={`${36.0 + props.value}`} y1={`${165.0 }`} x2={`${64.0+ props.value}`}  y2={`${165.0}`}></line>
                    <line x1={`${36.0 + props.value}`} y1={`${170.0 }`} x2={`${64.0+ props.value}`}  y2={`${170.0}`}></line>
                    <title>Apoio simples</title>
                </g>
    )
}

export default ApoioSimples