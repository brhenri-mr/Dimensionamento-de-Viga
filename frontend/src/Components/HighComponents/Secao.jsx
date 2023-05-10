import React from "react";
import { useState } from "react";
//Material UI
import { Box } from "@mui/system"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { FormControl } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import { AlertTitle } from "@mui/material";
//Redux
import { useDispatch} from "react-redux";
//Componentes
import SecaoTransversal from '../SVG/SecaoTransversal'
import actions from "../../Actions/Caracteristicas";
//constantes
import { ambiente } from "../../Constants/classeAmbiental";


const Secao  = (props)=> {

    //Dispatch
    const dispatch = useDispatch()

    const [fck,setFck] = useState('')
    const [fyk,setFyk] = useState('')
    const [alturaSecao,setAlturasecao]= useState('')
    const [diametromax,setDiametromax] = useState('')
    const [bw,setBw] = useState('')
    const [diametroL,setDiametroL] = useState('')
    const [bitolaT, setBitolaT] = useState('')
    const [fykt, setFykt] = useState('')
    const [classeAmbiental, setClasseambiental] = useState('')
    const [alerta,setAlerta] = useState(false)
    const [sucesso, setSucesso] = useState(false)
    const [mensagem, setMensagem] = useState('')

    const caracteristcas = (event)=>{
        event.preventDefault()

        let buginfernal = alerta //o setAlert nao funciona, nao adianta
        let temp = 0

        for(let i of [fck,fyk,alturaSecao,diametromax,bw,diametroL,bitolaT,fykt,classeAmbiental]){
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


        for(let i of [fck,fyk,alturaSecao,diametromax,bw,diametroL,bitolaT,fykt]){
            for(let letra of i){
                if ('1234567890'.includes(letra)){
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



        if (!buginfernal){

            const item = {
                fck:parseInt(fck.replace(',','.')),
                fyk:parseInt(fyk.replace(',','.')),
                h:parseFloat(alturaSecao.replace(',','.')),
                dmax:parseFloat(diametromax.replace(',','.')),
                bw:parseFloat(bw.replace(',','.')),
                dL:parseFloat(diametroL.replace(',','.')),
                dT: parseFloat(bitolaT.replace(',','.')),
                fykt: parseFloat(fykt.replace(',','.')),
                classeambiental:classeAmbiental
            }
            dispatch(actions.adicionar(item))
            setAlerta(false)
            setSucesso(true)
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
                <Grid item xs={8.9}>
                    <Box Class='Seção Transversal' >
                    <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                        <p style={{fontSize:25,fontFamily:'Helvetica,Arial', border:1}}>Seção Transversal</p>
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <item>
                                    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                                        <TextField id="outlined-basic" 
                                        value={fck} 
                                        onChange={(event) =>{event.preventDefault();return setFck(event.target.value)}} 
                                        label="Resistência caracteristica a compressão [MPa]" 
                                        variant="outlined"  
                                        error={erro(fck,'numeros')}
                                        helperText = {erro(fck,'numeros')?'Insira somente números':''}
                                        sx={{backgroundColor:'white'} }/>

                                        <TextField id="outlined-basic" 
                                        value={fyk} 
                                        onChange={(event) =>{event.preventDefault();return setFyk(event.target.value)}} 
                                        label="Resistência característica ao escomento [MPa]" 
                                        variant="outlined"
                                        error={erro(fyk,'numeros')}
                                        helperText = {erro(fyk,'numeros')?'Insira somente números':''}
                                        sx={{backgroundColor:'white'}}/>

                                    </Box>
                                    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">

                                        <TextField 
                                        id="outlined-basic" 
                                        value={alturaSecao} 
                                        onChange={(event) =>{event.preventDefault();return setAlturasecao(event.target.value)}} 
                                        label="Altura da seção" 
                                        variant="outlined"
                                        error={erro(alturaSecao,'numeros')}
                                        helperText = {erro(alturaSecao,'numeros')?'Insira somente números':''}
                                        sx={{backgroundColor:'white'}}/>

                                        <TextField 
                                        id="outlined-basic"
                                        value={diametromax} 
                                        onChange={(event) =>{event.preventDefault();return setDiametromax(event.target.value)}} 
                                        label="Diâmetro máximo do agregado"
                                        variant="outlined"
                                        error={erro(diametromax,'numeros')}
                                        helperText = {erro(diametromax,'numeros')?'Insira somente números':''}
                                        sx={{backgroundColor:'white'}}/>

                                    </Box>
                                    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">

                                        <TextField 
                                        id="outlined-basic" 
                                        value={bw} 
                                        onChange={(event) =>{event.preventDefault();return setBw(event.target.value)}} 
                                        label="Largura comprimida " 
                                        variant="outlined"
                                        error={erro(bw,'numeros')}
                                        helperText = {erro(bw,'numeros')?'Insira somente números':''}
                                        sx={{backgroundColor:'white'}}/>

                                        <TextField 
                                        id="outlined-basic" 
                                        value={diametroL} 
                                        onChange={(event) =>{event.preventDefault();return setDiametroL(event.target.value)}} 
                                        label="Diâmetro das Armaduras Logitudinais" 
                                        variant="outlined"
                                        error={erro(diametroL,'numeros')}
                                        helperText = {erro(diametroL,'numeros')?'Insira somente números':''}
                                        sx={{backgroundColor:'white'}} />
                                    </Box>
                                </item>
                            </Grid>
                            <Grid item xs sx={{marginLeft:'6rem', paddingRight:'0%', marginRight:'4rem'}}>
                                <item>
                                    <SecaoTransversal></SecaoTransversal>
                                </item>
                            </Grid>
                        </Grid>
                    </Paper>
                    </Box>
                </Grid>
                <Grid item >
                    <Box Class='Armadura Transversal' >
                        <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                        <p style={{fontSize:25}}>Armadura Transversal</p>
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{marginLeft:0.25}}>
                            <Grid>
                                <item>
                                        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">
                                            <TextField 
                                            id="outlined-basic" 
                                            value={fykt} 
                                            onChange={(event) =>{event.preventDefault();return setFykt(event.target.value)}} 
                                            label="Resistência caracteristicas a escoamento" 
                                            variant="outlined"
                                            error={erro(fykt,'numeros')}
                                            helperText = {erro(fykt,'numeros')?'Insira somente números':''}
                                            sx={{backgroundColor:'white'}}
                                        />
                                        </Box>
                                        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">
                                            <TextField 
                                                id="outlined-basic" 
                                                value={bitolaT} 
                                                onChange={(event) =>{event.preventDefault();return setBitolaT(event.target.value)}} 
                                                label="diâmetro do estribo" 
                                                variant="outlined"
                                                error={erro(bitolaT,'numeros')}
                                                helperText = {erro(bitolaT,'numeros')?'Insira somente números':''}
                                                sx={{backgroundColor:'white'}}
                                            />
                                        </Box>
                                        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">
                                            <Button onClick={caracteristcas}>Adicionar</Button>
                                        </Box>
                                </item>
                            </Grid>
                        </Grid>
                        </Paper>
                    </Box>
                </Grid>
                <Grid item xs={8.9}>
                    <Box Class='Agressividade Ambiental' >
                        <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                        <p style={{fontSize:25}}>Classe Ambiental</p>
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{marginLeft:0.25}}>
                            <Grid>
                            <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                            <FormControl>
                                    <InputLabel>Classe Ambiental</InputLabel>
                                    <Select
                                    value={classeAmbiental}
                                    label='Classe Ambiental'
                                    sx={{backgroundColor:'white'}}
                                    onChange={event =>{event.preventDefault();return setClasseambiental(event.target.value)}}
                                        >
                                    {ambiente.map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                    </Select>
                                </FormControl>
                            </Box>
                            </Grid>
                        </Grid>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default Secao