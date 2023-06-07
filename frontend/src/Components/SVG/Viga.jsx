import React from "react";

const Viga = (props) => {

    let auxiliar = []
    let temp = []
    let comprimentos = []
    let comprimentomax = 0
    let zero = true
    let comprimentominimo= 100000000
    



    for(let i=0;i<=props.apoios.length-1;i++){
        temp.push(props.apoios[i].value)
    }


    const tempsorted = temp.toSorted((a, b) => a - b);

      //organizando comprimentos
      for (let i of tempsorted){
        for (let j of props.apoios){
            if (i ===j.value){
                auxiliar.push(j)

                if(j.value>comprimentomax){
                    comprimentomax = j.value
                }

                if(comprimentominimo>j.value){
                    comprimentominimo = j.value
                    
                }


                if(j.value===0){
                    zero = false
                }


                break
            }
        }
    }

    console.log(comprimentominimo)

    if(zero){
        comprimentos.push([comprimentominimo,0])
   }


    //so funciona pq apoios é uma lista 
    for(let i=0;i<=auxiliar.length-2;i++){
        comprimentos.push([Math.abs(auxiliar[i+1].value-auxiliar[i].value),auxiliar[i].value])
        if (i ===auxiliar.length-2 &&(props.value/props.escala-auxiliar[i+1].value)>0){
            comprimentos.push([props.value/props.escala-auxiliar[i+1].value,auxiliar[i+1].value])
        }
    }

    console.log(comprimentos)

    //adicionando o balanco
    ///if(Math.abs(props.value/props.escala-comprimentomax)>0){
        //comprimentos.push([comprimentomax,props.value/props.escala])
    //}

     
   

    console.log(comprimentos)


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
                            <rect x={(item[1]*props.escala+50)} y={200-parseFloat(props.mag)/2} rx="2" ry="2" width={(item[0])*props.escala} height="1"></rect>
                            <text x={(item[0]*props.escala/2+30+item[1]*props.escala)} y={240-parseFloat(props.mag)/2}>{`${item[0]} cm`}</text>
                            <rect x={(item[1]*props.escala+50)} y={188.5-parseFloat(props.mag)/2} rx="2" ry="2" width={1} height="25"></rect>
                            <rect x={(item[1]*props.escala+item[0]*props.escala+50)} y={188.5-parseFloat(props.mag)/2} rx="2" ry="2" width={1} height="25"></rect>
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
                        <rect x="50" y={200-parseFloat(props.mag)/2} rx="2" ry="2" width={(props.value)} height="1"></rect>
                        <text x={parseFloat(props.value)/2+30} y={240-parseFloat(props.mag)/2}>{`${props.value/props.escala} cm`}</text>
                        <rect x="50" y={188.5-parseFloat(props.mag)/2} rx="2" ry="2" width={1} height="25"></rect>
                        <rect x={(parseFloat(props.value)+50)} y={188.5-parseFloat(props.mag)/2} rx="2" ry="2" width={1} height="25"></rect>
                    </g>
                    )
            }
        }
       
    }
   
}

export default Viga
