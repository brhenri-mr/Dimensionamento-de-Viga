import React, { useState } from "react";
//Matirial UI
import { FormControl } from "@mui/material";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
//Redux
import { useDispatch } from "react-redux";
import { actions } from "../../Actions/Apoios";
//Constantes
import classeApoios from '../../Constants/classApoios'

const Inputs_a = (props) => {

    const [tipo, setTipo] = useState('')
    const [pos, setPos] = useState('')
    const dispatch = useDispatch()

    const onClickAdd = (event) => {
        event.preventDefault()

        const apoio ={
            id: new Date().toString(),
            tipo: tipo,
            value: parseInt(pos),
        }

        dispatch(actions.adicionar(apoio))

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
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off">
            <p>{props.titulo}</p>
            <FormControl>
                <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tipo}
                    label="Tipo"
                    onChange={event =>{event.preventDefault()
                        return setTipo(event.target.value)}}
                >
                    {Object.keys(classeApoios).map((el,index)=>{
                        return <MenuItem key= {index} value={classeApoios[el]}>{classeApoios[el]}</MenuItem>
                    })}
                </Select>
                <TextField 
                id="outlined-basic" 
                label="Posição" 
                variant="outlined" 
                value={pos}
                error={erro(pos)}
                helperText = {erro(pos)?'insira somente numeros':''}
                onChange={event =>{event.preventDefault();return setPos(event.target.value)}} />
                <Button onClick={onClickAdd}>Add</Button>
            </FormControl>
        </Box>
        )
}

export default Inputs_a