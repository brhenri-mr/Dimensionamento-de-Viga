import { FormControl } from "@mui/material";
import React, { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch } from "react-redux";
import { actions } from "../../Actions/Apoios";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import classeApoios from '../../Constants/classApoios'
import InputLabel from '@mui/material/InputLabel';

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
                    onChange={event => setTipo(event.target.value)}
                >
                    {Object.keys(classeApoios).map((el,index)=>{
                        return <MenuItem key= {index} value={classeApoios[el]}>{classeApoios[el]}</MenuItem>
                    })}
                </Select>
                <TextField id="outlined-basic" label="Posição" variant="outlined" value={pos} onChange={event =>setPos(event.target.value)} />
                <Button onClick={onClickAdd}>Add</Button>
            </FormControl>
        </Box>
        )
}

export default Inputs_a