
import React from "react";
//Material UI
import { Box } from "@mui/system"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
//Componentes
import SecaoTransversal from '../SVG/SecaoTransversal'

const Secao  = (props)=> {
    return(
        <>
        <Grid container spacing={4}>
            <Grid item >
                <Box Class='Seção Transversal' >
                <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                    <p style={{fontSize:25,fontFamily:'Helvetica,Arial', border:1}}>Seção Transversal</p>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <item>
                                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                                    <TextField id="outlined-basic" label="Resistência caracteristica a compressão" variant="outlined"  sx={{backgroundColor:'white'}}/>
                                    <TextField id="outlined-basic" label="Resistência característica ao escomento" variant="outlined" sx={{backgroundColor:'white'}}/>
                                </Box>
                                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">
                                    <TextField id="outlined-basic" label="Altura da seção" variant="outlined"  sx={{backgroundColor:'white'}}/>
                                    <TextField id="outlined-basic" label="Diâmetro máximo do agregado" variant="outlined"  sx={{backgroundColor:'white'}}/>
                                </Box>
                                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">
                                    <TextField id="outlined-basic" label="Largura comprimida " variant="outlined"  sx={{backgroundColor:'white'}}/>
                                    <TextField id="outlined-basic" label="Diâmetro das Armaduras Logitudinais" variant="outlined" sx={{backgroundColor:'white'}} />
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
            <Grid item xs={11.33}>
                <Box Class='Agressividade Ambiental' >
                    <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                    <p style={{fontSize:25}}>Agressividade Ambiental</p>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{marginLeft:0.25}}>
                        <Grid>
                            <item>
                                    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">
                                        <TextField id="outlined-basic" label="Resistência caracteristica a compressão" variant="outlined" sx={{backgroundColor:'white'}}/>
                                    </Box>
                                    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">
                                        <TextField id="outlined-basic" label="Altura da seção" variant="outlined" sx={{backgroundColor:'white'}}/>
                                    </Box>
                                    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }, }}noValidate autoComplete="off">
                                        <TextField id="outlined-basic" label="Largura comprimida " variant="outlined"  sx={{backgroundColor:'white'}}/>
                                    </Box>
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