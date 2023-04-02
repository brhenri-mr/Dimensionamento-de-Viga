import React from "react";
//Componentes
import AccordionSelf from "../Data/AccordionSelf";

const Resultados = (props)=>{
    const nome = 'Momento = 45kN'
    const texto = ["O momento fletor se calcula aplicando a formulação a seguir","M=Fxd","Com isso, pode-se calcular os esforços vindo de momento fletor"]
    return(
        <>
            <AccordionSelf label={nome} text={texto}></AccordionSelf>
        </>
    )
}



export default Resultados