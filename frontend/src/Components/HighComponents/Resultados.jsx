import React from "react";
//Material ui
import AccordionSelf from "../Data/AccordionSelf";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
//Componente
import DiagramaCortante from "../SVG/DiagramaCortante";
import DiagramaMomento from "../SVG/DiagramaMomento";


function textotentativa(db,caso,caracteristicas){

    const verificacaoadm = (db['Verificacao Linha Neutra']['Aviso'][0]) ?'Linha neutra verificada':'Linha Neutra não verifica' //Há uma bug possivel, que a so uma valor de aviso, e nao para cadqa teste

    const eqmomentomax = (caracteristicas['fck']>50)? `\\(M_{máx} = \\zeta \\ b_w \\ {d}^2(0,1275-0,0153 \\zeta)\\dfrac{1-(fck[MPa] - 50)}{200}f_{cd} = ${db['Parametros']['zeta']}\\ ${caracteristicas['bw']}^2 \\ (0,1275-0,0153\\ ${db['Parametros']['zeta'].toFixed(2).toString().replace('.',',')}) \\dfrac{1-(${caracteristicas['fck']}-50)}{200} \\ ${(caracteristicas['fck']/14).toFixed(2).toString().replace('.',',')} = ${db['Verificacao Momento']['Momento Maximo'][caso].toFixed(2).toString().replace('.',',')}\\ kN.cm\\)`:`\\(M_{máx} = 0,153\\ b_w d^2 f_{cd} = 0,153\\ ${caracteristicas['bw']}\\ ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')}^2 \\ ${(caracteristicas['fck']/14).toFixed(2).toString().replace('.',',')} = ${db['Verificacao Momento']['Momento Maximo'][caso].toFixed(2).replace('.',',')}\\ kN.cm \\) `

    return  {
        ConstantesNBR6118:{
            titulo: 'Parametros NBR6118:2014 ',
            texto:[
                'Parametros estabelecidos pela NBR6118:',
                (caracteristicas['fck']>50) ?`\\(\\zeta= 0,8-\\dfrac{f_{ck}[MPa]-50}{400} \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,8 - \\dfrac{${caracteristicas['fck']}-50}{400} = ${db['Parametros']['zeta']}\\)`:`\\(\\zeta= 0,8\\ para \\ concreto \\ até \\ C50\\)`,
                'Parametros estabelecidos pela NBR6118:',
                (caracteristicas['fck']>50) ? `\\(\\eta_c = 0,85\\dfrac{f_{ck}[MPa]-50}{200} \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,85 \\dfrac{${caracteristicas['fck']}-50}{200}= ${db['Parametros']['eta'].toString().replace('.',',')} \\)`:`\\(\\eta_c = 0,85\\ para \\ concreto \\ até \\ C50\\) `,
                'Parametros estabelecidos pela NBR6118:',
                (caracteristicas['fck']>50) ? `\\(\\epsilon_{cu} = 0,0026+0,035{\\left(\\dfrac{90-fck[MPa]}{100}\\right)}^4 \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,0026+0,035{\\left(\\dfrac{90-${caracteristicas['fck']}}{100}\\right)}^4\\)`:`\\(\\epsilon_{cu} = 3,5‰ \\ para \\ concreto \\ até \\ C50 \\)`
            ],
            label:['ζ','ηc','εcu']
        },
        Momento:{
            titulo: `Msd = ${db['Verificacao Momento']['Momento de Calculo'][caso].toFixed(2).toString().replace('.',',')} kN`,
            texto:['Verifique os momentos mínimos:',
            `Mmín = 0,8 W0 fcktsup = 0,8x${db['Parametros']['w0'].toFixed(2).replace('.',',')}x${db['Parametros']['fcktsup'].toFixed(2).replace('.',',')} = ${db['Verificacao Momento']['Momento Minimo'][caso].toFixed(2).replace('.',',')} kN.cm`,
            'Verifique o momento máximo',
            eqmomentomax,
        ],
        label:['Mmín','Mmáx']
        },
        DiscretizacaoInicial:{
            titulo: `ys = ${db['Altura Util']['ys'][caso].toFixed(2).replace('.',',')} cm`,
            texto:[''],
            label:['']

        },
        Altura_Util:{
            titulo:`d = ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')} cm`,
            texto:['Substitua os valores na equação',`\\(d = h-c_{nom}-\\phi_T-ys = ${caracteristicas['h']} - ${db['Parametros']['Cobrimento']} - ${caracteristicas['dT'].toString().replace('.',',')} - ${db['Altura Util']['ys'][caso].toFixed(2).replace('.',',')} = ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')} cm\\)`],
            label:['']
        },
        Admensionais:{
            titulo: `bx = ${db['Admensionais'][caso][0].toFixed(2).replace('.',',')}, by = ${db['Admensionais'][caso][1].toFixed(2).replace('.',',')}, bs = ${db['Admensionais'][caso][2].toFixed(2).replace('.',',')}`,
            texto:[
                'Substitua os valores na equação',
                `bx=1/ζ-1/ζ`,
                'Substitua os valores na equação',
                `bz = 1-0,5ζbx = 1-${db['Parametros']['zeta']}x${db['Admensionais'][caso][0].toFixed(2).replace('.',',')} = ${db['Admensionais'][caso][0].toFixed(2).replace('.',',')}`,
                'Substitua os valores na equação',
                `bs = Es/fyd((1-bx)/bx)εcu ≤ 1 -> bs =200/${(caracteristicas['fyk']/11.5).toFixed(2).toString().replace('.',',')}x((1-${db['Admensionais'][caso][0].toFixed(2).replace('.',',')})/${db['Admensionais'][caso][0].toFixed(2).replace('.',',')})x${db['Parametros']['ecu'].toString().replace('.',',')}) ≤ 1 -> bs = ${db['Admensionais'][caso][2].toFixed(2).replace('.',',')}`
            ],
            label:['bx','bz','bs']

        },
        AreaAcoCalculada:{
            titulo: `Ascalc = ${db['Area']['Area Necessaria'][caso].toFixed(2).replace('.',',')} cm²` ,
            texto:['Substitua os valores na equação:',`\\(A_s = \\dfrac{M_{rdw}}{\\beta_{z}d} \\dfrac{1}{\\beta_s f_yd} = \\dfrac{${db['Verificacao Momento']['Momento de Calculo'][caso]}}{${db['Admensionais'][caso][1].toFixed(2).replace('.',',')} \\ ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')}}\\dfrac{1}{${db['Admensionais'][caso][2].toFixed(2).replace('.',',')} \\ ${caracteristicas['fyk']/10}} =  ${db['Area']['Area Necessaria'][caso].toFixed(2).replace('.',',')}\\ cm^2\\)`],
            label:['']

        },
        VerificacaoAreaAco:{
            titulo: 'Verificação aço',
            texto:[''],
            label:['']

        },
        AreaAcoEfetiva:{
            titulo: `Asef = ${db['Area']['Area Efetiva'][caso].toFixed(2).replace('.',',')} cm²`,
            texto:['Substitua os valores na equação:'],
            label:['']
        },
        Discretizacao:{
            titulo: 'Discretização',
            texto:['Substitua os valores na equação:',`n = (Asef 4)/(pi bitolaL^2) = (${db['Area']['Area Efetiva'][caso].toFixed(2).replace('.',',')}x4)/(pi x ${caracteristicas['dL'].toString().replace('.',',')}) = ${db['Discretizacao']['Barras totais'][caso]} barras`],
            label:['']

        },
        VerificacaoAdmensionais:{
            titulo: verificacaoadm ,
            texto:[''],
            label:['']

        },
    }
}



const Resultados = (props)=>{


    console.log(props.caracteristicas)

    let acoordeao = {}
    try {
        console.log(props.dimensionamento)
        acoordeao = textotentativa(props.dimensionamento,props.dimensionamento['Altura Util']['ys'].length-1,props.caracteristicas)
        
    } catch (error) {
        console.log(error)
    }
    
    console.log(acoordeao)

    return(
        <div >
        <Grid container spacing={4}>
            <Grid xs={6}>
                <Box>
                    <DiagramaCortante barra={props.barra} apoios={props.apoios} metrigidez={props.metrigidez}></DiagramaCortante>

                </Box>
            </Grid>
            <Grid xs={6}>
                <Box>
                    <DiagramaMomento barra={props.barra} apoios={props.apoios} metrigidez={props.metrigidez}></DiagramaMomento>
                </Box>
            </Grid>
        </Grid>
        {Object.keys(acoordeao).map((valor,indice)=>{
            try{
                return <AccordionSelf label={acoordeao[valor]['titulo']} text={acoordeao[valor]['texto']} labesecundario={acoordeao[valor]["label"]}></AccordionSelf>
            }
            catch{
                return <div/>
            }
            
        })}
        </div>
    )
}



export default Resultados