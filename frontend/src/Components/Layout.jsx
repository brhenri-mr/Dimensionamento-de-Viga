import React from "react";
//compoments
import Figura from "./Figura";


const Layout = () => {

    const APOIOS = {
        1:{
            'tipo': 'Apoio Rotulado',
            'value': 0

        },
        2:{
            'tipo': 'Apoio Rotulado',
            'value': 300

        }
    }

    return(
        <div>
            <Figura apoios = {APOIOS}></Figura>
        </div>
    )
}

export default Layout