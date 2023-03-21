import React, { useState } from "react";
import { useSelector } from "react-redux";
//Material ui
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
//compoments
import Figura from "./Figura";
import Inputs_a from "../Inputs/Inputs_a";
import TabPanel from "../Inputs/Tabpanel";
import LayoutCadastro from "./LayoutCadastro";
import InputCar from "../Inputs/InputCar";
import InputBarra from "../Inputs/InputBarra";
import Secao from "./Secao";

const Layout = () => {

    //useSelector
    const APOIOS = useSelector(state => state.botoesReducers.APOIOS)
    const BARRA = useSelector(state => state.barraReducers.BARRA)
    const CARREGAMENTOS = useSelector(state => state.botoesReducers.CARREGAMENTOS)


    //useState
    const [value, setValue] = useState(0)
    const [patter,setPatter] = useState()
    const [describe, setDescribe] = useState()

    console.log(CARREGAMENTOS)


    //test

    const [comb, setComb] = useState([])

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    const testclick =(data) => {
        console.log(...data)
        fetch('http://127.0.0.1:8000/api/test', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({carregamento:data}),
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    setComb(data)

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
    }

    const Item = styled('div')(({ theme }) => ({
        ...theme.typography.body2,
        borderStyle: 'none',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

    return(
        <div>
            <Box sx={{ width: '100%'}}>
                <Box sx={{ display: 'flex',borderBottom: 1, borderColor: 'divider',flexGrow: 1}}>
                    <Box sx={{backgroundColor:'#D9D9D9'}}>
                    <Tabs 
                        value={value} 
                        onChange={ handleChange} 
                        aria-label="basic tabs example" 
                        orientation="vertical"
                        sx={{ borderRight: 1, borderColor: 'divider'}}>
                        <Tab label="Viga"  />
                        <Tab label="Carregamento"  />
                        <Tab label="Seção" />
                        <Tab label="Resultados"  />
                    </Tabs>
                </Box>

            <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <InputBarra/>
                        <Item>
                            <Inputs_a></Inputs_a>
                            {APOIOS.map((el,index)=>{return  <LayoutCadastro key={index} value={el} index={index}></LayoutCadastro>})}
                        </Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>
                            <Figura apoios={APOIOS} barra={BARRA} carregamentos={CARREGAMENTOS} ></Figura>
                        </Item>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <InputCar
                patter={patter}
                patterChange={event =>{event.preventDefault();return setPatter(event.target.value)}}
                describe={describe}
                describeChange={event =>{event.preventDefault();return setDescribe(event.target.value)}}
                />
                <Figura apoios={APOIOS} barra={BARRA} carregamentos={CARREGAMENTOS} ></Figura>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Secao></Secao>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Button onClick={(event)=> {event.preventDefault(); return testclick(CARREGAMENTOS)}}>Api</Button>
                {comb.map((el,index)=>{return <p key={index}>{`Combinação ${index+1}: ${el.replaceAll('*','x')}`}</p>})}
            </TabPanel>
            </Box>
        </Box>
        </div>
    )
}

export default Layout