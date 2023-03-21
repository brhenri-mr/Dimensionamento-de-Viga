
import React from "react";
//Material UI
import { Box } from "@mui/system"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';


const Secao  = (props)=> {
    return(
        <>
        <Box Class='Seção Transversal' sx={{width:'170%',border:'1px solid #2d383a'}}>
        <Paper elevation={3} sx={{width:'auto'+30,paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
        <p style={{fontSize:25}}>Seção Transversal</p>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid>
                    <item>
                        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off">
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
                <Grid item xs={0} md={0}>
                    <item>
                        <svg width="200" height="200">
                            <rect width="200" height="200" />
                            <circle cx="170" cy="170" r="10" stroke="black" stroke-width="3" fill="red" />
                            <circle cx="30" cy="170" r="10" stroke="black" stroke-width="3" fill="red" />
                        </svg>
                    </item>
                </Grid>
            </Grid>
        </Paper>
        </Box>
        <Box Class='Agressividade Ambiental' sx={{paddingTop:4}}>
            <Paper elevation={3} sx={{width:'auto'+30,paddingBottom:3,paddingLeft:3,paddingRight:3,border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
            <p style={{fontSize:25}}>Agressividade Ambiental</p>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
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
        </>
    )
}

export default Secao