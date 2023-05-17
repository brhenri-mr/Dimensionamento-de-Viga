import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


function createData(tipo,valor) {
  return { tipo,valor};
}

const rows = [
  createData('Frozen yoghurt', 159 ),
  createData('Ice cream sandwich'),
  createData('Eclair',14),
  createData('Cupcake',12),
  createData('Gingerbread', 356),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 'auto' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">tipo</TableCell>
            <TableCell align="right">valor</TableCell>
            <TableCell align="right">açao</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,index) => (
            <TableRow
              key={row.name}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell >{row.tipo}</TableCell>
              <TableCell >{row.valor}</TableCell>
              <IconButton aria-label="delete" onClick={()=>{console.log(index)}}>
                <DeleteIcon />
              </IconButton>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}