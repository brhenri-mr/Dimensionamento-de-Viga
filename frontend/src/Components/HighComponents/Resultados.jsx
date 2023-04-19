import React from "react";
//Material ui
import AccordionSelf from "../Data/AccordionSelf";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
//Componente
import DiagramaCortante from "../SVG/DiagramaCortante";
import DiagramaMomento from "../SVG/DiagramaMomento";


const Resultados = (props)=>{
    const acoordeao ={
        Momento:{
            nome:'Msd = 45kN',
            texto:["O momento fletor de calcula aplicando, segue a seguinte a formulação","M=Fxd","Com isso, pode-se calcular os esforços vindo de momento fletor"]
        },
        Altura_Ultil:{
            nome:'d=45cm',
            texto:['Explicar para primeira interacao como se faz']

        }
    }
    return(
        <>
        <Grid container spacing={4}>
            <Grid xs={6}>
                <Box>
                    <DiagramaCortante barra={props.barra} apoios={props.apoios} metrigidez={props.metrigidez}></DiagramaCortante>
                </Box>
            </Grid>
            <Grid xs={5}>
                <Box>
                    <DiagramaMomento barra={props.barra} apoios={props.apoios} metrigidez={props.metrigidez}></DiagramaMomento>
                </Box>
            </Grid>
        </Grid>
        {Object.keys(acoordeao).map((valor,indice)=>{
            return <AccordionSelf label={acoordeao[valor]['nome']} text={acoordeao[valor]['texto']}></AccordionSelf>
        })}

        </>
    )
}



export default Resultados