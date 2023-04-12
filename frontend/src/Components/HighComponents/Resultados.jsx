import React from "react";
//Material ui
import AccordionSelf from "../Data/AccordionSelf";
import Box from '@mui/material/Box';
//Componente
import DiagramaCortante from "../SVG/DiagramaCortante";


const Resultados = (props)=>{
    const nome = 'Momento = 45kN'
    const texto = ["O momento fletor se calcula aplicando a formulação a seguir","M=Fxd","Com isso, pode-se calcular os esforços vindo de momento fletor"]
    return(
        <>
            <Box>
                <DiagramaCortante barra={props.barra} apoios={props.apoios} metrigidez={props.metrigidez}></DiagramaCortante>
            </Box>
            <AccordionSelf label={nome} text={texto}></AccordionSelf>
        </>
    )
}



export default Resultados