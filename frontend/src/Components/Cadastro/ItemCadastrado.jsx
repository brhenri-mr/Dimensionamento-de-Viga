import React from "react";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';


const ItemCadastrado = (props) => {


    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));
      

    return(
        <>
            <Stack
            direction="column"
            spacing={{ xs: 1, sm: 2, md: 4 }}
            >
            </Stack>
            {Object.values(props.value).map((item,index)=>{
                return <Item key={index}>{item}</Item>
            })}   
      </>
    )
}


export default ItemCadastrado


