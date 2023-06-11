import React, { useState } from "react";
//Material UI
import TextField from '@mui/material/TextField';
import { FormControl } from "@mui/material";
import Box from '@mui/material/Box';
//Redux
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../Actions/Barra";

const InputBarra = (props)=>{

    const BARRA = useSelector(state => state.barraReducers.BARRA)

    const [comprimento, setComprimento] = useState(BARRA ===0 ? '':BARRA)
    
    const dispach = useDispatch()

    const handlechange = (event) =>{
        event.preventDefault()
        if (erro(event.target.value)){
            
        }
        else{
            dispach(actions.modificar(event.target.value.replace(',','.')))
            return setComprimento(event.target.value)
        }
        
    }


    const erro = (variavel) =>{

        let alerta = true

        if (variavel[0] === undefined){
            return false
        }
        else if (variavel.includes('-')){
            return true
        }
        else if (variavel.split("").filter(palavra=> palavra==="." || palavra===",").length >1){
            return true
        }
        else if ('1234567890.,'.includes(variavel[variavel.length-1])){
            return false
        }


        for (let item of 'abcdefghijklmnopqrstuvwxyz'){
            if (variavel.includes(item)){
                return true
            }
        }

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

