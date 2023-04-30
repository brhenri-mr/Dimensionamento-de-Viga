from Dimensionamento import verificacao_momentos, admensionais, area_aco, verificacao_area, distruibuicao_camadas,incremento_cg_armaduras, area_efeitiva, verificacao_admensional
from Ancoragem import *
from NBR6118 import ParametrosConcreto


'''
verificacao_momentos - Verificada
admensionais - verificada
area - verificada
verificacao_area - verificada
'''

h = 50
bw = 20
d= 45
c= 20
momento = 12_500
parametros = ParametrosConcreto(20, 'Rural', 'Viga', 1.25,bw,h)
fcd =2/1.4 
Es = 210_000
fyd = 50/1.15
ecu= parametros.ecu
cnom = parametros.cobrimento
Ac = bw*h
w0 = parametros.w0

#Area
bitolaL = 1.25
bitolaT = 0.8

bn =1
nc = 1
numero_barras = 0

saida = {'Admensionais':[],
         'Altura Util':{
            'Valor':[],
            'ys':[]
        },
        'Verificacao Linha Neutra':{
             'Aviso':[],
             'Bx_veri':[],
             'Bs_veri':[]
             }, 
         'Verificacao Momento':{
             'Momento Minimo':[],
             'Momento Maximo':[],
             'Momento de Calculo':[],
             'Aviso':[]
            },
        'Area':{
            'Area Efetiva':[],
            'Area Necessaria':[]
        },
        'Discretizacao':{
            'Barras por camada':[],
            'Barras':[],
            'Barras totais':[]
        },
        'Verificacao Linha Neutra':
            {
                'Aviso':[],
                'Admensionais':[],
            }
        } 
         
         

while True:
    
    
    while bn!=numero_barras:
        
        #Cg das armaduras
        ys, numero_barras, barra = incremento_cg_armaduras(bitolaL,parametros.av,h,numero_de_barras=bn,barras_por_camada=nc)
        saida['Altura Util']['ys'].append(ys)
        saida['Discretizacao']['Barras'].append(barra)
        #Altura util
        d = h - cnom - bitolaT - ys
        saida['Altura Util']['Valor'].append(d)
        
        #verificao momento
        momento, momentomin, momentomax, aviso = verificacao_momentos(momento, parametros.fctksup,w0,bw,d,fcd,parametros.zeta,c)
        saida['Verificacao Momento']['Momento Minimo'].append(momentomin)
        saida['Verificacao Momento']['Momento Maximo'].append(momentomax)
        saida['Verificacao Momento']['Momento de Calculo'].append(momento)
        saida['Verificacao Momento']['Aviso'].append(aviso)
        
        #admensionais(parametros.zeta,momento,parametros.eta,bw,d,fcd,Es,fyd,ecu)
        bx, bz, bs = admensionais(parametros.zeta,momento,parametros.eta,bw,d,fcd,Es,fyd,parametros.ecu)
        saida['Admensionais'].append([bx,bz,bs])

        #Area de aco 
        a = area_aco(momento,bz,d,bs,fyd)
        saida['Area']['Area Necessaria'].append(a)

        if verificacao_area(a,Ac)[1]:
            bn, nc = distruibuicao_camadas(a,bitolaL,bw,cnom,bitolaT,parametros.av,parametros.ah)
            saida['Discretizacao']['Barras por camada'].append(nc)
            saida['Discretizacao']['Barras totais'].append(bn)
            Asef = area_efeitiva(bn,bitolaL)
            saida['Area']['Area Efetiva'].append(a)
        else:
            print('Armadura insuficiente')
        

        if verificacao_area(Asef,Ac)[1]:
            Asef = Asef
        else:
            print('Armadura efetiva insuficiente')
    verifica,bx_veri,bs_veri = verificacao_admensional(fyd,parametros.eta,parametros.zeta,d,bw,fcd,Asef,Es,ecu)
    saida['Verificacao Linha Neutra']['Admensionais'].append([bx_veri,bs_veri])
    if verifica:
        saida['Verificacao Linha Neutra']['Aviso'].append(True)
        print(f'linha Neutra verificada')
        break
    else:
        saida['Verificacao Linha Neutra']['Aviso'].append(False)
        print('erro')
        break
             
        
print(saida)




fcb = resistencia_aderencia(bitolaL,parametros.fctkinf/parametros.gammac,fyd*1.15,saida['Altura Util']['Valor'][-1],h)
lbnec = comprimento_necessario(bitolaL,fcb,fyd,saida['Area']['Area Necessaria'][-1],saida['Area']['Area Efetiva'][-1],alfa=1)

al = decalagem(1,1,saida['Altura Util']['Valor'][-1],'Modelo 2')


momento_camada = momento_por_camada(saida['Altura Util']['Valor'][-1],parametros.zeta,saida['Admensionais'][-1][0],saida['Admensionais'][-1][2],fyd,saida['Discretizacao']['Barras'][-1],bitolaL)
print(momento_camada)
