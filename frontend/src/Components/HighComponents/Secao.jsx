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

    const caracteristcas = (event)=>{
        event.preventDefault()
        const item = {
            fck:parseInt(fck),
            fyk:parseInt(fyk),
            h:parseFloat(alturaSecao),
            dmax:parseFloat(diametromax),
            bw:parseFloat(bw),
            dL:parseFloat(diametroL),
            dT: parseFloat(bitolaT),
            fykt: parseFloat(fykt),
            classeambiental:classeAmbiental
        }

        dispatch(actions.adicionar(item))
    }


    return(
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
                                    sx={{backgroundColor:'white'} }/>

                                    <TextField id="outlined-basic" 
                                    value={fyk} 
                                    onChange={(event) =>{event.preventDefault();return setFyk(event.target.value)}} 
                                    label="Resistência característica ao escomento [MPa]" 
                                    variant="outlined" 
                                    sx={{backgroundColor:'white'}}/>

                                </Box>
                                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">

                                    <TextField 
                                    id="outlined-basic" 
                                    value={alturaSecao} 
                                    onChange={(event) =>{event.preventDefault();return setAlturasecao(event.target.value)}} 
                                    label="Altura da seção" 
                                    variant="outlined"  
                                    sx={{backgroundColor:'white'}}/>

                                    <TextField 
                                    id="outlined-basic"
                                    value={diametromax} 
                                    onChange={(event) =>{event.preventDefault();return setDiametromax(event.target.value)}} 
                                    label="Diâmetro máximo do agregado"
                                    variant="outlined"  
                                    sx={{backgroundColor:'white'}}/>

                                </Box>
                                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">

                                    <TextField 
                                    id="outlined-basic" 
                                    value={bw} 
                                    onChange={(event) =>{event.preventDefault();return setBw(event.target.value)}} 
                                    label="Largura comprimida " 
                                    variant="outlined"  
                                    sx={{backgroundColor:'white'}}/>

                                    <TextField 
                                    id="outlined-basic" 
                                    value={diametroL} 
                                    onChange={(event) =>{event.preventDefault();return setDiametroL(event.target.value)}} 
                                    label="Diâmetro das Armaduras Logitudinais" 
                                    variant="outlined" 
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
    )
}

export default Secao