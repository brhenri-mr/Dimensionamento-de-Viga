import React from "react";
//Material ui
import AccordionSelf from "../Data/AccordionSelf";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
//Componente
import DiagramaCortante from "../SVG/DiagramaCortante";
import DiagramaMomento from "../SVG/DiagramaMomento";


const Resultados = (props)=>{
    const nome = 'Momento = 45kN'
    const texto = ["O momento fletor se calcula aplicando a formulação a seguir","M=Fxd","Com isso, pode-se calcular os esforços vindo de momento fletor"]
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
            <AccordionSelf label={nome} text={texto}></AccordionSelf>
        </>
    )
}



export default Resultados