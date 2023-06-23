import React, { useState } from "react";
//Material ui
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Alert, Collapse } from "@mui/material";
//compoments
import Figura from "./Figura";
import TabPanel from "../Inputs/Tabpanel";
import InputCar from "../Inputs/InputCar";
import Secao from "./Secao";
import Resultados from "./Resultados";
import Geometria from "./Geometria";
import LayoutCadastro from "./LayoutCadastro";
import CircularProgress from '@mui/material/CircularProgress';
//redux
import { useDispatch } from "react-redux";
import { actions } from "../../Actions/Carregamento";
import { actions as actionbarra} from "../../Actions/Momentomax";
import {actions as ACTIONScomb} from "../../Actions/Combinacoes";
import { useSelector } from "react-redux";





function estabilidaded(el){
    ///vetor com o tipo de apoios
    let restricao= 0
    let mensagem = ''

    const tipos = [0,0,0]

    for (let dicionario of el){
        if (dicionario['tipo']==="Apoio Simples"){
            restricao += 1
            tipos[0] = 1 + tipos[0]

        }
        else if (dicionario['tipo']==="Apoio Rotulado"){
            restricao += 2
            tipos[1] = 1 + tipos[1]
        }
        else if (dicionario['tipo']==="Apoio Engastado"){
            restricao += 3
            tipos[2] = 1 + tipos[2]
        }
    }

    if(tipos[0]===0 && tipos[1]===0 && tipos[2]===0){
        mensagem = 'Insira um Apoio'
    }

    else if (tipos[0]>1 && tipos[1]===0 && tipos[2]===0){
        mensagem = 'Estrutura Hipoestática'
    }
    else if (restricao<3){
        mensagem = 'Estrutura Hipoestática'
    }
    else if(restricao>3){
        mensagem = 'Estrutura Hiperestática'
    }
    else{
        mensagem = 'Estrutura Isoestática'
    }

    return [mensagem,restricao]
}



