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
        if (erro(event.target.value)){
            
        }
        else{
            dispach(actions.modificar(event.target.value))
        }
        return setComprimento(event.target.value)
    }


    const erro = (variavel) =>{
        if (variavel[0] === undefined){
            return false
        }
        else if (variavel.includes('-')){
            return true
        }
        else if ('1234567890'.includes(variavel[variavel.length-1])){
            return false
        }

        'abcdefghijklmnopqrstuvwxyz'.forEach(item =>{
            if (variavel.includes(item))
            return false
        })
        return true
    }

    return(

        <FormControl>
            <TextField 
            label='Comprimento da barra [cm]' 
            variant="outlined" 
            value={comprimento} 
            onChange={handlechange}
            error = {erro(comprimento)}
            helperText = {erro(comprimento)?'insira somente numeros':''}
            sx={{backgroundColor:'white'} }
            />
        </FormControl>

    )
}

export default InputBarra

