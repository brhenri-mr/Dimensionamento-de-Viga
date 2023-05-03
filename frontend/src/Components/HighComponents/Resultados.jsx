import React from "react";
//Material ui
import AccordionSelf from "../Data/AccordionSelf";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
//Componente
import DiagramaCortante from "../SVG/DiagramaCortante";
import DiagramaMomento from "../SVG/DiagramaMomento";


function textotentativa(db,caso){

    const verificacaoadm = (db['Verificacao Linha Neutra']['Aviso'][0]) ?'Linha neutra verificada':'Linha Neutra não verifica' //Há uma bug possivel, que a so uma valor de aviso, e nao para cadqa teste


    return  {
        ConstantesNBR6118:{
            titulo: 'Parametros NBR6118:2014 ',
            texto:['']
        },
        Momento:{
            titulo: 'Msd = ',
            texto:['']
        },
        DiscretizacaoInicial:{
            titulo: `ys = ${db['Altura Util']['ys'][caso]} cm`,
            texto:['']

        },
        Altura_Util:{
            titulo:`d = ${db['Altura Util']['Valor'][caso]} cm`,
            texto:['']

        },
        Admensionais:{
            titulo: `bx = ${db['Admensionais'][caso][0].toFixed(2)}, by = ${db['Admensionais'][caso][1].toFixed(2)}, bs = ${db['Admensionais'][caso][2].toFixed(2)}`,
            texto:['']

        },
        AreaAcoCalculada:{
            titulo: `Ascalc = ${db['Area']['Area Necessaria'][caso].toFixed(2)} cm²` ,
            texto:['']

        },
        VerificacaoAreaAco:{
            titulo: 'Verificação aço',
            texto:['']

        },
        AreaAcoEfetiva:{
            titulo: `Asef = ${db['Area']['Area Efetiva'][caso].toFixed(2)} cm²`,
            texto:['']
        },
        Discretizacao:{
            titulo: 'Discretização',
            texto:['']

        },
        VerificacaoAdmensionais:{
            titulo: verificacaoadm ,
            texto:['']

        },
    }
}



const Resultados = (props)=>{
    let acoordeao = {}
    try {
        acoordeao = textotentativa(props.dimensionamento,0)
        console.log(props.dimensionamento)
    } catch (error) {
        console.log('erro')
        acoordeao ={
            Momento:{
                nome:'Msd = 45kN',
                texto:["O momento fletor de calcula aplicando, segue a seguinte a formulação","M=Fxd","Com isso, pode-se calcular os esforços vindo de momento fletor"]
            },
            jose:{
                nome:'tentativa',
                texto:['tentativa 1']
            },
            Altura_Ultil:{
                nome:'d=45cm',
                texto:['Explicar para primeira interacao como se faz']
    
            }
        }
    }
    
    console.log(acoordeao)

    return(
        <div >
        <Grid container spacing={4}>
            <Grid xs={6}>
                <Box>
                    <DiagramaCortante barra={props.barra} apoios={props.apoios} metrigidez={props.metrigidez}></DiagramaCortante>

                </Box>
            </Grid>
            <Grid xs={6}>
                <Box>
                    <DiagramaMomento barra={props.barra} apoios={props.apoios} metrigidez={props.metrigidez}></DiagramaMomento>
                </Box>
            </Grid>
        </Grid>
        {Object.keys(acoordeao).map((valor,indice)=>{
            return <AccordionSelf label={acoordeao[valor]['titulo']} text={acoordeao[valor]['texto']}></AccordionSelf>
        })}
        </div>
    )
}



export default Resultados