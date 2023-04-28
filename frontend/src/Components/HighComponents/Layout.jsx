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
import Resultados from "./Resultados";
//redux
import { useDispatch } from "react-redux";
import { actions } from "../../Actions/Carregamento";



const Layout = () => {

    //useSelector
    const APOIOS = useSelector(state => state.botoesReducers.APOIOS)
    const BARRA = useSelector(state => state.barraReducers.BARRA)
    const CARREGAMENTOS = useSelector(state => state.botoesReducers.CARREGAMENTOS)
    const CARACTERISTICAS = useSelector(state =>state.caracteristicasReducers.CARACTERISTICAS)
    const ED = useSelector(state => state.botoesReducers.ED)


    //useState
    const [value, setValue] = useState(0)
    const [patter,setPatter] = useState()
    const [describe, setDescribe] = useState()
    const [metRigidez, setMetrigidez] = useState({})

    //dispatch
    const dispatch = useDispatch()

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    //Fetch
    const Combinacoes =(data,ed) => {
        console.log(...data)
        fetch('http://127.0.0.1:8000/api/Combinacoes', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({carregamento:data,ed:ed}),
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    dispatch(actions.adicionar_comb(data))
                    console.log(CARREGAMENTOS)

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
    }
    //API metodo da rigidez direta
    const MetRigidez=(data,apoios) => {

        const enviar = {carregamento:data, apoios:apoios, comprimento:BARRA}


        fetch('http://127.0.0.1:8000/api/MetRigidez', {

        
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(enviar),
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    setMetrigidez(data)

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
    }

     //API metodo da rigidez direta
     const Dimensionamento=(data) => {


        fetch('http://127.0.0.1:8000/api/Dimensionamento', {

        
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...data}),
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    setMetrigidez(data)

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
                    <Box sx={{backgroundColor:'#D9D9D9',}}>
                        <Tabs 
                            value={value} 
                            onChange={ handleChange} 
                            aria-label="basic tabs example" 
                            orientation="vertical"
                            sx={{ borderRight: 1, borderColor: 'divider'}}>
                            <Tab label="Viga" sx={{fontWeight: 'bold'}} />
                            <Tab label="Carregamento"  sx={{fontWeight: 'bold'}}/>
                            <Tab label="Seção" sx={{fontWeight: 'bold'}}/>
                            <Tab label="Resultados" sx={{fontWeight: 'bold'}} />
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
                <Grid container spacing={{xs:2}}>
                    <Grid item xs={7.5}>
                        <InputCar
                        patter={patter}
                        patterChange={event =>{event.preventDefault();return setPatter(event.target.value)}}
                        describe={describe}
                        describeChange={event =>{event.preventDefault();return setDescribe(event.target.value)}}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Figura apoios={APOIOS} barra={BARRA} carregamentos={CARREGAMENTOS} ></Figura>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Secao></Secao>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Resultados apoios={APOIOS} barra={BARRA} metrigidez = {metRigidez}/>
                <Button onClick={(event)=> {event.preventDefault(); return Combinacoes(CARREGAMENTOS,ED)}}>Api</Button>
                <Button onClick={(event)=> {event.preventDefault(); return MetRigidez(CARREGAMENTOS,APOIOS)}}>MetRigidez</Button>
                <Button onClick={(event)=> {event.preventDefault(); return Dimensionamento(CARACTERISTICAS)}}>Dimensionamento</Button>
            </TabPanel>
            </Box>
        </Box>
        </div>
    )
}

export default Layout