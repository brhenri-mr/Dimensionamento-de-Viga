import React from "react";

const Viga = (props) => {

    let auxiliar = []
    let temp = []
    let comprimentos = []


    for(let i=0;i<=props.apoios.length-1;i++){
        temp.push(props.apoios[i].value)
    }


    const tempsorted = temp.toSorted((a, b) => a - b);

      //organizando comprimentos
      for (let i of tempsorted){
        for (let j of props.apoios){
            if (i ===j.value){
                auxiliar.push(j)
                break
            }
        }
    }

    //so funciona pq apoios é uma lista 
    for(let i=0;i<=auxiliar.length-2;i++){
        comprimentos.push([Math.abs(auxiliar[i+1].value-auxiliar[i].value),auxiliar[i].value])
        if (i ===auxiliar.length-2 &&(props.value-auxiliar[i+1].value)>0){
            comprimentos.push([props.value-auxiliar[i+1].value,auxiliar[i+1].value])
        }
    }

    if (props.value===''){
        return(<></>)
    }
    else{
        if (props.ignorar){
            return (
                <g>
                    <rect x="50" y="147.5" rx="2" ry="2" width={props.value} height="4" className="viga">
                        <title>Viga</title>
                    </rect>
                </g>
                )
        }else{
            if(props.apoios.length>1){
                return (
                    <g>
                        <rect x="50" y="147.5" rx="2" ry="2" width={props.value} height="4" className="viga">
                            <title>Viga</title>
                        </rect>
                        {comprimentos.map((item,key)=>{
                            return (<>
                            <rect x={item[1]+50} y={200-parseFloat(props.mag)/2} rx="2" ry="2" width={item[0]} height="1"></rect>
                            
                            <text x={item[0]/2+30+item[1]} y={240-parseFloat(props.mag)/2}>{`${item[0]} cm`}</text>

                            <rect x={item[1]+50} y={188.5-parseFloat(props.mag)/2} rx="2" ry="2" width={1} height="25"></rect>
                            <rect x={item[1]+item[0]+50} y={188.5-parseFloat(props.mag)/2} rx="2" ry="2" width={1} height="25"></rect>
                            </>
                            )
                        })}
                    </g>
                    )
            }
            else{
                return (
                    <g>
                        <rect x="50" y="147.5" rx="2" ry="2" width={props.value} height="4" className="viga">
                            <title>Viga</title>
                        </rect>
                        <rect x="50" y={200-parseFloat(props.mag)/2} rx="2" ry="2" width={props.value} height="1"></rect>
                        <text x={parseFloat(props.value)/2+30} y={240-parseFloat(props.mag)/2}>{`${props.value} cm`}</text>
                        <rect x="50" y={188.5-parseFloat(props.mag)/2} rx="2" ry="2" width={1} height="25"></rect>
                        <rect x={parseFloat(props.value)+50} y={188.5-parseFloat(props.mag)/2} rx="2" ry="2" width={1} height="25"></rect>
                    </g>
                    )
            }
        }
       
    }
   
}

export default Viga
