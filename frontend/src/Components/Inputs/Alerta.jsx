import React, { useState } from "react";
import Alert from '@mui/material/Alert';
import { AlertTitle } from "@mui/material";
import Collapse from '@mui/material/Collapse';

const Alerta =(props)=>{
    const [interno, setInterno] = useState(props.value)
    console.log('por aqui')
    console.log(interno)
    return(
        <>
        <Collapse in={interno}>
        <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            This is a warning alert — <strong>check it out!</strong>
        </Alert>
      </Collapse>
      </>
    )
}


export default Alerta