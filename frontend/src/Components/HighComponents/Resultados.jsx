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
                (caracteristicas['fck']>50) ? `\\(\\epsilon_{cu} = 0,0026+0,035{\\left(\\dfrac{90-fck[MPa]}{100}\\right)}^4 \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,0026+0,035{\\left(\\dfrac{90-${caracteristicas['fck']}}{100}\\right)}^4\\)`:`\\(\\epsilon_{cu} = 3,5‰ \\ para \\ concreto \\ até \\ C50 \\)`,
                'Parametros estabelecidos pela NBR6118 distância vertical entre armaduras:',
                `\\(a_v ≥ \\begin{cases} 2cm \\\\ \\phi_l\\\\ 0,5d_{max} \\\\
                \\end{cases} \\)`,
                'Parametros estabelecidos pela NBR6118 distância horizontal entre armaduras:',
                `\\(a_h ≥ \\begin{cases} 2cm \\\\ \\phi_l\\\\ 1,2d_{max} \\\\
                    \\end{cases} \\)`,
            ],
            label:['ζ','ηc','εcu','av','ah']
        },
        Momento:{
            titulo: `Msd = ${db['Verificacao Momento']['Momento de Calculo'][caso].toFixed(2).toString().replace('.',',')} kN`,
            texto:['Verifique os momentos mínimos:',
            `\\(M_{mín} = 0,8 W0 f_{ckt,sup} = 0,8\\ ${db['Parametros']['w0'].toFixed(2).replace('.',',')}\\ ${db['Parametros']['fcktsup'].toFixed(2).replace('.',',')} = ${db['Verificacao Momento']['Momento Minimo'][caso].toFixed(2).replace('.',',')}\\ kN.cm\\)`,
            'Verifique o momento máximo',
            eqmomentomax,
        ],
        label:['Mmín','Mmáx']
        },
        DiscretizacaoInicial:{
            titulo: `ys = ${db['Altura Util']['ys'][caso].toFixed(2).replace('.',',')} cm`,
            texto:[`Adota-se ${db['Discretizacao']['Barras totais'][caso]} barras. Substitua os valores na equação para barras de mesmo diâmetro`,`\\(ys = \\dfrac{\\sum_{i=1}^{j} n_i \\ ys_i}{n}, onde\\  ys_i = a_v+ \\phi_l \\)`],
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
                `\\(\\beta_x= \\dfrac{1}{\\zeta}-\\dfrac{1}{\\zeta} \\sqrt{1-\\dfrac{2\\ M_{rdw}}{\\eta_c b_w d^2 f_{cd}}} = \\dfrac{1}{${db['Parametros']['zeta'].toString().replace('.',',')}} - \\dfrac{1}{${db['Parametros']['zeta'].toString().replace('.',',')}} \\sqrt{1-\\dfrac{2 \\ ${db['Verificacao Momento']['Momento de Calculo'][caso].toFixed(2).toString().replace('.',',')}}{${db['Parametros']['eta']} \\ ${caracteristicas['bw']} \\ ${db['Altura Util']['Valor'][caso].toFixed(2).toString().replace('.',',')}^2 \\ ${(caracteristicas['fck']/14).toFixed(2).toString().replace(".",",")}}}\\)`,
                'Substitua os valores na equação',
                `\\(\\beta_z = 1-0,5\\zeta \\beta_x = 1-0,5\\ ${db['Parametros']['zeta']}\\ ${db['Admensionais'][caso][0].toFixed(2).replace('.',',')} = ${db['Admensionais'][caso][0].toFixed(2).replace('.',',')}\\)`,
                'Substitua os valores na equação',
                `\\(\\beta_s = \\dfrac{E_s}{f_{yd}} \\dfrac{1-\\beta_x}{\\beta_x} \\epsilon_{cu} ≤ 1 -> \\beta_s =\\dfrac{200}{${(caracteristicas['fyk']/11.5).toFixed(2).toString().replace('.',',')}} \\dfrac{1-${db['Admensionais'][caso][0].toFixed(2).toString().replace('.',',')}}{${db['Admensionais'][caso][0].toFixed(2).toString().replace('.',',')}}\\ ${db['Parametros']['ecu'].toString().replace('.',',')} ≤ 1 -> \\beta_s = ${db['Admensionais'][caso][2].toFixed(2).toString().replace('.',',')}\\)`
            ],
            label:['bx','bz','bs']

        },
        AreaAcoCalculada:{
            titulo: `Ascalc = ${db['Area']['Area Necessaria'][caso].toFixed(2).replace('.',',')} cm²` ,
            texto:['Substitua os valores na equação:',`\\(A_s = \\dfrac{M_{rdw}}{\\beta_{z}d} \\dfrac{1}{\\beta_s f_yd} = \\dfrac{${db['Verificacao Momento']['Momento de Calculo'][caso]}}{${db['Admensionais'][caso][1].toFixed(2).replace('.',',')} \\ ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')}}\\dfrac{1}{${db['Admensionais'][caso][2].toFixed(2).replace('.',',')} \\ ${caracteristicas['fyk']/10}} =  ${db['Area']['Area Necessaria'][caso].toFixed(2).toString().replace('.',',')}\\ cm^2\\)`],
            label:['']

        },
        VerificacaoAreaAco:{
            titulo: 'Verificação aço',
            texto:[''],
            label:['']

        },
        
        Discretizacao:{
            titulo: 'Discretização',
            texto:['Substitua os valores na equação:',`\\(n = \\left \\lceil{\\dfrac{A_{sef} \\ 4}{\\pi \\phi_l^2}} \\right \\rceil = \\left \\lceil{\\dfrac{${db['Area']['Area Efetiva'][caso].toFixed(2).toString().replace('.',',')}\\ 4}{\\pi \\ ${caracteristicas['dL'].toString().replace('.',',')}}}\\right \\rceil = ${db['Discretizacao']['Barras totais'][caso]} \\ barras \\)`],
            label:['']

        },
        AreaAcoEfetiva:{
            titulo: `Asef = ${db['Area']['Area Efetiva'][caso].toFixed(2).replace('.',',')} cm²`,
            texto:[
                'Substitua os valores na equação:',
                `\\(A_{sef} = n \\pi \\dfrac{\\phi_l^2}{4} = ${db['Discretizacao']['Barras totais'][caso]} \\pi \\dfrac{${caracteristicas['dL'].toString().replace('.',',')}^2}{4} \\)`,
            
            ],
            label:['']
        },
        VerificacaoAdmensionais:{
            titulo: verificacaoadm ,
            texto:[
                'O arredondamento da área de aço cálculada para área de aço efetiva, pode modificar a posição da linha neutra. Verifica-se a linha neutra com a equação iterativa abaixo',
                `\\(\\beta_x = \\dfrac{f_{yd}}{\\eta_c \\zeta_c \\ b_w d \\ f_cd} A_s \\beta_s \\)`, 
                'Aplicando os resultados da equação a cima em',
                `\\(\\beta_s = \\dfrac{E_s}{f_{yd}} \\dfrac{1-\\beta_x}{\\beta_x} \\epsilon_{cu} ≤ 1 \\)`,
                `Convergindo para os valores de \\(\\beta_s = \\)${db["Verificacao Linha Neutra"]['Admensionais'][0][1]} e \\(\\beta_x = \\)${db["Verificacao Linha Neutra"]['Admensionais'][0][0].toFixed(2).toString().replace('.',',')}`       
            ],
            label:['ignorar']

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