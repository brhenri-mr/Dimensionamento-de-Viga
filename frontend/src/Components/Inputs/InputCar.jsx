import React, { useState } from "react";
//Material Ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
//Constante
import { patterConst, CP, CV,tipo_carr,Descricao} from "../../Constants/classCar";
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
    const [descricao,setDescricao] = useState('')
    const [descricaosecundaria, setDescricaosecundaria] = useState('')

    let describeop = (patter===patterConst[0]) ? CP:CV

    let correcaobugdescricao = (descricao==='')? ['Vento']:descricao

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
            comb:[]
        }
        dispatch(actions.adicionar(item))

        const informacoesadicionais = {
            Local:descricao,
            informacao:descricaosecundaria
        }

        dispatch(actions.adicionar_informacoes(informacoesadicionais))

        
    }


    const erro = (variavel,nome ) =>{
        if (variavel[0] === undefined){
            return false
        }
        else if (nome==='nome'){
            if (!'*'.includes(variavel[variavel.length-1])){
                return false
        }
        }
        else if (nome==='numeros'){
            if ('1234567890-+'.includes(variavel[variavel.length-1])){
                return false
        }
        }
        return true
    }



    return(
    <>
     <Grid container spacing={4}>
        <Grid item>
            <Box>
                <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                    <p style={{fontSize:25,fontFamily:'Helvetica,Arial', border:1}}>Carregamento</p>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        <item>
                        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                            <FormControl>
                                <TextField 
                                label='Nome do Carregamento' 
                                sx={{backgroundColor:'white'}} 
                                value={nome} 
                                onChange={(event) => {event.preventDefault();setNome(event.target.value)}}
                                error={erro(nome,'nome')}
                                helperText = {erro(nome,'nome')?'Não pode nomes com *':''}
                                ></TextField>
                            </FormControl>
                            <FormControl>
                                <InputLabel>Persistência do Carregamento</InputLabel>
                                <Select
                                value={patter}
                                label='Persistência do Carregamento'
                                sx={{backgroundColor:'white'}}
                                onChange={event =>{event.preventDefault();return setPatter(event.target.value)}}
                                    >
                                    {patterConst.map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                            <FormControl>
                                <InputLabel>Descrição Segundo NBR6118</InputLabel>
                                <Select
                                value={describe}
                                sx={{backgroundColor:'white'}}
                                label='Descrição Segundo NBR6118'
                                onChange={event =>{event.preventDefault();return setDescribe(event.target.value)}}
                                    >
                                    {describeop.map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                </Select> 
                            </FormControl>
                            <FormControl>
                                <InputLabel>Natureza do Carregamento</InputLabel>
                                <Select
                                value={tipocar}
                                sx={{backgroundColor:'white'}}
                                label='Natureza do Carregamento'
                                onChange={event =>{event.preventDefault()
                                    return setTipoCar(event.target.value)}}
                                    >
                                    {tipo_carr.map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                        <TextField 
                        label='Maginitude [kN]' 
                        sx={{backgroundColor:'white'}} 
                        value={mag} 
                        onChange={(event) => {event.preventDefault();setMag(event.target.value)}}
                        error={erro(mag,'numeros')}
                        helperText = {erro(mag,'numeros')?'Insira somente números':''}
                        ></TextField>
                        </Box>
                        </item>
                    </Grid>
                </Paper>
            </Box>
        </Grid>
        <Grid item>
            <Box>
                <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                    <p style={{fontSize:25,fontFamily:'Helvetica,Arial', border:1}}>Descrição</p>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        <item>
                        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                            <FormControl>
                                <InputLabel>Descrição do Carregamento</InputLabel>
                                <Select
                                value={descricao}
                                sx={{backgroundColor:'white'}}
                                label='Descrição Segundo NBR6118'
                                onChange={event =>{event.preventDefault();return setDescricao(event.target.value)}}
                                    >
                                    {Object.keys(Descricao).map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                </Select> 
                            </FormControl>
                            <FormControl>
                                <InputLabel>Descrição do Carregamento</InputLabel>
                                <Select
                                value={descricaosecundaria}
                                sx={{backgroundColor:'white'}}
                                label='Descrição Segundo NBR6118'
                                onChange={event =>{event.preventDefault();return setDescricaosecundaria(event.target.value)}}
                                    >
                                    {Descricao[correcaobugdescricao].map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                </Select> 
                            </FormControl>
                        </Box>
                        </item>
                    </Grid>
                </Paper>
            </Box>
        </Grid>
        <Grid item>
            <Box>
                <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                    <p style={{fontSize:25,fontFamily:'Helvetica,Arial', border:1}}>Posição</p>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        <item>
                        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                            <FormControl>
                                <TextField label='Posição Inicial' sx={{backgroundColor:'white'}} value={startpos} onChange={(event) => {event.preventDefault();setStartpos(event.target.value)}}></TextField>
                            </FormControl>
                            <FormControl>
                                <TextField label='Posição Final' sx={{backgroundColor:'white'}} value={finalpos} onChange={(event) => {event.preventDefault();setFinalpos(event.target.value)}}></TextField>
                            </FormControl>
                        </Box>
                        <Button onClick={onclickevent}>Add</Button>
                        </item>
                    </Grid>
                </Paper>
            </Box>
        </Grid>
        </Grid>
    </>
    )
}

export default InputCar