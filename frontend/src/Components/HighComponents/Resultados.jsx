import React from "react";
//Material ui
import AccordionSelf from "../Data/AccordionSelf";
import Box from '@mui/material/Box';
import { FormControl } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
//Componente
import DiagramaCortante from "../SVG/DiagramaCortante";
import DiagramaMomento from "../SVG/DiagramaMomento";
import { useState } from "react";
//reduz
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { actions } from "../../Actions/Combinacoes";

function textotentativa(db,caso,caracteristicas,momentomaximo){

    let verificacaoadm = (db['Verificacao Linha Neutra']['Aviso'][0]) ?'Linha neutra verificada':'Linha Neutra não verifica' //Há uma bug possivel, que a so uma valor de aviso, e nao para cadqa teste
    let eqmomentomax = ''
    let ignorar = (db['Verificacao Momento']['Momento de Calculo'][caso]===-1)? true:false
    console.log(db)
    const ignorarFrame = {
        titulo:'ignorar',
        texto:['ignorar','ignorar'],
        label:['ignorar']
    }

    const area={
        '20':0.150,
        '25':0.150,
        '30':0.150,
        '35':0.164,
        '40':0.179,
        '45':0.194,
        '50':0.208,
        '55':0.211,
        '60':0.219,
        '65':0.226,
        '70':0.233,
        '75':0.239,
        '80':0.245,
        '85':0.251,
        '90':0.256
    }
    if (caracteristicas['ductilidade']  && db['Altura Util']['Aviso'][caso]){
       
        eqmomentomax = (caracteristicas['fck']>50)? `\\(M_{máx} = \\zeta \\ b_w \\ {d}^2(0,1275-0,0153 \\zeta)\\dfrac{1-(fck[MPa] - 50)}{200}f_{cd} = ${db['Parametros']['zeta']}\\ ${caracteristicas['bw']}^2 \\ (0,1275-0,0153\\ ${db['Parametros']['zeta'].toFixed(2).toString().replace('.',',')}) \\dfrac{1-(${caracteristicas['fck']}-50)}{200} \\ ${(caracteristicas['fck']/14).toFixed(2).toString().replace('.',',')} = ${db['Verificacao Momento']['Momento Maximo'][caso].toFixed(2).toString().replace('.',',')}\\ kN.cm\\)`:`\\(M_{máx} = 0,153\\ b_w d^2 f_{cd} = 0,153\\ ${caracteristicas['bw']}\\ ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')}^2 \\ ${(caracteristicas['fck']/14).toFixed(2).toString().replace('.',',')} = ${db['Verificacao Momento']['Momento Maximo'][caso].toFixed(2).replace('.',',')}\\ kN.cm \\) `
    
    }

   

   
    if (caracteristicas["ductilidade"] && db['Altura Util']['Aviso'][caso]){
        const verificacaoadm = (db['Verificacao Linha Neutra']['Aviso'][0]) ?'Linha neutra verificada':'Linha Neutra não verifica' //Há uma bug possivel, que a so uma valor de aviso, e nao para cadqa teste
        const eqmomentomax = (caracteristicas['fck']>50)? `\\(M_{máx} = \\zeta \\ b_w \\ {d}^2(0,1275-0,0153 \\zeta)\\dfrac{1-(fck[MPa] - 50)}{200}f_{cd} = ${db['Parametros']['zeta']}\\ ${caracteristicas['bw']}^2 \\ (0,1275-0,0153\\ ${db['Parametros']['zeta'].toFixed(2).toString().replace('.',',')}) \\dfrac{1-(${caracteristicas['fck']}-50)}{200} \\ ${(caracteristicas['fck']/14).toFixed(2).toString().replace('.',',')} = ${db['Verificacao Momento']['Momento Maximo'][caso].toFixed(2).toString().replace('.',',')}\\ kN.cm\\)`:`\\(M_{máx} = 0,153\\ b_w d^2 f_{cd} = 0,153\\ ${caracteristicas['bw']}\\ ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')}^2 \\ ${(caracteristicas['fck']/14).toFixed(2).toString().replace('.',',')} = ${db['Verificacao Momento']['Momento Maximo'][caso].toFixed(2).replace('.',',')}\\ kN.cm \\) `
        const ignorar = (db['Verificacao Momento']['Momento de Calculo'][caso]===-1)? true:false
        const ignorarFrame = {
            titulo:'ignorar',
            texto:['ignorar','ignorar'],
            label:['ignorar']
        }
        return  {
            ConstantesNBR6118:{
                titulo: 'Parâmetros NBR6118:2014 ',
                texto:[
                    'Parâmetro estabelecidos pela NBR6118:',
                    (caracteristicas['fck']>50) ?`\\(\\zeta= 0,8-\\dfrac{f_{ck}[MPa]-50}{400} \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,8 - \\dfrac{${caracteristicas['fck']}-50}{400} = ${db['Parametros']['zeta']}\\)`:`\\(\\zeta= 0,8\\ para \\ concreto \\ até \\ C50\\)`,
                    'Parâmetro estabelecidos pela NBR6118:',
                    (caracteristicas['fck']>50) ? `\\(\\eta_c = 0,85\\dfrac{f_{ck}[MPa]-50}{200} \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,85 \\dfrac{${caracteristicas['fck']}-50}{200}= ${db['Parametros']['eta'].toString().replace('.',',')} \\)`:`\\(\\eta_c = 0,85\\ para \\ concreto \\ até \\ C50\\) `,
                    'Parâmetro estabelecidos pela NBR6118/2014 no item 8.2.10.1:',
                    (caracteristicas['fck']>50) ? `\\(\\epsilon_{cu} = 0,0026+0,035{\\left(\\dfrac{90-fck[MPa]}{100}\\right)}^4 \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,0026+0,035{\\left(\\dfrac{90-${caracteristicas['fck']}}{100}\\right)}^4\\)`:`\\(\\epsilon_{cu} = 3,5‰ \\ para \\ concreto \\ até \\ C50 \\)`,
                    'Parâmetro espaçamento transversal vertical entre armaduras estabelecido pela NBR6118/2014 no item 18.3.2.2 :',
                    `\\(a_v ≥ \\begin{cases} 2cm \\\\ \\phi_l\\\\ 0,5\\ d_{max} \\\\
                    \\end{cases} \\therefore \\ a_v = ${db['Parametros']['av'].toFixed(2).toString().replace('.',',')}\\ cm \\)`,
                    'Parametro espaçamento transversal longitudinal entre armaduras estabelecido pela NBR6118/2014 no item 18.3.2.2 :',
                    `\\(a_h ≥ \\begin{cases} 2cm \\\\ \\phi_l\\\\ 1,2\\ d_{max} \\\\
                        \\end{cases} \\therefore \\ a_v = ${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')} \\ cm \\)`,
                    'Parâmetro de redistribuição máxima da ductilidade estabelecidos pela NBR6118/2014 no item 14.6.4.3:',
                    (caracteristicas['fck']>50) ? '\\(x/d =0,35\\)':'\\(x/d =0,45\\)',
                    'Parâmetro estabelecido pela NBR6118/2014 na tabela 7.2:',
                    `\\(c_{nom} = ${db['Parametros']['Cobrimento']}\\ cm\\)`
                ],
                label:['zeta','ηc','Deformação última do Concreto','Espaçamento Vertical','Espaçamento Horizontal','x/d Limite','Cobrimento']
            },
            Quantidade:{
                titulo:'Quantidade de Barras por cada',
                texto:[
                    'Substitua os valores na equação',
                    `\\(\\eta_\\phi = \\lfloor {\\dfrac{b_w-2c_{nom}-2\\phi_t+a_h}{\\phi_l+a_h}}\\rfloor  = \\lfloor {\\dfrac{${caracteristicas['bw'].toFixed(2).toString().replace('.',',')}-2*${db['Parametros']['Cobrimento'].toFixed(2).toString().replace('.',',')}-2*${caracteristicas['dT'].toFixed(2).toString().replace('.',',')}+${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')}}{${caracteristicas['dL'].toFixed(2).toString().replace('.',',')}+${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')}}}\\rfloor = ${db['Discretizacao']['Barras por camada'][caso]}\\ barras \\ por \\ camada\\) `],
                label:['ignorar']
            },
            DiscretizacaoInicial:{
                titulo: `\\(y_s = ${db['Altura Util']['ys'][caso].toFixed(2).replace('.',',')} \\ cm\\)`,
                texto:[`Adota-se ${db['Discretizacao']['Barras totais'][caso]} barras. Substitua os valores na equação para barras de mesmo diâmetro`,`\\(ys = \\dfrac{\\sum_{i=1}^{j} n_i \\ ys_i}{n}, onde\\  ys_i = a_v+ \\phi_l \\)`],
                label:['']
    
            },
            Altura_Util:{
                titulo:`\\(d = ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')}\\ cm\\)`,
                texto:['Substitua os valores na equação',`\\(d = h-c_{nom}-\\phi_T-ys = ${caracteristicas['h']} - ${db['Parametros']['Cobrimento']} - ${caracteristicas['dT'].toString().replace('.',',')} - ${db['Altura Util']['ys'][caso].toFixed(2).replace('.',',')} = ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')} cm\\)`],
                label:['']
            },
            Momento:(ignorar)?{
                titulo:'Necessidade de Armadura negativa',
                texto:[
                    `Compare o momento solicitante de devido as cargas de  \\(${db['Verificacao Momento']['Momento Carregamento'][0].toFixed(2).toString().replace('.',',')}\\ kN.cm\\) com o momento máximo`,
                    eqmomentomax,
                    'Como o valor do Momento Solicitante é maior que o Momento Máximo da seção, então deve-se utilizar Armadura Negativa'
                ],
    
                label:['ignorar']
                }:
            {
                titulo: `\\(M_{sd} = ${db['Verificacao Momento']['Momento de Calculo'][caso].toFixed(2).toString().replace('.',',')} kN.cm\\)`,
                texto:[`Compare o momento solicitante de devido as cargas de  \\(${momentomaximo[1]}\\ kN.cm\\) com o momento mínimo (NBR 6118:2014 item 17.3.5.2.1):`,
                `\\(M_{mín} = 0,8 W_0 f_{ckt,sup} = 0,8* ${db['Parametros']['w0'].toFixed(2).replace('.',',')}* ${db['Parametros']['fcktsup'].toFixed(2).replace('.',',')} = ${db['Verificacao Momento']['Momento Minimo'][caso].toFixed(2).replace('.',',')}\\ kN.cm\\)`,
                `Compare o momento solicitante de devido as cargas de  \\(${momentomaximo[1]}\\ kN.cm\\) com o momento máximo:`,
                eqmomentomax,
            ],
            label:['Mmín','Mmáx']
            },
            Admensionais:(ignorar)?ignorarFrame:{
                titulo: `\\(x/d = ${db['Admensionais'][caso][0].toFixed(2).replace('.',',')}\\ \\ z/d = ${db['Admensionais'][caso][1].toFixed(2).replace('.',',')}\\ \\  \\beta_s = ${db['Admensionais'][caso][2].toFixed(2).replace('.',',')}\\)`,
                texto:[
                    'Substitua os valores na equação',
                    `\\(x/d= \\dfrac{1}{\\zeta}-\\dfrac{1}{\\zeta} \\sqrt{1-\\dfrac{2\\ M_{rdw}}{\\eta_c b_w d^2 f_{cd}}} = \\dfrac{1}{${db['Parametros']['zeta'].toString().replace('.',',')}} - \\dfrac{1}{${db['Parametros']['zeta'].toString().replace('.',',')}} \\sqrt{1-\\dfrac{2 * ${db['Verificacao Momento']['Momento de Calculo'][caso].toFixed(2).toString().replace('.',',')}}{${db['Parametros']['eta']} * ${caracteristicas['bw']} * ${db['Altura Util']['Valor'][caso].toFixed(2).toString().replace('.',',')}^2 * ${(caracteristicas['fck']/14).toFixed(2).toString().replace(".",",")}}} = ${db['Admensionais'][caso][0].toFixed(2).replace('.',',')}\\)`,
                    'Substitua os valores na equação',
                    `\\(z/d = 1-0,5\\zeta \\ x/d = 1-0,5* ${db['Parametros']['zeta']}* ${db['Admensionais'][caso][0].toFixed(2).replace('.',',')} = ${db['Admensionais'][caso][1].toFixed(2).replace('.',',')}\\)`,
                    'Substitua os valores na equação',
                    `\\(\\beta_s = \\dfrac{E_s}{f_{yd}} \\dfrac{1-x/d}{x/d} \\epsilon_{cu} ≤ 1 \\rightarrow \\beta_s =\\dfrac{200}{${(caracteristicas['fyk']/11.5).toFixed(2).toString().replace('.',',')}} \\dfrac{1-${db['Admensionais'][caso][0].toFixed(2).toString().replace('.',',')}}{${db['Admensionais'][caso][0].toFixed(2).toString().replace('.',',')}}\\ ${db['Parametros']['ecu'].toString().replace('.',',')} ≤ 1 \\rightarrow \\beta_s = ${db['Admensionais'][caso][2].toFixed(2).toString().replace('.',',')}\\)`
                ],
                label:['x/d','z/d','bs']
    
            },
            AreaAcoCalculada:(ignorar)?ignorarFrame:{
                titulo: `\\(A_{s,calc} = ${db['Area']['Area Necessaria'][caso].toFixed(2).replace('.',',')} \\ cm^2\\)` ,
                texto:['Substitua os valores na equação:',`\\(A_s = \\dfrac{M_{rdw}}{z/d\\ d} \\dfrac{1}{\\beta_s\\ f_yd} = \\dfrac{${db['Verificacao Momento']['Momento de Calculo'][caso].toFixed(2).replace('.',',')}}{${db['Admensionais'][caso][1].toFixed(2).replace('.',',')} * ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')}}\\dfrac{1}{${db['Admensionais'][caso][2].toFixed(2).replace('.',',')} * ${caracteristicas['fyk']/10}} =  ${db['Area']['Area Necessaria'][caso].toFixed(2).toString().replace('.',',')}\\ cm^2\\)`],
                label:['']
    
            },
            VerificacaoAreaAco:(ignorar)?ignorarFrame:{
                titulo: `Verificação aço: ${db['Area']['Aviso'][caso]}`,
                texto:[
                `Substitua os valores na equação (NBR6118:2014 tabela 17.3) e compare com o valor de área de amadura de ${db['Area']['Area Necessaria'][caso].toFixed(2).replace('.',',')} cm² `
                ,`\\(A_{mín} = ${area[caracteristicas['fck']].toString().replace('.',',')}\\% \\ A_c  = ${area[caracteristicas['fck']].toString().replace('.',',')}\\% ${db['Parametros']['Ac']} = ${(db['Parametros']['Ac']*area[caracteristicas['fck']]/100).toFixed(2).toString().replace('.',',')}\\ cm² \\)`
                ,`Substitua os valores na equação e compare com o valor de área armadura de ${db['Area']['Area Necessaria'][caso].toFixed(2).replace('.',',')} cm² `
                ,`\\(A_{máx} = 4\\% \\ A_c = 4\\% \\ ${db['Parametros']['Ac']} =  ${(db['Parametros']['Ac']*4/100).toFixed(2).toString().replace('.',',')}\\ cm² \\)`
            ],
                label:['Amín','Amáx']
    
            },
            
            Discretizacao:(ignorar)?ignorarFrame:{
                titulo: 'Discretização',
                texto:[
                    'Substitua os valores na equação:',
                    `\\(n = \\left \\lceil{\\dfrac{A_{sef} \\ 4}{\\pi \\phi_l^2}} \\right \\rceil = \\left \\lceil{\\dfrac{${db['Area']['Area Adotada'][caso].toFixed(2).toString().replace('.',',')}* 4}{\\pi * ${caracteristicas['dL'].toString().replace('.',',')}^2}}\\right \\rceil = ${db['Discretizacao']['Barras totais'][caso]} \\ barras \\)`,
                    (db['Discretizacao']['Barras calculadas'][caso].slice(-1)[0]%2 !==0 && db['Discretizacao']['Barras calculadas'][caso].slice(-1)[0] !== db['Discretizacao']['Barras por camada'][caso])? 'Como o valor de barras necessárias foi um valor impar, a distribuição das camadas seria assimétrica, ocasionando em flexo torção':'',
                    (db['Discretizacao']['Barras calculadas'][caso].slice(-1)[0]%2 !==0 && db['Discretizacao']['Barras calculadas'][caso].slice(-1)[0] !== db['Discretizacao']['Barras por camada'][caso])? `Portanto, visando manter a simetria, adota-se \\(n = ${db['Discretizacao']['Barras totais'][caso]+1}\\ barras\\)`:''
                ],
                label:['Discretização','ignorar']
    
            },
            AreaAcoEfetiva:(ignorar)?ignorarFrame:{
                titulo: `\\(A_{sef} = ${db['Area']['Area Efetiva'][caso].toFixed(2).replace('.',',')} \\ cm^2\\)`,
                texto:[
                    'Substitua os valores na equação:',
                    `\\(A_{sef} = n \\pi \\dfrac{\\phi_l^2}{4} = ${db['Discretizacao']['Barras totais'][caso]} \\pi \\dfrac{${caracteristicas['dL'].toString().replace('.',',')}^2}{4} \\)`,
                
                ],
                label:['']
            },
            VerificacaoAreaAco_dois:(ignorar)?ignorarFrame:{
                titulo: `Verificação aço: ${db['Area']['Aviso_arredondado'][caso]}`,
                texto:[
                    `Substitua os valores na equação e compare com o valor de área armadura efetiva de ${db['Area']['Area Efetiva'][caso].toFixed(2).replace('.',',')} cm² `
                ,`\\(A_{mín} = ${area[caracteristicas['fck']].toString().replace('.',',')}\\% \\ A_c  = ${area[caracteristicas['fck']].toString().replace('.',',')}\\% ${db['Parametros']['Ac']} = ${(db['Parametros']['Ac']*area[caracteristicas['fck']]/100).toFixed(2).toString().replace('.',',')}\\ cm² \\)`
                ,`Substitua os valores na equação e compare com o valor de área armadura efetiva de ${db['Area']['Area Efetiva'][caso].toFixed(2).replace('.',',')} cm² `
                ,`\\(A_{máx} = 4\\% \\ A_c = 4\\% \\ ${db['Parametros']['Ac']} =  ${(db['Parametros']['Ac']*4/100).toFixed(2).toString().replace('.',',')}\\ cm² \\)`
            ],
                label:['Amáx','Amín']
    
            },
            VerificacaoAdmensionais:(ignorar)?ignorarFrame:{
                titulo: verificacaoadm ,
                texto:[
                    'O arredondamento da área de aço cálculada para área de aço efetiva, pode modificar a posição da linha neutra. Verifica-se a linha neutra com a equação iterativa abaixo',
                    `\\(x/d = \\dfrac{f_{yd}}{\\eta_c \\zeta_c \\ b_w d \\ f_cd} A_s \\beta_s \\)`, 
                    'Aplicando os resultados da equação a cima em',
                    `\\(\\beta_s = \\dfrac{E_s}{f_{yd}} \\dfrac{1-x/d} \\epsilon_{cu} ≤ 1 \\)`,
                    `Convergindo para os valores de \\(\\beta_s = \\)${db["Verificacao Linha Neutra"]['Admensionais'][0][1]} e \\(x/d = \\)${db["Verificacao Linha Neutra"]['Admensionais'][0][0].toFixed(2).toString().replace('.',',')}. Como o valor de \\(x/d\\) convergiu para um número ${(verificacaoadm ==='Linha Neutra não verifica')?'maior':'menor'} que o limite ${(caracteristicas['fck']>50) ? '\\(x/d =0,35\\)':'\\(x/d =0,45\\)'}, então a ${verificacaoadm}`,     
                    (db['Verificacao Linha Neutra']['Aviso'][0]) ? '':'Recomenda-se aumentar o valor da altura (h) da seção'
                ],
                label:['ignorar']
    
            },
        }
    }
    else  if (caracteristicas["ductilidade"] && !db['Altura Util']['Aviso'][caso]){
        return  {
            ConstantesNBR6118:{
                titulo: 'Parâmetros NBR6118:2014 ',
                texto:[
                    'Parâmetro estabelecidos pela NBR6118:',
                    (caracteristicas['fck']>50) ?`\\(\\zeta= 0,8-\\dfrac{f_{ck}[MPa]-50}{400} \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,8 - \\dfrac{${caracteristicas['fck']}-50}{400} = ${db['Parametros']['zeta']}\\)`:`\\(\\zeta= 0,8\\ para \\ concreto \\ até \\ C50\\)`,
                    'Parâmetro estabelecidos pela NBR6118:',
                    (caracteristicas['fck']>50) ? `\\(\\eta_c = 0,85\\dfrac{f_{ck}[MPa]-50}{200} \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,85 \\dfrac{${caracteristicas['fck']}-50}{200}= ${db['Parametros']['eta'].toString().replace('.',',')} \\)`:`\\(\\eta_c = 0,85\\ para \\ concreto \\ até \\ C50\\) `,
                    'Parâmetro estabelecidos pela NBR6118/2014 no item 8.2.10.1:',
                    (caracteristicas['fck']>50) ? `\\(\\epsilon_{cu} = 0,0026+0,035{\\left(\\dfrac{90-fck[MPa]}{100}\\right)}^4 \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,0026+0,035{\\left(\\dfrac{90-${caracteristicas['fck']}}{100}\\right)}^4\\)`:`\\(\\epsilon_{cu} = 3,5‰ \\ para \\ concreto \\ até \\ C50 \\)`,
                    'Parâmetro espaçamento transversal vertical entre armaduras estabelecido pela NBR6118/2014 no item 18.3.2.2 :',
                    `\\(a_v ≥ \\begin{cases} 2cm \\\\ \\phi_l\\\\ 0,5\\ d_{max} \\\\
                    \\end{cases} \\therefore \\ a_v = ${db['Parametros']['av'].toFixed(2).toString().replace('.',',')}\\ cm \\)`,
                    'Parametro espaçamento transversal longitudinal entre armaduras estabelecido pela NBR6118/2014 no item 18.3.2.2 :',
                    `\\(a_h ≥ \\begin{cases} 2cm \\\\ \\phi_l\\\\ 1,2\\ d_{max} \\\\
                        \\end{cases} \\therefore \\ a_v = ${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')} \\ cm \\)`,
                    'Parâmetro de redistribuição máxima da ductilidade estabelecidos pela NBR6118/2014 no item 14.6.4.3:',
                    (caracteristicas['fck']>50) ? '\\(x/d =0,35\\)':'\\(x/d =0,45\\)',
                    'Parâmetro estabelecido pela NBR6118/2014 na tabela 7.2:',
                    `\\(c_{nom} = ${db['Parametros']['Cobrimento']}\\ cm\\)`
                ],
                label:['zeta','ηc','Deformação última do Concreto','Espaçamento Vertical','Espaçamento Horizontal','x/d Limite','Cobrimento']
            },
            Quantidade:{
                titulo:'Quantidade de Barras por cada',
                texto:[
                    'Substitua os valores na equação',
                    `\\(\\eta_\\phi = \\lfloor {\\dfrac{b_w-2c_{nom}-2\\phi_t+a_h}{\\phi_l+a_h}}\\rfloor  = \\lfloor {\\dfrac{${caracteristicas['bw'].toFixed(2).toString().replace('.',',')}-2*${db['Parametros']['Cobrimento'].toFixed(2).toString().replace('.',',')}-2*${caracteristicas['dT'].toFixed(2).toString().replace('.',',')}+${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')}}{${caracteristicas['dL'].toFixed(2).toString().replace('.',',')}+${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')}}}\\rfloor = ${db['Discretizacao']['Barras por camada'].slice(-1)[0]}\\ barras \\ por \\ camada\\) `],
                label:['ignorar']
            },
            DiscretizacaoInicial:{
                titulo: `\\(y_s = ${db['Altura Util']['ys'][caso].toFixed(2).replace('.',',')} \\ cm\\)`,
                texto:[
                    `Adota-se ${db['Discretizacao']['Barras totais'][caso]} barras. Substitua os valores na equação para barras de mesmo diâmetro`,
                    `\\(ys = \\dfrac{\\sum_{i=1}^{j} n_i \\ ys_i}{n}, onde\\  ys_i = a_v+ \\phi_l \\)`,
                    `Como o valor de \\(y_s\\) é maior que 10% da altura da seção, recomenda-se aumentar o valor da altura da seção transversal`,
                
                ],
                label:['ignorar']
    
            },
        }
    }
    else if(db['Admensionais'][caso][3]=='Impossivel Calcular a posição da linha Neutra'){
        return {
            ConstantesNBR6118:{
                titulo: 'Parâmetros NBR6118:2014 ',
                texto:[
                    'Parâmetro estabelecidos pela NBR6118:',
                    (caracteristicas['fck']>50) ?`\\(\\zeta= 0,8-\\dfrac{f_{ck}[MPa]-50}{400} \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,8 - \\dfrac{${caracteristicas['fck']}-50}{400} = ${db['Parametros']['zeta']}\\)`:`\\(\\zeta= 0,8\\ para \\ concreto \\ até \\ C50\\)`,
                    'Parâmetro estabelecidos pela NBR6118:',
                    (caracteristicas['fck']>50) ? `\\(\\eta_c = 0,85\\dfrac{f_{ck}[MPa]-50}{200} \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,85 \\dfrac{${caracteristicas['fck']}-50}{200}= ${db['Parametros']['eta'].toString().replace('.',',')} \\)`:`\\(\\eta_c = 0,85\\ para \\ concreto \\ até \\ C50\\) `,
                    'Parâmetro estabelecidos pela NBR6118/2014 no item 8.2.10.1:',
                    (caracteristicas['fck']>50) ? `\\(\\epsilon_{cu} = 0,0026+0,035{\\left(\\dfrac{90-fck[MPa]}{100}\\right)}^4 \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,0026+0,035{\\left(\\dfrac{90-${caracteristicas['fck']}}{100}\\right)}^4\\)`:`\\(\\epsilon_{cu} = 3,5‰ \\ para \\ concreto \\ até \\ C50 \\)`,
                    'Parâmetro espaçamento transversal vertical entre armaduras estabelecido pela NBR6118/2014 no item 18.3.2.2 :',
                    `\\(a_v ≥ \\begin{cases} 2cm \\\\ \\phi_l\\\\ 0,5\\ d_{max} \\\\
                    \\end{cases} \\therefore \\ a_v = ${db['Parametros']['av'].toFixed(2).toString().replace('.',',')}\\ cm \\)`,
                    'Parametro espaçamento transversal longitudinal entre armaduras estabelecido pela NBR6118/2014 no item 18.3.2.2 :',
                    `\\(a_h ≥ \\begin{cases} 2cm \\\\ \\phi_l\\\\ 1,2\\ d_{max} \\\\
                        \\end{cases} \\therefore \\ a_v = ${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')} \\ cm \\)`,
                    'Parâmetro de redistribuição máxima da ductilidade estabelecidos pela NBR6118/2014 no item 14.6.4.3:',
                    (caracteristicas['fck']>50) ? '\\(x/d =0,35\\)':'\\(x/d =0,45\\)',
                    'Parâmetro estabelecido pela NBR6118/2014 na tabela 7.2:',
                    `\\(c_{nom} = ${db['Parametros']['Cobrimento']}\\ cm\\)`
                ],
                label:['zeta','ηc','Deformação última do Concreto','Espaçamento Vertical','Espaçamento Horizontal','x/d Limite','Cobrimento']
            },
            Quantidade:{
                titulo:'Quantidade de Barras por cada',
                texto:[
                    'Substitua os valores na equação',
                    `\\(\\eta_\\phi = \\lfloor {\\dfrac{b_w-2c_{nom}-2\\phi_t+a_h}{\\phi_l+a_h}}\\rfloor  = \\lfloor {\\dfrac{${caracteristicas['bw'].toFixed(2).toString().replace('.',',')}-2*${db['Parametros']['Cobrimento'].toFixed(2).toString().replace('.',',')}-2*${caracteristicas['dT'].toFixed(2).toString().replace('.',',')}+${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')}}{${caracteristicas['dL'].toFixed(2).toString().replace('.',',')}+${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')}}}\\rfloor = ${db['Discretizacao']['Barras por camada'][caso]}\\ barras \\ por \\ camada\\) `],
                label:['ignorar']
            },
            DiscretizacaoInicial:{
                titulo: `\\(y_s = ${db['Altura Util']['ys'][caso].toFixed(2).replace('.',',')} \\ cm\\)`,
                texto:[`Adota-se ${db['Discretizacao']['Barras totais'][caso]} barras. Substitua os valores na equação para barras de mesmo diâmetro`,`\\(ys = \\dfrac{\\sum_{i=1}^{j} n_i \\ ys_i}{n}, onde\\  ys_i = a_v+ \\phi_l \\)`],
                label:['']
    
            },
            Altura_Util:{
                titulo:`\\(d = ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')}\\ cm\\)`,
                texto:['Substitua os valores na equação',`\\(d = h-c_{nom}-\\phi_T-ys = ${caracteristicas['h']} - ${db['Parametros']['Cobrimento']} - ${caracteristicas['dT'].toString().replace('.',',')} - ${db['Altura Util']['ys'][caso].toFixed(2).replace('.',',')} = ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')} cm\\)`],
                label:['']
            },
            Momento:(ignorar)?{
                titulo:'Necessidade de Armadura negativa',
                texto:[
                    `Compare o momento solicitante de devido as cargas de  \\(${db['Verificacao Momento']['Momento Carregamento'][0].toFixed(2).toString().replace('.',',')}\\ kN.cm\\) com o momento máximo`,
                    eqmomentomax,
                    'Como o valor do Momento Solicitante é maior que o Momento Máximo da seção, então deve-se utilizar Armadura Negativa'
                ],
    
                label:['ignorar']
                }:
            {
                titulo: `\\(M_{sd} = ${db['Verificacao Momento']['Momento de Calculo'][caso].toFixed(2).toString().replace('.',',')} kN.cm\\)`,
                texto:[`Compare o momento solicitante de devido as cargas de  \\(${momentomaximo[1]}\\ kN.cm\\) com o momento mínimo:`,
                `\\(M_{mín} = 0,8 W0 f_{ckt,sup} = 0,8* ${db['Parametros']['w0'].toFixed(2).replace('.',',')}* ${db['Parametros']['fcktsup'].toFixed(2).replace('.',',')} = ${db['Verificacao Momento']['Momento Minimo'][caso].toFixed(2).replace('.',',')}\\ kN.cm\\)`,
                `Compare o momento solicitante de devido as cargas de  \\(${momentomaximo[1]}\\ kN.cm\\) com o momento máximo:`,
                eqmomentomax,
            ],
            label:['Mmín','Mmáx']
            },
            Admensionais:(ignorar)?ignorarFrame:{
                titulo: `Impossível Calcular a posição da linha Neutra`,
                texto:[
                    `Utilizando a equação abaixo com os valores entrados obtém-se um número imaginário, que não tem valor físico:`,
                    `\\(x/d= \\dfrac{1}{\\zeta}-\\dfrac{1}{\\zeta} \\sqrt{1-\\dfrac{2\\ M_{rdw}}{\\eta_c b_w d^2 f_{cd}}} = \\dfrac{1}{${db['Parametros']['zeta'].toString().replace('.',',')}} - \\dfrac{1}{${db['Parametros']['zeta'].toString().replace('.',',')}} \\sqrt{1-\\dfrac{2 * ${db['Verificacao Momento']['Momento de Calculo'][caso].toFixed(2).toString().replace('.',',')}}{${db['Parametros']['eta']} * ${caracteristicas['bw']} * ${db['Altura Util']['Valor'][caso].toFixed(2).toString().replace('.',',')}^2 * ${(caracteristicas['fck']/14).toFixed(2).toString().replace(".",",")}} }= indefinido\\)`,
                    'Recomenda-se Aumentar o valor da seção transversal'
                ],
                label:['ignorar']
    
            }
        }
    }
    else{
        return  {
            ConstantesNBR6118:{
                titulo: 'Parâmetros NBR6118:2014 ',
                texto:[
                    'Parâmetro estabelecidos pela NBR6118:',
                    (caracteristicas['fck']>50) ?`\\(\\zeta= 0,8-\\dfrac{f_{ck}[MPa]-50}{400} \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,8 - \\dfrac{${caracteristicas['fck']}-50}{400} = ${db['Parametros']['zeta']}\\)`:`\\(\\zeta= 0,8\\ para \\ concreto \\ até \\ C50\\)`,
                    'Parâmetro estabelecidos pela NBR6118:',
                    (caracteristicas['fck']>50) ? `\\(\\eta_c = 0,85\\dfrac{f_{ck}[MPa]-50}{200} \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,85 \\dfrac{${caracteristicas['fck']}-50}{200}= ${db['Parametros']['eta'].toString().replace('.',',')} \\)`:`\\(\\eta_c = 0,85\\ para \\ concreto \\ até \\ C50\\) `,
                    'Parâmetro estabelecidos pela NBR6118/2014 no item 8.2.10.1:',
                    (caracteristicas['fck']>50) ? `\\(\\epsilon_{cu} = 0,0026+0,035{\\left(\\dfrac{90-fck[MPa]}{100}\\right)}^4 \\ para \\ concreto \\ Classe \\ maior \\ que \\ C50 = 0,0026+0,035{\\left(\\dfrac{90-${caracteristicas['fck']}}{100}\\right)}^4\\)`:`\\(\\epsilon_{cu} = 3,5‰ \\ para \\ concreto \\ até \\ C50 \\)`,
                    'Parâmetro espaçamento transversal vertical entre armaduras estabelecido pela NBR6118/2014 no item 18.3.2.2 :',
                    `\\(a_v ≥ \\begin{cases} 2cm \\\\ \\phi_l\\\\ 0,5\\ d_{max} \\\\
                    \\end{cases} \\therefore \\ a_v = ${db['Parametros']['av'].toFixed(2).toString().replace('.',',')}\\ cm \\)`,
                    'Parametro espaçamento transversal longitudinal entre armaduras estabelecido pela NBR6118/2014 no item 18.3.2.2 :',
                    `\\(a_h ≥ \\begin{cases} 2cm \\\\ \\phi_l\\\\ 1,2\\ d_{max} \\\\
                        \\end{cases} \\therefore \\ a_v = ${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')} \\ cm \\)`,
                    'Parâmetro de redistribuição máxima da ductilidade estabelecidos pela NBR6118/2014 no item 14.6.4.3:',
                    (caracteristicas['fck']>50) ? '\\(x/d =0,35\\)':'\\(x/d =0,45\\)',
                    'Parâmetro estabelecido pela NBR6118/2014 na tabela 7.2:',
                    `\\(c_{nom} = ${db['Parametros']['Cobrimento']}\\ cm\\)`
                ],
                label:['zeta','ηc','Deformação última do Concreto','Espaçamento Vertical','Espaçamento Horizontal','x/d Limite','Cobrimento']
            },
            Quantidade:{
                titulo:'Quantidade de Barras por cada',
                texto:[
                    'Substitua os valores na equação',
                    `\\(\\eta_\\phi = \\lfloor {\\dfrac{b_w-2c_{nom}-2\\phi_t+a_h}{\\phi_l+a_h}}\\rfloor  = \\lfloor {\\dfrac{${caracteristicas['bw'].toFixed(2).toString().replace('.',',')}-2*${db['Parametros']['Cobrimento'].toFixed(2).toString().replace('.',',')}-2*${caracteristicas['dT'].toFixed(2).toString().replace('.',',')}+${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')}}{${caracteristicas['dL'].toFixed(2).toString().replace('.',',')}+${db['Parametros']['ah'].toFixed(2).toString().replace('.',',')}}}\\rfloor = ${db['Discretizacao']['Barras por camada'][caso]}\\ barras \\ por \\ camada\\) `],
                label:['ignorar']
            },
            DiscretizacaoInicial:{
                titulo: `\\(y_s = ${db['Altura Util']['ys'][caso].toFixed(2).replace('.',',')} \\ cm\\)`,
                texto:[`Adota-se ${db['Discretizacao']['Barras totais'][caso]} barras. Substitua os valores na equação para barras de mesmo diâmetro`,`\\(ys = \\dfrac{\\sum_{i=1}^{j} n_i \\ ys_i}{n}, onde\\  ys_i = a_v+ \\phi_l \\)`],
                label:['']
    
            },
            Altura_Util:{
                titulo:`\\(d = ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')}\\ cm\\)`,
                texto:['Substitua os valores na equação',`\\(d = h-c_{nom}-\\phi_T-ys = ${caracteristicas['h']} - ${db['Parametros']['Cobrimento']} - ${caracteristicas['dT'].toString().replace('.',',')} - ${db['Altura Util']['ys'][caso].toFixed(2).replace('.',',')} = ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')} cm\\)`],
                label:['']
            },
            Momento:(ignorar)?{
                titulo:'Necessidade de Armadura negativa',
                texto:[
                    `Compare o momento solicitante de devido as cargas de  \\(${db['Verificacao Momento']['Momento Carregamento'][0].toFixed(2).toString().replace('.',',')}\\ kN.cm\\) com o momento máximo`,
                    eqmomentomax,
                    'Como o valor do Momento Solicitante é maior que o Momento Máximo da seção, então deve-se utilizar Armadura Negativa'
                ],
    
                label:['ignorar']
                }:
            {
                titulo: `\\(M_{sd} = ${db['Verificacao Momento']['Momento de Calculo'][caso].toFixed(2).toString().replace('.',',')} kN.cm\\)`,
                texto:[`Compare o momento solicitante de devido as cargas de  \\(${momentomaximo[1]}\\ kN.cm\\) com o momento mínimo:`,
                `\\(M_{mín} = 0,8 W0 f_{ckt,sup} = 0,8* ${db['Parametros']['w0'].toFixed(2).replace('.',',')}* ${db['Parametros']['fcktsup'].toFixed(2).replace('.',',')} = ${db['Verificacao Momento']['Momento Minimo'][caso].toFixed(2).replace('.',',')}\\ kN.cm\\)`,
                `Compare o momento solicitante de devido as cargas de  \\(${momentomaximo[1]}\\ kN.cm\\) com o momento máximo:`,
                eqmomentomax,
            ],
            label:['Mmín','Mmáx']
            },
            Admensionais:(ignorar)?ignorarFrame:{
                titulo: `\\(x/d = ${db['Admensionais'][caso][0].toFixed(2).replace('.',',')}\\ \\ z/d = ${db['Admensionais'][caso][1].toFixed(2).replace('.',',')}\\ \\  \\beta_s = ${db['Admensionais'][caso][2].toFixed(2).replace('.',',')}\\)`,
                texto:[
                    'Substitua os valores na equação',
                    `\\(x/d= \\dfrac{1}{\\zeta}-\\dfrac{1}{\\zeta} \\sqrt{1-\\dfrac{2\\ M_{rdw}}{\\eta_c b_w d^2 f_{cd}}} = \\dfrac{1}{${db['Parametros']['zeta'].toString().replace('.',',')}} - \\dfrac{1}{${db['Parametros']['zeta'].toString().replace('.',',')}} \\sqrt{1-\\dfrac{2 * ${db['Verificacao Momento']['Momento de Calculo'][caso].toFixed(2).toString().replace('.',',')}}{${db['Parametros']['eta']} * ${caracteristicas['bw']} * ${db['Altura Util']['Valor'][caso].toFixed(2).toString().replace('.',',')}^2 * ${(caracteristicas['fck']/14).toFixed(2).toString().replace(".",",")}}} = ${db['Admensionais'][caso][0].toFixed(2).replace('.',',')}\\)`,
                    'Substitua os valores na equação',
                    `\\(z/d = 1-0,5\\zeta \\ x/d = 1-0,5* ${db['Parametros']['zeta']}* ${db['Admensionais'][caso][0].toFixed(2).replace('.',',')} = ${db['Admensionais'][caso][1].toFixed(2).replace('.',',')}\\)`,
                    'Substitua os valores na equação',
                    `\\(\\beta_s = \\dfrac{E_s}{f_{yd}} \\dfrac{1-x/d}{x/d} \\epsilon_{cu} ≤ 1 \\rightarrow \\beta_s =\\dfrac{200}{${(caracteristicas['fyk']/11.5).toFixed(2).toString().replace('.',',')}} \\dfrac{1-${db['Admensionais'][caso][0].toFixed(2).toString().replace('.',',')}}{${db['Admensionais'][caso][0].toFixed(2).toString().replace('.',',')}}\\ ${db['Parametros']['ecu'].toString().replace('.',',')} ≤ 1 \\rightarrow \\beta_s = ${db['Admensionais'][caso][2].toFixed(2).toString().replace('.',',')}\\)`
                ],
                label:['x/d','z/d','bs']
    
            },
            AreaAcoCalculada:(ignorar)?ignorarFrame:{
                titulo: `\\(A_{s,calc} = ${db['Area']['Area Necessaria'][caso].toFixed(2).replace('.',',')} \\ cm^2\\)` ,
                texto:['Substitua os valores na equação:',`\\(A_s = \\dfrac{M_{rdw}}{z/d\\ d} \\dfrac{1}{\\beta_s\\ f_yd} = \\dfrac{${db['Verificacao Momento']['Momento de Calculo'][caso].toFixed(2).replace('.',',')}}{${db['Admensionais'][caso][1].toFixed(2).replace('.',',')} * ${db['Altura Util']['Valor'][caso].toFixed(2).replace('.',',')}}\\dfrac{1}{${db['Admensionais'][caso][2].toFixed(2).replace('.',',')} * ${caracteristicas['fyk']/10}} =  ${db['Area']['Area Necessaria'][caso].toFixed(2).toString().replace('.',',')}\\ cm^2\\)`],
                label:['']
    
            },
           
            
            Discretizacao:(ignorar)?ignorarFrame:{
                titulo: 'Discretização',
                texto:[
                    'Substitua os valores na equação:',
                    `\\(n = \\left \\lceil{\\dfrac{A_{sef} \\ 4}{\\pi \\phi_l^2}} \\right \\rceil = \\left \\lceil{\\dfrac{${db['Area']['Area Adotada'][caso].toFixed(2).toString().replace('.',',')}* 4}{\\pi * ${caracteristicas['dL'].toString().replace('.',',')}^2}}\\right \\rceil = ${db['Discretizacao']['Barras totais'][caso]} \\ barras \\)`,
                    (db['Discretizacao']['Barras calculadas'][caso].slice(-1)[0]%2 !==0 && db['Discretizacao']['Barras calculadas'][caso].slice(-1)[0] !== db['Discretizacao']['Barras por camada'][caso])? 'Como o valor de barras necessárias foi um valor impar, a distribuição das camadas seria assimétrica, ocasionando em flexo torção':'',
                    (db['Discretizacao']['Barras calculadas'][caso].slice(-1)[0]%2 !==0 && db['Discretizacao']['Barras calculadas'][caso].slice(-1)[0] !== db['Discretizacao']['Barras por camada'][caso])? `Portanto, visando manter a simetria, adota-se \\(n = ${db['Discretizacao']['Barras totais'][caso]+1}\\ barras\\)`:''
                ],
                label:['Discretização','ignorar']
    
            },
            AreaAcoEfetiva:(ignorar)?ignorarFrame:{
                titulo: `\\(A_{sef} = ${db['Area']['Area Efetiva'][caso].toFixed(2).replace('.',',')} \\ cm^2\\)`,
                texto:[
                    'Substitua os valores na equação:',
                    `\\(A_{sef} = n \\pi \\dfrac{\\phi_l^2}{4} = ${db['Discretizacao']['Barras totais'][caso]} \\pi \\dfrac{${caracteristicas['dL'].toString().replace('.',',')}^2}{4} \\)`,
                
                ],
                label:['']
            },
           
            
        }
    }
   
}


