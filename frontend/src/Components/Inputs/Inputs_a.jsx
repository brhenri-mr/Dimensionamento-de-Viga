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
import { useSelector } from "react-redux";
//Constantes
import classeApoios from '../../Constants/classApoios'

const Inputs_a = (props) => {

    const [tipo, setTipo] = useState('')
    const [pos, setPos] = useState('')
    const dispatch = useDispatch()

    const APOIOS = useSelector(state => state.botoesReducers.APOIOS)
    const BARRA = useSelector(state => state.barraReducers.BARRA)

    const onClickAdd = (event) => {
        event.preventDefault()

        let jaexiste = false

        for(let item of APOIOS){
            if (item['value']===parseFloat(pos)){
                jaexiste = true
                break
            }
        }

        if (parseFloat(pos)>BARRA){
            jaexiste = true
        }


        if (tipo!=="" && pos!=="" && !jaexiste ){

            const apoio ={
                id: new Date(),
                tipo: tipo,
                value: parseFloat(pos.replace(',','.')),
            }
    
            dispatch(actions.adicionar(apoio))
        }
       

    }
    
    const erro = (variavel) =>{


        for (let item of 'abcdefghijklmnopqrstuvwxyz'){
            if (variavel.includes(item)){
                return true

            }
        }

        if (variavel[0] === undefined){
            return false
        }
        else if (variavel.split("").filter(palavra=> palavra==="." || palavra===",").length >1){
            return true
        }
        else if (variavel.includes('-')){
            return true
        }
        else if ('1234567890.,'.includes(variavel[variavel.length-1])){
            return false
        }



        return true
    }



    return(
        <>
            <FormControl>
                <InputLabel>Grau de Liberdade do Apoio</InputLabel>
                <Select
                    value={tipo}
                    label="Grau de Liberdade do Apoio"
                    sx={{backgroundColor:'white'} }
                    onChange={event =>{event.preventDefault()
                        return setTipo(event.target.value)}}
                >
                    {Object.keys(classeApoios).map((el,index)=>{
                        return <MenuItem key= {index} value={classeApoios[el]}>{classeApoios[el]}</MenuItem>
                    })}
                </Select>
                </FormControl>
                <FormControl>
                <TextField 
                id="outlined-basic" 
                label="Posição do Apoio [cm]" 
                variant="outlined" 
                value={pos}
                error={erro(pos)}
                sx={{backgroundColor:'white'} }
                helperText = {erro(pos)?'insira somente numeros positivos':''}
                onChange={event =>{event.preventDefault();return setPos(event.target.value)}} />
                <Box sx={{'& > :not(style)': { m: 1, width: '42.5ch' }}}noValidate autoComplete="off">
                <Button variant="contained" onClick={erro(pos)? ()=>{return 1}:onClickAdd}>Add</Button>
                </Box>
            </FormControl>
        </>
        )
}

export default Inputs_a