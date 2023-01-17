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

    return(
    <Box  component="form"
    sx={{'& > :not(style)': { m: 1, width: '25ch' },}}
    noValidate
    autoComplete="off">
        <FormControl>
            <TextField label='Comprimento da barra' variant="outlined" value={comprimento} onChange={handlechange}/>
        </FormControl>
    </Box>
    )
}

export default InputBarra