const Resultados = (props)=>{
    

    const dispach = useDispatch()
    const [combinacao,setCombinacao] = useState('Envoltória')

    const handlechange = (event) =>{
        event.preventDefault()
        dispach(actions.adicionar(event.target.value))
        setCombinacao(event.target.value)
        return setCombinacao(event.target.value)
        
    }

    
    const CARREGAMENTOS = useSelector(state => state.botoesReducers.CARREGAMENTOS)

    const listacombinacoes = []
   
    try{
        for(let i=1;i<=CARREGAMENTOS[0].comb.length;i++){
            listacombinacoes.push(`Combinação ${i}`)
        }
    }
    catch (error){
    }

    listacombinacoes.push('Envoltória')


    const escalabarra = (Math.abs(300/props.barra)>1)?1:Math.abs(300/props.barra)
    let escala = 1
    let acoordeao = {}
    let momentomax = 1
    let maximoesforco = 1

    try{
        maximoesforco = (Math.abs(props.metrigidez['Maximo'][1]/100)>Math.abs(props.metrigidez['Cortante Maximo'][1]))?props.metrigidez['Maximo'][1]/100:props.metrigidez['Cortante Maximo'][1]
        escala = (maximoesforco<0) ? -1/(maximoesforco/((147.5-15-15))):1/(maximoesforco/((147.5-15-15)))
        momentomax = (Math.abs(props.metrigidez['Maximo'][1]/100)>Math.abs(props.metrigidez['Cortante Maximo'][1])) ? props.dimensionamento["Verificacao Momento"]["Sinal"]:Math.abs(props.metrigidez['Cortante Maximo'][1])/props.metrigidez['Cortante Maximo'][1]
        if(escala>1){
            escala = 1
        }
    }
    catch(error){
    }

    try {
        acoordeao = textotentativa(props.dimensionamento,props.dimensionamento['Altura Util']['ys'].length-1,props.caracteristicas,props.metrigidez['Maximo'])

    
    
    } catch (error) {
        console.log(error)
    }
    
    // 147.4 = altura da viga| 15 = altura padrao do texto | 15 = altura das letras

    return(
        <div >
        <Grid container spacing={0} alignContent="center">
            <Grid xs={4}>
                <Box>
                    <DiagramaCortante barra={props.barra} apoios={props.apoios} metrigidez={props.metrigidez} escala={escala} escalabarra={escalabarra} 
                    momento={momentomax}></DiagramaCortante>

                </Box>
            </Grid>
            <Grid xs={4}>
                <Box>
                    <DiagramaMomento barra={props.barra} apoios={props.apoios} metrigidez={props.metrigidez} escala={escala} escalabarra={escalabarra} momento={momentomax}></DiagramaMomento>
                </Box>
            </Grid>
            <Grid xs={4}>
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '39ch', paddingLeft:1 }}}noValidate autoComplete="off" >
                                <FormControl>
                                        <InputLabel sx={{ paddingLeft:2 }}>Combinação</InputLabel>
                                        <Select
                                        value={combinacao}
                                        label='Classe Ambiental'
                                        sx={{backgroundColor:'white'}}
                                        onChange={handlechange}
                                            >
                                        {listacombinacoes.map((item,index)=>{return<MenuItem key={index} value={item}>{item}</MenuItem>})}
                                        </Select>
                                    </FormControl>
                                    {(combinacao==="Envoltória")?'':CARREGAMENTOS.map((item,chave)=>{
                                        return <p>{`${item['name']}:${item['comb'][parseInt(combinacao[combinacao.length-1])-1]}`}</p>
                                    })}
                                
                    </Box>
            </Grid>
        </Grid>
        {Object.keys(acoordeao).map((valor,indice)=>{
            try{
                return <AccordionSelf label={acoordeao[valor]['titulo']} text={acoordeao[valor]['texto']} labesecundario={acoordeao[valor]["label"]} dimensionamento={props.dimensionamento}></AccordionSelf>
            }
            catch{
                return <div/>
            }
            
        })}
        </div>
    )
}



export default Resultados