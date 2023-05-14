import React from "react";
import LayoutCadastro from "./LayoutCadastro";
import InputBarra from "../Inputs/InputBarra";
import Inputs_a from "../Inputs/Inputs_a";
//material ui
import { Box } from "@mui/system"
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
                    {props.APOIOS.map((el,index)=>{return  <LayoutCadastro key={index} value={el} index={index}></LayoutCadastro>})}
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


export default Geometria