const Layout = () => {

    const desenvolvimento = false


    //useSelector
    const APOIOS = useSelector(state => state.botoesReducers.APOIOS)
    const BARRA = useSelector(state => state.barraReducers.BARRA)
    const CARREGAMENTOS = useSelector(state => state.botoesReducers.CARREGAMENTOS)
    const CARACTERISTICAS = useSelector(state =>state.caracteristicasReducers.CARACTERISTICAS)
    const ED = useSelector(state => state.botoesReducers.ED)
    const COMBINACOES = useSelector(state => state.barraReducers.COMB)
    const MOMENTOMAX = useSelector(state => state.barraReducers.MOMENTOMAX)
    console.log(CARACTERISTICAS)

    //useState
    const [value, setValue] = useState(0)
    const [patter,setPatter] = useState()
    const [describe, setDescribe] = useState()
    const [metRigidez, setMetrigidez] = useState({})
    const [dimensionamento, setDimensionamento] = useState({
        'Discretizacao':{
            'Barras por camada':[],
            'Barras calculadas':[]
        },
        Parametros:{
        Cobrimento:0,
        av:0,
        ah:0,
    }})
    const estabilidade = estabilidaded(APOIOS)

    //validarores
    const cadastrocompleto = (APOIOS.length!==0 && CARREGAMENTOS.length!==0 && BARRA!==0 && CARACTERISTICAS['fck'] !==0)

    //dispatch
    const dispatch = useDispatch()
    
    //Chamar as APIs
    async function handleChange (event, newValue) {
        
        if (newValue===3 && cadastrocompleto){
            await Combinacoes(CARREGAMENTOS,ED)
            await MetRigidez(CARREGAMENTOS,APOIOS,true)
            await Dimensionamento(CARACTERISTICAS,MOMENTOMAX)

            //metRigidez['Maximo'][1]
            

            
            
        }
        setValue(newValue);
      };
    
    //seleção da combinação
    if(COMBINACOES[1]){
        //Significa que mudou a combinação 
        MetRigidez(CARREGAMENTOS,APOIOS,false)
        dispatch(ACTIONScomb.atualizar(false))

    }


    //Combinacoes
    async function Combinacoes (data,ed) {
        await fetch((desenvolvimento)? "http://127.0.0.1:8000/api/Combinacoes":'https://zoomlunar.pythonanywhere.com/api/Combinacoes', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({carregamento:data,ed:ed}),
                })
                .then((response) => response.json())
                .then((data) => {
                    dispatch(actions.adicionar_comb(data))

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
    }

    //API metodo da rigidez direta
    async function MetRigidez(data,apoios,logico){
        const enviar = {
            carregamento:data, 
            apoios:apoios, 
            comprimento:BARRA, 
            fck:CARACTERISTICAS['fck'],
            agregado:CARACTERISTICAS['agregado'],
            MomentodeInercia:parseFloat(CARACTERISTICAS['bw'])*parseFloat(CARACTERISTICAS['h'])**3/12,
            combinacao: (logico)? 0:(COMBINACOES[0] ==='Envoltória')? 0:parseInt(COMBINACOES[0][COMBINACOES[0].length-1])
        }

        if(logico){
            const api = fetch((desenvolvimento)? "http://127.0.0.1:8000/api/MetRigidez":'https://zoomlunar.pythonanywhere.com/api/MetRigidez', {

        
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(enviar),
            })
            .then((response) => response.json())
            .then((data) => {
                setMetrigidez(data)
                dispatch(actionbarra.salvar(metRigidez['Maximo']))

            })
            .catch((error) => {
                console.error('Error:', error);
            });

            await api
        }
        else{
            await fetch((desenvolvimento)? "http://127.0.0.1:8000/api/MetRigidez":'https://zoomlunar.pythonanywhere.com/api/MetRigidez', {

        
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(enviar),
            })
            .then((response) => response.json())
            .then((data) => {
                setMetrigidez(data)

            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
       

    }

     //API Dimensionamento
     async function Dimensionamento(data,momentomax) {

        await fetch((desenvolvimento)? "http://127.0.0.1:8000/api/Dimensionamento":'https://zoomlunar.pythonanywhere.com/api/Dimensionamento', {

                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...data,momento:(momentomax===0)?metRigidez['Maximo'][1]:momentomax}),
                })
                .then((response) => response.json())
                .then((data) => {
                    setDimensionamento(data)

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
                    <Box sx={{backgroundColor:'#D9D9D9',height: '100vh'}}>
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
                        <Geometria APOIOS = {APOIOS}></Geometria>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>
                            <Collapse in={estabilidade[0] ==='Insira um Apoio'}>
                                <Alert severity="info">{estabilidade[0]}</Alert>
                            </Collapse>
                            <Collapse in={estabilidade[0] ==='Estrutura Hipoestática'}>
                                <Alert severity="warning">{estabilidade[0]}</Alert>
                            </Collapse>
                            <Collapse in={estabilidade[0] ==='Estrutura Isoestática' || estabilidade[0] ==='Estrutura Hiperestática'}>
                                <Alert>{estabilidade[0]}</Alert>
                            </Collapse>
                            <Figura apoios={APOIOS} barra={BARRA} carregamentos={CARREGAMENTOS} ignorar={true} ed={ED}></Figura>
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
                        <Figura apoios={APOIOS} barra={BARRA} carregamentos={CARREGAMENTOS} ignorar={false} ed={ED} ></Figura>
                        <LayoutCadastro Apoios={CARREGAMENTOS} label={['Nome','Tipo','Classificação','Descrição','Magnitude','Posição',"Ação"]} rotulos={['name','tipo','patter','describe','mag','pos']}></LayoutCadastro>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Secao></Secao>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Collapse in={cadastrocompleto}>
                    <Collapse in={Object.keys(dimensionamento).length===2}>
                        <CircularProgress />
                    </Collapse>
                    <Collapse in={!(Object.keys(dimensionamento).length===2)}>
                    <Resultados apoios={APOIOS} barra={BARRA} metrigidez = {metRigidez} dimensionamento={dimensionamento} caracteristicas = {CARACTERISTICAS}/>

                        

                       
                    </Collapse>
                </Collapse>
                <Collapse in={!cadastrocompleto}>
                    <Alert severity="error"> <strong>Faltam Cadastrar Informações</strong></Alert>
         
                </Collapse>
                
                
            </TabPanel>
          
            </Box>
        </Box>
        </div>
    )
}

export default Layout