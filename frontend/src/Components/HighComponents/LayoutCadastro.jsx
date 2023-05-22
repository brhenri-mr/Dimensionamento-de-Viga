import React from "react";
//Material ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Paper } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
//Redux
import { useDispatch } from "react-redux";
//compoments
import ItemCadastrado from "../Cadastro/ItemCadastrado";
import { actions as apoio} from "../../Actions/Apoios";
import { actions as carregamento } from "../../Actions/Carregamento";




const LayoutCadastro = (props)=>{

    const dispatch = useDispatch()

    let tamanho = (props.label.includes('Nome'))? 600:420
    let Apoios = (props.Apoios.length >0) ? props.Apoios: []

    return(
            <Box width={tamanho}>
                <TableContainer component={Paper} sx={{marginTop:3}}>
                    <Table   sx={{ minWidth: 'auto'}}>
                        <TableHead>
                        <TableRow sx={{backgroundColor:'#e9e9e9',}}>
                            {props.label.map((valor,key)=>{
                                return <TableCell align="center" sx={{padding:'4px 4px 4px 4px', fontWeight: 'bold'}}>{valor}</TableCell>
                            })}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {Apoios.map((row,index) => (
                            <TableRow sx={{backgroundColor: (index%2 !==0)?'#FBFAFA': '#ffffff' }}>
                                {props.rotulos.map((valor,key)=>{
                                    return <TableCell align="center" key={key}>{(row[valor]).length ===2 ? `${row[valor][0]}-${row[valor][1]}`:row[valor]}</TableCell>
                                })}
                                <IconButton aria-label="delete" onClick={()=>{dispatch((tamanho===600)? carregamento.remover(Apoios[index]):apoio.remover(Apoios[index]))}} >
                                    <DeleteIcon  />
                                </IconButton>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
            </Box>
    )
}

export default LayoutCadastro