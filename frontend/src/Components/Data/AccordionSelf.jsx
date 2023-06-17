import React, { useState } from "react";
//material ui
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Discretizacao from "../SVG/Discretizacao";
import { useSelector } from "react-redux";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from "../Inputs/Tabpanel"
//componentes 
import EqMath from "../test/EqMath";


const AccordionSelf = (props)=>{


    const CARACTERISTICAS = useSelector(state =>state.caracteristicasReducers.CARACTERISTICAS)

    const [verificador,setVerificador] = useState(false)
    const [value, setValue] = useState(0)

    
    const multiplaspaginas = (texto,label) =>{

        const handleChange = (event, newValue) => {
            setValue(newValue);
          };
        

        const quantidade = texto.length/2

    
        if(quantidade>1 && !label.includes('ignorar')){
            return (
                <>
                    <Tabs
                    value={value} 
                    onChange={ handleChange} 
                    aria-label="basic tabs example" 
                    sx={{ borderRight: 1, borderColor: 'divider'}}>
                        {label.map((valor,index)=>{
                            return <Tab label={valor} key={index} sx={{fontWeight: 'bold'}} />})}
                    </Tabs>
                    {[...Array(quantidade).keys()].map((valor,index)=>{
                        return <TabPanel value={value} index={valor} key={index}>
                                    <AccordionDetails sx={{height:'',fontFamily: 'Helvetica'}}>
                                        {texto.slice((0+valor)*2,(valor*2+2)).map((item,index) => {return <EqMath key={index} text={item} controle={false}></EqMath>})}
                                    </AccordionDetails>
                                </TabPanel>
                    })}
                </>
        )
        }
        else if(label.includes('Discretização')){
            return(
                <>
                <Grid container>
                    <Grid xs={6}>
                        <AccordionDetails sx={{height:'',fontFamily: 'Helvetica'}}>
                            {texto.map((item,index) => {return <EqMath key={index} text={item} controle={false}></EqMath>})}
                        </AccordionDetails>
                    </Grid>
                    <Grid xs={6}>
                    <svg style={{ width:"40rem",height:"25rem"}}>
                        <text>Corte A</text>
                            <Discretizacao 
                            h={CARACTERISTICAS['h']} 
                            bw={CARACTERISTICAS['bw']} 
                            cnom={props.dimensionamento["Parametros"]["Cobrimento"]} 
                            bitolaT={CARACTERISTICAS["dT"]} 
                            barras={props.dimensionamento["Discretizacao"]["Barras calculadas"].slice(-1)} 
                            av={props.dimensionamento["Parametros"]["av"]}
                            ah={props.dimensionamento["Parametros"]["ah"]} 
                            bitola={CARACTERISTICAS["dL"]} 
                            limite={props.dimensionamento["Discretizacao"]["Barras por camada"].slice(-1)[0]}
                            momento = {props.dimensionamento["Verificacao Momento"]["Momento de Calculo"].slice(-1)[0]*-props.dimensionamento["Verificacao Momento"]["Sinal"]}
                            ></Discretizacao>
                        </svg>
                    </Grid>
                </Grid>
                </>
            )

        }
        else{
            return(
            <AccordionDetails sx={{height:'',fontFamily: 'Helvetica'}}>
                {texto.map((item,index) => {return <EqMath key={index} text={item} controle={false}></EqMath>})}
            </AccordionDetails>
            )
        }

    }


    if(props.text[0].includes('ignorar')){
        return <></>
    }
    else{

    
        return(
            <Accordion >
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                onClick={()=>{setVerificador(!verificador)}}
                >
                    <Typography sx={{fontWeight: (verificador)?'bold':'normal',fontSize:'18px', fontFamily:"Computer Modern"}}>
                        <EqMath text={props.label} controle={true}></EqMath>
                        </Typography>
                </AccordionSummary>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        {multiplaspaginas(props.text,props.labesecundario)}
                    </Grid>
                </Grid>
                
        </Accordion>
        )
    }
}

export default AccordionSelf