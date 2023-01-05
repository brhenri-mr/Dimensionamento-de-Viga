import React, { useState } from "react";
import { useSelector } from "react-redux";
//Material ui
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
//compoments
import Figura from "./Figura";
import Inputs_a from "../Inputs/Inputs_a";
import TabPanel from "../Inputs/Tabpanel";
import { Paper } from "@mui/material";
import LayoutCadastro from "./LayoutCadastro";

const Layout = () => {

    const APOIOS = useSelector(state => state.apoiosReducers.APOIOS)
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    console.log(APOIOS)

    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        borderStyle: 'none',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

    return(
        <div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={ handleChange} aria-label="basic tabs example">
                    <Tab label="Geometria"  />
                    <Tab label="Carregamento"  />
                    <Tab label="Material"  />
                </Tabs>
                </Box>
            </Box>
            <Box>
            <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Item>
                            <Inputs_a></Inputs_a>
                            {APOIOS.map((el,index)=>{return  <LayoutCadastro key={index} value={el} index={index}></LayoutCadastro>})}
                        </Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>
                            <Figura apoios={APOIOS}></Figura>
                        </Item>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                Carregamentos
                <Figura apoios={APOIOS}></Figura>
            </TabPanel>
            <TabPanel value={value} index={2}>
                Material
            </TabPanel>
            </Box>
        </div>
    )
}

export default Layout