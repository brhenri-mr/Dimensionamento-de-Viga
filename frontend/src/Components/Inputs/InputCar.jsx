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
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import { AlertTitle } from "@mui/material";
//Constante
import { patterConst, CP, CV,tipo_carr,Descricao} from "../../Constants/classCar";
//Redux
import { useDispatch } from "react-redux";
import { actions } from "../../Actions/Carregamento";
import { useSelector } from "react-redux";
//Componentes

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
    const [alerta,setAlerta] = useState(false)
    const [sucesso, setSucesso] = useState(false)
    const [mensagem, setMensagem] = useState('')

    const CARREGAMENTOS = useSelector(state => state.botoesReducers.CARREGAMENTOS)
    const BARRA = useSelector(state => state.barraReducers.BARRA)

    let describeop = (patter===patterConst[0]) ? CP:CV
    let TipodeCarregamento = (patter===patterConst[0]) ? true:false // diz qual o tipo de carregamento CP (true) ou Cv (false)

    let correcaobugdescricao = (descricao==='')? ['Vento']:descricao


    const onclickevent = (event) => {
        event.preventDefault()

        let buginfernal = alerta //o setAlert nao funciona, nao adiant
        let temp = 0
        let grupo = ((tipocar ==="Pontual"))? [nome,tipocar,patter,describe,mag,startpos]:[nome,tipocar,patter,describe,mag,startpos,finalpos]
        
        for(let i of grupo){
            if (i === ''){
                setAlerta(true)
                buginfernal = true
                setMensagem('Há campos vazios')
                break
            }
            else{
                buginfernal = false
            }
        }

        if(!buginfernal && !alerta){
        for(let i of [mag,startpos,finalpos]){
            for(let letra of i){
                if ('1234567890'.includes(letra)){
                    buginfernal = false
                    break
                }
                else{
                    buginfernal = true
                    setAlerta(true)
                    setMensagem('Precisa existir pelo menos um numero em campos numericos, não so espacadores')
                }
            }
            for(let letra of i){
                if (letra ===',' || letra==='.'){
                    temp = temp + 1
                }
                if (temp>1){
                    buginfernal = true
                    setAlerta(true)
                    setMensagem('Há quantidade excessiva de separadores viruglas ou pontos')
                    break
                }
            }
            temp = 0
        }
    }

    for(let carregamento of CARREGAMENTOS){
        if(nome===carregamento['name']){
            setAlerta(true)
            buginfernal = true
            setMensagem('Nome já cadastrado')
            break
        }
    }

    if(tipocar==="Distribuido" && startpos===finalpos){
        setAlerta(true)
        buginfernal = true
        setMensagem('Carregamento Distribuido precisa ter pontos de inicio e final Diferentes')
    }

    if(tipocar==="Distribuido" && parseFloat(startpos.replace(',','.'))>parseFloat(finalpos.replace(',','.'))){
        setAlerta(true)
        buginfernal = true
        setMensagem('Carregamento Distribuido que o ponto inicial fora da barra')
    }
    
    if(tipocar==="Distribuido" && parseFloat(finalpos.replace(',','.'))>parseFloat(BARRA.replace(',','.'))){
        setAlerta(true)
        buginfernal = true
        setMensagem('Ponto de inicial do carregamento fora da barra')
    }
    if(tipocar==="Distribuido" && parseFloat(startpos.replace(',','.'))>parseFloat(BARRA.replace(',','.'))){
        setAlerta(true)
        buginfernal = true
        setMensagem('Ponto de inicial do carregamento fora da barra')
    }

    if(tipocar==="Pontual" && parseFloat(startpos.replace(',','.'))>parseFloat(BARRA.replace(',','.'))){
        setAlerta(true)
        buginfernal = true
        setMensagem('Carregamento fora da barra')
    }
    if(tipocar==="Pontual" && parseFloat(startpos.replace(',','.'))<0){
        setAlerta(true)
        buginfernal = true
        setMensagem('Carregamento fora da barra')
    }



        if (!buginfernal && !alerta){
            const item = {
                name: nome,
                tipo:tipocar,
                patter:patter,
                describe:describe,
                mag:parseFloat(mag.replace(',','.')),
                pos:[parseFloat(startpos.replace(',','.')),(tipocar ==="Pontual")? parseFloat(startpos.replace(',','.')):parseFloat(finalpos.replace(',','.'))],
                comb:[]
            }
            dispatch(actions.adicionar(item))
    
            const informacoesadicionais = {
                name: nome,
                Local:descricao,
                informacao:descricaosecundaria
            }
    
            dispatch(actions.adicionar_informacoes(informacoesadicionais))

            setSucesso(true)
            setAlerta(false)
            
        }
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
            if ('1234567890-+.,'.includes(variavel[variavel.length-1])){
                return false
        }
        }
        return true
    }


 

    return(
    <>
    <Box sx={{paddingBottom:(alerta || sucesso)?'1rem':'0rem'}}>
    <Collapse in={alerta}>
        <Alert severity="warning" onClose={() => {setAlerta(false)}}>
            <AlertTitle>Atenção Entrada de Dados — <strong>Inválida</strong></AlertTitle>
            {mensagem}
        </Alert>
    </Collapse>
    <Collapse in={(sucesso)} >
        <Alert onClose={() => {setSucesso(false)}} >
            <AlertTitle>Carregamento Cadastrado com Sucesso</AlertTitle>
            </Alert>
    </Collapse>
    </Box>
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
                                <InputLabel>Classificação do Carregamento</InputLabel>
                                <Select
                                value={patter}
                                label='Classificação do Carregamento'
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
                                <InputLabel>{TipodeCarregamento? "":"Descrição do Carregamento"}</InputLabel>
                                <Select
                                disabled = {TipodeCarregamento}
                                value={descricao}
                                sx={{backgroundColor:'white'}}
                                label='Descrição Segundo NBR6118'
                                onChange={event =>{event.preventDefault();return setDescricao(event.target.value)}}
                                    >
                                    {Object.keys(Descricao).map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                </Select> 
                            </FormControl>
                            <FormControl>
                                <InputLabel>{TipodeCarregamento? "":"Complemento a Descrição"}</InputLabel>
                                <Select
                                disabled = {TipodeCarregamento}
                                value={ descricaosecundaria}
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
                                <TextField 
                                label={(tipocar ==="Pontual") ?'Posição':'Posição Inicial'} 
                                sx={{backgroundColor:'white'}} 
                                value={startpos} 
                                onChange={(event) => {event.preventDefault();setStartpos(event.target.value)}}
                                error={erro(startpos,'numeros')}
                                helperText = {erro(startpos,'numeros')?'Insira somente números':''}
                                ></TextField>
                            </FormControl>
                            <FormControl>
                                <TextField 
                                label={(tipocar ==="Pontual") ?'':'Posição Final'}
                                sx={{backgroundColor:'white'}} 
                                value={finalpos}
                                disabled = {tipocar ==="Pontual"}
                                error={erro(finalpos,'numeros')}
                                helperText = {erro(finalpos,'numeros')?'Insira somente números':''}
                                onChange={(event) => {event.preventDefault();setFinalpos(event.target.value)}}></TextField>
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