import React from "react";

const Engastado = (props) =>{

    if(props.value==0){
        return(
                <g className="apoios">
                    <rect x="47.0" y="135.0" width="3" height="30.0"></rect>
                    <line x1="47.0" y1="135.0" x2="41.0" y2="140.0"></line>
                    <line x1="47.0" y1="139.28571428571428" x2="41.0" y2="144.28571428571428"></line>
                    <line x1="47.0" y1="143.57142857142858" x2="41.0" y2="148.57142857142858"></line>
                    <line x1="47.0" y1="147.85714285714286" x2="41.0" y2="152.85714285714286"></line>
                    <line x1="47.0" y1="152.14285714285714" x2="41.0" y2="157.14285714285714"></line>
                    <line x1="47.0" y1="156.42857142857142" x2="41.0" y2="161.42857142857142"></line>
                    <line x1="47.0" y1="160.71428571428572" x2="41.0" y2="165.71428571428572"></line>
                    <line x1="47.0" y1="165.0" x2="41.0" y2="170.0"></line>
                    <title>Apoio engastado</title>
                </g>
        )
    }
    else{
        return(
            <g className="apoios">
                <rect x={`${50+props.value}`} y="135.0" width="3" height="30.0"></rect>
                <line x1={`${53+props.value}`} y1="135.0" x2={`${59+props.value}`} y2="140.0"></line>
                <line x1={`${53+props.value}`} y1="139.28571428571428" x2={`${59+props.value}`} y2="144.28571428571428"></line>
                <line x1={`${53+props.value}`} y1="143.57142857142858" x2={`${59+props.value}`} y2="148.57142857142858"></line>
                <line x1={`${53+props.value}`} y1="147.85714285714286" x2={`${59+props.value}`} y2="152.85714285714286"></line>
                <line x1={`${53+props.value}`} y1="152.14285714285714" x2={`${59+props.value}`} y2="157.14285714285714"></line>
                <line x1={`${53+props.value}`} y1="156.42857142857142" x2={`${59+props.value}`} y2="161.42857142857142"></line>
                <line x1={`${53+props.value}`} y1="160.71428571428572" x2={`${59+props.value}`} y2="165.71428571428572"></line>
                <line x1={`${53+props.value}`} y1="165.0" x2={`${59+props.value}`} y2="170.0"></line>
                <title>Apoio engastado</title>
            </g>
        )
    }




    
}

export default Engastado