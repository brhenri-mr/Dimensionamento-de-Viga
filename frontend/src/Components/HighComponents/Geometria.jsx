import React from "react";
import LayoutCadastro from "./LayoutCadastro";
import InputBarra from "../Inputs/InputBarra";
import Inputs_a from "../Inputs/Inputs_a";
//material ui
import { Box } from "@mui/system"
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

//

const Geometria = (props) =>{

    return (
    <>
     <Grid container spacing={4}>
        <Grid item xs={8.9}>
        <Box className='Geometria'>
            <Paper elevation={3} sx={{paddingBottom:3,paddingLeft:3,paddingRight:'25rem',border:'1px solid #2d383a', backgroundColor:'#FBFAFA'}}>
                <p style={{fontSize:25,fontFamily:'Helvetica,Arial', border:1}}>Geometria</p>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                    <item>
                    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                        <InputBarra/>
                    </Box>
                    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch' }}}noValidate autoComplete="off" >
                    <Inputs_a></Inputs_a>
                    </Box>
                    </item>
                    </Grid>
                </Grid>
            </Paper>
        </Box>

            <LayoutCadastro Apoios= {props.APOIOS} label={['Tipo','Posição','Ação']} rotulos={['tipo','value']}></LayoutCadastro>
        </Grid>
        </Grid>
    </>
        )
}


export default Geometria