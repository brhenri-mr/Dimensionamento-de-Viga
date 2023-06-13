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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

//Redux
import { useDispatch} from "react-redux";
import { useSelector } from "react-redux";
//Componentes
import actions from "../../Actions/Caracteristicas";
//constantes
import { ambiente } from "../../Constants/classeAmbiental";
import { NomesAgregados,ClasseConcreto,ClasseAço } from "../../Constants/classSecao";
import { Britas,diametroparabrita } from "../../Constants/DiametrosAgregado";

const Secao  = (props)=> {

    //Dispatch
    const dispatch = useDispatch()
    const CARACTERISTICAS = useSelector(state =>state.caracteristicasReducers.CARACTERISTICAS)
    const [fck,setFck] = useState(CARACTERISTICAS['fck']===0?'':'C'+CARACTERISTICAS['fck'])
    const [fyk,setFyk] = useState(CARACTERISTICAS['fyk']===0?'':'CA'+CARACTERISTICAS['fyk']/10)
    const [alturaSecao,setAlturasecao]= useState((CARACTERISTICAS['h']===0)?'':CARACTERISTICAS['h'].toString().replace('.',','))
    //const [diametromax,setDiametromax] = useState('')
    const [bw,setBw] = useState(CARACTERISTICAS['bw']===0?'':CARACTERISTICAS['bw'].toString().replace('.',','))
    const [diametroL,setDiametroL] = useState(CARACTERISTICAS['dL']===0?'':CARACTERISTICAS['dL'].toString().replace('.',','))
    const [bitolaT, setBitolaT] = useState(CARACTERISTICAS['dT']===0?'':CARACTERISTICAS['dT'].toString().replace('.',','))
    const [fykt, setFykt] = useState(CARACTERISTICAS['fykt']===0?'':'CA'+CARACTERISTICAS['fykt']/10)
    const [classeAmbiental, setClasseambiental] = useState(CARACTERISTICAS['classeambiental']===0?'':CARACTERISTICAS['classeambiental'])
    const [alerta,setAlerta] = useState(false)
    const [sucesso, setSucesso] = useState(false)
    const [mensagem, setMensagem] = useState('')
    const [agregado,setAgregado] = useState(CARACTERISTICAS['agregado']===0?'':CARACTERISTICAS['agregado'])
    const [dmax,setDmax] = useState(CARACTERISTICAS['dmax']===0?'':diametroparabrita[CARACTERISTICAS['dmax']])
    const [ductilidade,setDuctilidade] = useState((CARACTERISTICAS['ductilidade']===0?true:CARACTERISTICAS['ductilidade']))
    const [open,setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false);
      };

    const Naocontinuar = () => {
        setOpen(false)
        setDuctilidade(true)
      };

    const caracteristcas = (event)=>{
        event.preventDefault()

        let buginfernal = alerta //o setAlert nao funciona, nao adianta
        let temp = 0

        for(let i of [alturaSecao,bw,diametroL,bitolaT,classeAmbiental]){
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


        for(let i of [alturaSecao,bw,diametroL,bitolaT]){
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

        if(parseFloat(bw.replace(',','.'))<12){
            setAlerta(true)
            buginfernal = true
            setMensagem('A NBR6118:2014 limita o tamanho mínimo de comprimentos de vigas a 12 cm')
        }


        if (!buginfernal){

            //dmax:parseFloat(diametromax.replace(',','.')),


            const item = {
                fck:ClasseConcreto[fck],
                fyk:ClasseAço[fyk],
                h:parseFloat(alturaSecao.replace(',','.')),
                agregado:agregado,
                bw:parseFloat(bw.replace(',','.')),
                dL:parseFloat(diametroL.replace(',','.')),
                dT: parseFloat(bitolaT.replace(',','.')),
                fykt: ClasseAço[fykt],
                dmax:Britas[dmax],
                classeambiental:classeAmbiental,
                ductilidade:ductilidade
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
                        <AlertTitle >Seção Cadastrada com Sucesso</AlertTitle>
                        </Alert>
                </Collapse>
            </Box>
        
            <Grid container spacing={4}>
                <Grid item>
                    <Box className='Seção Transversal' >
                    <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                        <p style={{fontSize:25,fontFamily:'Helvetica,Arial', border:1}}>Seção Transversal</p>
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <item>
                                    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                                    <FormControl>
                                            <InputLabel>Classe de Concreto</InputLabel>
                                            <Select 
                                            value={fck} 
                                            onChange={(event) =>{event.preventDefault();return setFck(event.target.value)}} 
                                            label="Classe de Concreto" 
                                            variant="outlined"  
                                            sx={{backgroundColor:'white'}}>
                                                {Object.keys(ClasseConcreto).map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                            </Select> 
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel>Classe de Aço</InputLabel>
                                            <Select 
                                            value={fyk} 
                                            onChange={(event) =>{event.preventDefault();return setFyk(event.target.value)}} 
                                            label="Classe de Aço" 
                                            variant="outlined"
                                            sx={{backgroundColor:'white'}}>
                                                {Object.keys(ClasseAço).map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                            </Select> 
                                        </FormControl>

                                    </Box>
                                    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">

                                        <TextField 
                                        value={alturaSecao} 
                                        onChange={(event) =>{event.preventDefault();return setAlturasecao(event.target.value)}} 
                                        label="Altura da seção" 
                                        variant="outlined"
                                        error={erro(alturaSecao,'numeros')}
                                        helperText = {erro(alturaSecao,'numeros')?'Insira somente números':''}
                                        sx={{backgroundColor:'white'}}/>
                                        <FormControl>
                                            <InputLabel>Natureza do Agregado</InputLabel>
                                            <Select 
                                            value={agregado} 
                                            onChange={(event) =>{event.preventDefault();return setAgregado(event.target.value)}} 
                                            label="Natureza do Agregado"
                                            variant="outlined"
                                            sx={{backgroundColor:'white'}}>
                                                {NomesAgregados.map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                            </Select> 
                                        </FormControl>
                                    </Box>
                                    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">

                                        <TextField 
                                        value={bw} 
                                        onChange={(event) =>{event.preventDefault();return setBw(event.target.value)}} 
                                        label="Largura da seção " 
                                        variant="outlined"
                                        error={erro(bw,'numeros')}
                                        helperText = {erro(bw,'numeros')?'Insira somente números':''}
                                        sx={{backgroundColor:'white'}}/>

                                        <TextField  
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
                        </Grid>
                    </Paper>
                    </Box>
                </Grid>
                <Grid item >
                    <Box className='Armadura Transversal' >
                        <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                        <p style={{fontSize:25}}>Armadura Transversal</p>
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{marginLeft:0.25}}>
                            <Grid>
                                <item>
                                        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">
                                            <FormControl>
                                                <InputLabel>Classe de Aço</InputLabel>
                                                <Select 
                                                value={fykt} 
                                                onChange={(event) =>{event.preventDefault();return setFykt(event.target.value)}} 
                                                label="Classe de Aço" 
                                                variant="outlined"
                                                sx={{backgroundColor:'white'}}>
                                                    {Object.keys(ClasseAço).map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                                </Select> 
                                            </FormControl>
                                        </Box>
                                        
                                        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">
                                            <TextField 
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
                <Grid item>
                    <Box className='Agressividade Ambiental' >
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
                            <FormControl>
                                    <InputLabel>Diâmetro máximo de Agregado</InputLabel>
                                    <Select
                                    value={dmax}
                                    label='Diâmetro máximo de Agregado'
                                    variant="outlined"
                                    sx={{backgroundColor:'white'}}
                                    onChange={(event) =>{event.preventDefault();return setDmax(event.target.value)}} 
                                        >
                                    {Object.keys(Britas).map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                    </Select>
                            </FormControl>
                            </Box>
                            
                            </Grid>
                        </Grid>
                        </Paper>
                    </Box>
                    
                </Grid>
                <Grid item >
                    <Box className='Opções de Dimensionamento' >
                        <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                        <p style={{fontSize:25}}>Opções de Dimensionamento</p>
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{marginLeft:0.25}}>
                            <Grid>
                                <item>
                                    
                              
                                    <FormControlLabel
                                        label="Garantir Ductilidade"
                                        control={<Checkbox checked={ductilidade} onChange={(event)=>{
                                            setOpen(!event.target.checked)
                                            return setDuctilidade(event.target.checked)
                                        }}/>}
                                    />
                                    
                                    <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title" 
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">
                                        {"Não dimensionario seção dúctil?"}
                                        </DialogTitle>
                                        <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Não garantir a ducitidade fará com que a seção fique frági, descrumprindo normas
                                            e pondendo causar acidentes
                                        </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={Naocontinuar}>Não Continuar</Button>
                                        <Button onClick={handleClose} autoFocus>
                                            Continuar
                                        </Button>
                                        </DialogActions>
                                    </Dialog>

         
                                  
            
                                </item>
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