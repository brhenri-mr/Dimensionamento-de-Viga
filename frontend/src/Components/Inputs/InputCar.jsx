import React, { useState } from "react";
//Material Ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
//Constante
import { patterConst, CP, CV,tipo_carr} from "../../Constants/classCar";
//Redux
import { useDispatch } from "react-redux";
import { actions } from "../../Actions/Carregamento";

const InputCar = (props) =>{

    //Dispatch
    const dispatch = useDispatch()


    //useState
    const [patter,setPatter] = useState('')
    const [describe, setDescribe] = useState('')
    const [mag, setMag] = useState('')
    const [startpos, setStartpos] = useState('')
    const [finalpos, setFinalpos] = useState('')
    const [tipocar, setTipoCar] = useState('')
    const [nome, setNome] = useState('')

    let describeop = (patter===patterConst[0]) ? CP:CV



    const onclickevent = (event) => {
        event.preventDefault()
        
        const item = {
            id:new Date().toString(),
            name: nome,
            tipo:tipocar,
            patter:patter,
            describe:describe,
            mag:parseInt(mag),
            pos:[parseInt(startpos),parseInt(finalpos)],
        }
    dispatch(actions.adicionar(item))
    }

    return(
    <>
        <Box>
            <FormControl>
                <TextField label='Nome Carregamento' value={nome} onChange={(event) => {event.preventDefault();setNome(event.target.value)}}></TextField>
            </FormControl>
            <FormControl>
                <InputLabel>Patter</InputLabel>
                <Select
                value={patter}
                label='Patter'
                onChange={event =>{event.preventDefault();return setPatter(event.target.value)}}
                    >
                    {patterConst.map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Describe</InputLabel>
                <Select
                value={describe}
                label='Describe'
                onChange={event =>{event.preventDefault();return setDescribe(event.target.value)}}
                    >
                    {describeop.map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                </Select> 
            </FormControl>
            <FormControl>
                <InputLabel>Tipo</InputLabel>
                <Select
                value={tipocar}
                label='Tipo'
                onChange={event =>{event.preventDefault()
                    return setTipoCar(event.target.value)}}
                    >
                    {tipo_carr.map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                </Select>
            </FormControl>
            <TextField label='Maginitude' value={mag} onChange={(event) => {event.preventDefault();setMag(event.target.value)}}></TextField>
        </Box>
        <Box>

        </Box>
            <FormControl>
                <p>Posição</p>
                <TextField label='Posição Inicial' value={startpos} onChange={(event) => {event.preventDefault();setStartpos(event.target.value)}}></TextField>
                <TextField label='Posição Final' value={finalpos} onChange={(event) => {event.preventDefault();setFinalpos(event.target.value)}}></TextField>
                <Button onClick={onclickevent}>Add</Button>
            </FormControl>
    </>
    )
}

export default InputCar