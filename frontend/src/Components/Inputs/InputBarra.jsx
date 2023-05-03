import React, { useState } from "react";
//Material UI
import TextField from '@mui/material/TextField';
import { FormControl } from "@mui/material";
import Box from '@mui/material/Box';
//Redux
import { useDispatch } from "react-redux";
import { actions } from "../../Actions/Barra";

const InputBarra = (props)=>{

    const [comprimento, setComprimento] = useState('')

    const dispach = useDispatch()

    const handlechange = (event) =>{
        event.preventDefault()
        dispach(actions.modificar(event.target.value))
        return setComprimento(event.target.value)
    }


    const erro = (variavel) =>{
        if (variavel[0] === undefined){
            return false
        }
        else if ('1234567890'.includes(variavel[variavel.length-1])){
            return false
        }
        return true
    }

    return(
    <Box  component="form"
    sx={{'& > :not(style)': { m: 1, width: '25ch' },}}
    noValidate
    autoComplete="off">
        <FormControl>
            <TextField 
            label='Comprimento da barra' 
            variant="outlined" 
            value={comprimento} 
            onChange={handlechange}
            error = {erro(comprimento)}
            helperText = {erro(comprimento)?'insira somente numeros':''}
            />
        </FormControl>
    </Box>
    )
}

export default InputBarra

