import React from "react";
import './LayoutCadastro.css'
//Material ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Paper } from "@mui/material";
//Redux
import { useDispatch } from "react-redux";
//compoments
import ItemCadastrado from "../Cadastro/ItemCadastrado";
import { actions } from "../../Actions/Apoios";
import EstiloCadastro from "../Styles/EstiloCadastro";




const LayoutCadastro = (props)=>{

    const dispatch = useDispatch()

    return(
        <EstiloCadastro>
            <Box>
                <p>{`Apoio ${props.index+1}`}</p>
                <ItemCadastrado value={props.value}></ItemCadastrado>
                <Button onClick ={()=>{dispatch(actions.remover(props.value))}}>Deletar</Button>
                <br></br>
            </Box>
        </EstiloCadastro>
    )
}

export default LayoutCadastro