import { Box } from "@mui/system";
import React from "react";
import cartesiano from './cartesiano.jpg'

const SecaoTransversal =(props) => {

    const x = 100
    const h = 100

    return(
        <>
            <Box sx={{backgroundImage: `url(${cartesiano})`, border: '2px solid black'}}>
                <svg>
                    <rect width={x} height={h} x={155-x/2} y={80-h/2} style={{fill:'#D9D9D9',strokeWidth:1.2,stroke:'rgb(0,0,0)'}}/>
                </svg> 
            </Box>
        </>
    )
}

export default SecaoTransversal

///<Box border={'2px solid black'} sx={{width:'100%'}}>
///<img src={cartesiano} alt="Plano Cartesiano" height={210}/>
///</Box>