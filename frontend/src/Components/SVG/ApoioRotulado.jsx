import React from "react";

const ApoioRotulado = (props) =>
{
    "50.0,150 60.0,165 40.0,165"
    return(
                <g className="apoios">
                    <polygon points={`${50.0 +props.value},${150} ${60+props.value},${165} ${40 +props.value}, ${165}`}></polygon>
                    <line x1={`${36.0 + props.value}`} y1={`${165.0 }`} x2={`${64.0+ props.value}`}  y2={`${165.0}`}></line>
                    <line x1={`${36.0 + props.value}`} y1={`${165.0 }`} x2={`${30.0 + props.value}`} y2={`${170.0 }`}></line>
                    <line x1={`${41.6 + props.value}`} y1={`${165.0 }`} x2={`${35.6 + props.value}`} y2={`${170.0 }`}></line>
                    <line x1={`${47.2 + props.value}`} y1={`${165.0 }`} x2={`${41.2 + props.value}`} y2={`${170.0}`}></line>
                    <line x1={`${52.8 + props.value}`} y1={`${165.0 }`} x2={`${46.8 + props.value}`} y2={`${170.0 }`}></line>
                    <line x1={`${58.4 + props.value}`} y1={`${165.0 }`} x2={`${52.4 + props.value}`} y2={`${170.0 }`}></line>
                    <line x1={`${64.0 + props.value}`} y1={`${165.0 }`} x2={`${58.0 + props.value}`} y2={`${170.0 }`}></line>
                </g>
    )
}

export default ApoioRotulado