import React from "react";
//Material ui
import { styled } from '@mui/material/styles';
import { Paper } from "@mui/material";


const EstiloCadastro = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  
export default EstiloCadastro