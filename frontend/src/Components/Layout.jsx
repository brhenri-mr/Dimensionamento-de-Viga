import { Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
//compoments
import Figura from "./Figura";
import Inputs_a from "./Inputs/Inputs_a";


const Layout = () => {

    const APOIOS = useSelector(state => state.apoiosReducers.APOIOS)


    console.log(APOIOS)

    return(
        <div>
            <br></br>
            <br></br>
            <Inputs_a titulo={'apoios'}></Inputs_a>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Figura apoios = {APOIOS}></Figura>
        </div>
    )
}

export default Layout