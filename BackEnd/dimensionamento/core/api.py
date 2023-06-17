
#Django ninja
from core.scheme import Carregamentos, MetRigidez, Caracteristicas
from ninja import NinjaAPI
from typing import List
from ninja import Schema
#funcoes internas
from core.Auxiliar.Combinacoes import Combine
from core.Auxiliar.Rigidez_Direita import *
from core.Auxiliar.Auxiliar import compatibilizacao
from core.Auxiliar.Dimensionamento import *
from core.Auxiliar.NBR6118 import ParametrosConcreto
#Auxiliares
import copy


api = NinjaAPI()

momento_maximo = 0
cortante_max = 0

@api.get("/hello")
def hello(request):
    return "Hello world"

@api.post("/Combinacoes")
def test(request, carregamentos: Carregamentos):
    """
    A bagunça de valores negativo se deve a descontinuidade que geram as analises locais:
    em um lado um momento ou cortante é positivo e do outro lado o mesmo momento é negativo
    foi feito um ajuste de forma empírica
    """
    
    nome = []
    entrada = carregamentos.dict()['carregamento']
    informacoes = carregamentos.dict()['ed']

    #pequeno tratamento para o valor padrão a ser recebido
    for i in range(len(entrada)):
        nome.append(entrada[i]['name'])
    
    entrada = dict(zip(nome,entrada))
    
    
    comb = Combine(entrada, informacoes)
    
    
    test = comb.ELU(modo='Normal')
    
    
    return comb.json()

@api.post("/MetRigidez")
def MetRigidez(request, data:MetRigidez):
    import sympy as sym
    
    def interno(data):
        
        #Variaveis
        nome = []
        k_aglomerado = []
        d_global = []
        final = []
        reacoes_externas = []
        
        #Dados vindo do FrontEnd
        entrada = data.dict()["carregamento"]
        apoios =  data.dict()["apoios"]
        comprimento = data.dict()["comprimento"]
        Es = ParametrosConcreto(int(data.dict()['fck']),'Rural','Viga',0.1,1,1,data.dict()['agregado']).Ecs*10**-5
        rigidez = data.dict()['MomentodeInercia']*Es
        combinacao = data.dict()['combinacao']
        
        #Normalizando os dados
        for i in range(len(entrada)):
            nome.append(entrada[i]['name'])
        
        entrada = dict(zip(nome,entrada))
        for chave in entrada.keys():
            if entrada[chave]["tipo"] == "Pontual":
                entrada[chave]["pos"] = entrada[chave]["pos"][0]
        
        #Passando para dicionario
        apoios = dict(zip(list(range(len(apoios))),apoios))
        
        test = entrada_test(entrada,apoios,comprimentoTotal=comprimento)
        
        for elemento in test.values():
            k_aglomerado.append(rigidez_local(elemento["Comprimento"]/100,rigidez))
            
            if len(d_global) ==0:
                for coordenada_apoios in elemento["Grau de Liberdade"]:
                    [d_global.append(item) for item in coordenada_apoios]
            else:
                [d_global.append(item) for item in elemento["Grau de Liberdade"][1]]
        
        k_glob = rigidez_global(k_aglomerado)
        
        k_ordenado = ordenador(k_glob,d_global)
        
        for chave in test.keys():
            for carregamento in test[chave]["Carregamento"].values():
                if carregamento["comb"]!=0:
                    quantidade_comb = len(carregamento["comb"])
                    break
        
        # 0 == envoltoria
        if combinacao == 0:
            quantidade_comb = range(quantidade_comb)
        else:
            quantidade_comb = [combinacao-1]
        
    
        
        for i in quantidade_comb:
            if len(quantidade_comb) ==1:
                i = quantidade_comb[0]
        #vetor de forças
        
            elementos = copy.deepcopy(test)
            
            vetor_de_forcas = []
            for chave in test.keys():
                '''
                chave = el
                '''
                comprimento = test[chave]["Comprimento"]/100
                temp = np.array([0,0,0,0])
                for carregamento in test[chave]["Carregamento"].values():
                    incremento,elementos = vetor_local_forcas(carregamento["mag"]*carregamento["comb"][i],comprimento,carregamento["tipo"], trecho=test[chave]["Trecho"] , pos=carregamento["pos"], bd = elementos, chave=chave)
                    temp = temp + np.array(incremento)
                vetor_de_forcas.append(temp.copy())
            
            vetor_glob = vetor_global_forcas(*vetor_de_forcas)
            
            vetor_glob_ord = ordenar_forcas(vetor_glob,d_global)
            
            kll, kpl= submatrizes_rigizes(k_ordenado,d_global)
            
            f_d, f_f = subvetores_forca(vetor_glob_ord,d_global)
            
            deslocabilidade_valores, elementos = deslocabilidade(kll,f_d,copy.deepcopy(elementos))
            reacoes_externas.append(list(reacoes(kpl,deslocabilidade_valores,f_f)))

            parcial_esforcos = []
            parcial_posicoes = []

            for chave,indice in zip(elementos.keys(),range(len(elementos))):
                parcial_esforcos.append(list(map(lambda x: round(x,2),(reacoes_internas(k_aglomerado[indice],elementos[chave]["Deslocabilidades"],elementos[chave]["Forcas Locais"],elementos[chave]['Grau de Liberdade'])))))
                parcial_posicoes.append(elementos[chave]["Trecho"])

            saida = {}
        
            for indice,chave in enumerate(elementos.keys()):
                saida.update({chave:{
                    "Trecho":parcial_posicoes[indice],
                    "Cortante":[parcial_esforcos[indice][0],parcial_esforcos[indice][2]],
                    "Momento":[parcial_esforcos[indice][1],parcial_esforcos[indice][3]]}})
            final.append(copy.deepcopy(saida))

        return {"Esforcos Internos":final, "Reacoes externas":reacoes_externas},test,quantidade_comb

    def cortante(tipo:str,mag: float, el:dict):
        
        """
        Retorna a equacao do cortante
        tipo: Natureza do carregamento (pontual, Distribuido)
        mag: Maginitude do carregamento
        el: elementos discretizados
        """
        
        w = sym.Symbol("w")
        x = sym.Symbol("x")
        if mag==0:
            return 0
        else:
            match tipo:
                case "Pontual":
                    return -mag
                case "Distribuido":
                    eq_car = w
                    temp = sym.integrate(eq_car,x)
                    return (temp).subs({w:-mag})
                case 'Nada':
                    return el["Cortante"][0]
    
    def momento(eq_cortante):
        """
        Retorna a equacao do Momento
        tipo: Natureza do carregamento (pontual, distruibuido)
        mag: Maginitude do carregamento
        el: elementos discretizados
        """
        x = sym.Symbol("x")
        temp = sym.integrate(eq_cortante,x)
        return temp 
    
    def constante(eq,el,tipo):
        """
        Função que retorna a constante de integracao das eq.
        """
        x = sym.Symbol("x")
        try:
            constante = (1 if tipo=='Cortante' else -1)*el[tipo][0] - eq.subs({x:el["Trecho"][0]/100}) if eq != 0 else 0 
            return (eq+constante) 
        except:
            return eq

    def equacao_esforco(entrada,chave,saida,var_auxiliar,i):
        '''
        eq: equação que será utilizada
        '''
        temp = []
        retornar= 0
        incremento = -1
        if len(entrada[chave]['Carregamento'].keys())>0:
            '''
            i = combinação a ser pesquisada
            chave = elemento discretizado a ser pesquisado 
            saida = dici9onario vindo do método da rigidez direita
            '''
            for chave_carregamento in entrada[chave]['Carregamento'].keys():
                incremento +=1
                if entrada[chave]["Carregamento"][chave_carregamento]['tipo'] =="Pontual":
                   
                    temp.append(cortante('Nada',1,saida['Esforcos Internos'][i][chave]))
                else:
                    #Decisao da equacao 
                    temp.append(cortante(entrada[chave]["Carregamento"][chave_carregamento]['tipo'],entrada[chave]["Carregamento"][chave_carregamento]['mag']*entrada[chave]["Carregamento"][chave_carregamento]['comb'][var_auxiliar],saida['Esforcos Internos'][i][chave]))
                    
        else:
            temp.append(cortante('Nada',1,saida['Esforcos Internos'][i][chave]))

        for eq in temp:
            if eq=='discartar':
                pass
            else:
                retornar = retornar + eq
    
        
        
        return retornar
    
    def maxmomento(cortante,momento,el,padrao=15,elemento=False,x_adicional=[]):
        '''
        Funcao que retorna o momento maximo qque uma funcao tem para um intervalo
        cortante: funcao de cortanto do sympy
        momento: funcao de momento so sympy
        el: elemento
        padrao: variavel que contra q quantidade de pontos a mais a serem gerados
        
        '''
        #Dados
        saida = {'Momento':[],'Trecho':[],'Cortante':[]}
        x = sym.Symbol('x')
        xs = sym.solve(cortante,x)
        xs_usados = []
        momento_pronto = sym.lambdify(x,momento)
        cortante_pronto = sym.lambdify(x,cortante)
        
        
        #Iterador
        incrimento = (el['Trecho'][1]-el['Trecho'][0])/(padrao)
        
        if elemento:
            
            if momento =='discartar':
                pass
            else:
                for i in range(1,padrao):
                        saida['Momento'].append(-1*round(float(momento_pronto(el['Trecho'][0]/100+incrimento*i/100)),2))
                        saida['Trecho'].append(round(float(el['Trecho'][0]+incrimento*i),2))
                        saida['Cortante'].append(round(float(cortante_pronto(el['Trecho'][0]/100+incrimento*i/100)),2))
            

            for coordenada in x_adicional:
                saida['Momento'].append(-1*round(float(momento_pronto(coordenada/100)),2))
                saida['Trecho'].append(round(float(coordenada),2))
                saida['Cortante'].append(round(float(cortante_pronto(coordenada/100)),2))
            

            return saida
        else:
            for coordenada in xs:

                #Vendo o esforco esta no intervalo da barra
                if coordenada*100>= el['Trecho'][0] and coordenada*100<=el['Trecho'][1]:
                    saida['Momento'].append(-1*round(float(momento_pronto(coordenada)),2))
                    saida['Trecho'].append(round(float(coordenada*100),2))
                    saida['Cortante'].append(round(float(cortante_pronto(coordenada)),2))
                    xs_usados.append(round(coordenada*100,2))
                    
            return xs_usados
    
    def maximo_momentona_secao(el,esforco):
        
        maximo = [0,0]

        for chave in el['Esforcos Internos'].keys():
            for elemento,posicao in zip(el['Esforcos Internos'][chave][esforco],el['Esforcos Internos'][chave]['Trecho']):
                if abs(elemento*100)>abs(maximo[1]):
                    maximo[1] = elemento*100
                    maximo[0] = posicao
        maximo[1] = maximo[1]*(1/100 if esforco =='Cortante' else 1)
        return maximo
    
    s_global = {'Trecho':[],'Momento':[],'Cortante':[]}
    momento_el = []
    cortante_el = []
    cortante_eq = []
    comb_atual = 0
    momento_eq = []
    saida,entrada,quantidade_comb = interno(data)
    global momento_maximo
    global cortante_max

    
    #Obtendo a funcao de momento para cada tramo
    #Rodando cada combinacao
    for i in range(len(quantidade_comb)):
        #combinacao a ser pesquisadda
        if len(quantidade_comb)==1:
            var_auxiliar = quantidade_comb[0]
        else:
            var_auxiliar = i
        #rodando cada elemento para uma combinacao
        for chave in entrada.keys():
            #Obtendo informacoes sobre cada carregamento
            temp_eq = equacao_esforco(entrada,chave,saida,var_auxiliar,i)
            temp_eq = constante(temp_eq,saida['Esforcos Internos'][i][chave],'Cortante')
            cortante_el.append(temp_eq)
            
                
            temp_m = momento(temp_eq)
            momento_el.append(constante(temp_m,saida['Esforcos Internos'][i][chave],'Momento'))
          
        momento_eq.append(momento_el.copy())
        cortante_eq.append(cortante_el.copy())
        momento_el.clear()
        cortante_el.clear()
        


    generico = {}
    xs =[]
    
    

    
    
    for indice,chave in zip(range(len(entrada.keys())),entrada.keys()):
        '''
        chave: elemnto a ser pesquisado
        indice: combinacao a ser pesquisada
        '''

        for _ in ['x complementar','normal',]:
            for comb_momento, comb_cortante in zip(momento_eq,cortante_eq):

                '''
                comb_momento: lista de equacoes de momento para toda barra e para uma combinacao
                comb_cortante: lista de equacoes de cortante para toda barra e para uma combinacao
                '''

                if _ =='x complementar':
                    temp_x = maxmomento(comb_cortante[indice],comb_momento[indice],saida['Esforcos Internos'][comb_atual][chave])
                    xs.append(*temp_x) if len(temp_x)!=0 else 0
                    comb_atual = 1+ comb_atual
                else:
                     #previnindo equacoes inexistentes
                    #s = {'Momento':saida['Esforcos Internos'][comb_atual][chave]['Momento'],'Trecho':saida['Esforcos Internos'][comb_atual][chave]['Trecho'],'Cortante':saida['Esforcos Internos'][comb_atual][chave]['Cortante']}
                    s = maxmomento(comb_cortante[indice],comb_momento[indice],saida['Esforcos Internos'][comb_atual][chave],elemento=True,x_adicional=xs)
                    s_global = compatibilizacao(s,saida['Esforcos Internos'][comb_atual][chave],s_global,'Positivo')
                    
                    comb_atual = 1+ comb_atual
            if _ =='x complementar': 
                comb_atual = 0
            else:
                generico[chave] = copy.deepcopy(s_global)
                comb_atual = 0
                xs = []
                s_global = {'Trecho':[],'Momento':[],'Cortante':[]}
    

    saida["Esforcos Internos"] = generico       

    
    saida['Maximo'] = maximo_momentona_secao(saida,'Momento')
    saida['Cortante Maximo'] = maximo_momentona_secao(saida,'Cortante')

    momento_maximo = saida['Maximo']  if len(quantidade_comb)>1 else 0
    print(saida['Maximo'])
    cortante_max = saida['Cortante Maximo']  if len(quantidade_comb)>1 else 0
    return saida

@api.post("/Dimensionamento")
def dimensionamento(request,data:Caracteristicas):
    """
    Api para dimensionamento da secao trasnversal retangular
    """
    def secao_transversal(momento,bitolaL,parametros,h,fcd,c,bw,Es,fyd,bitolaT,Ac,cnom,w0,bxmaximo,sinal,ductilidade):
        '''
        Funcao para dimensionar a secao: areas de armadura 
        '''
        bn, nc = distruibuicao_camadas(1,bitolaL,bw,cnom,bitolaT,parametros.av,parametros.ah)
        bn = 2
        numero_barras = 0
        sair = False
        
        contador_qualquer = 0
        
        
        saida = {'Admensionais':[],
         'Altura Util':{
            'Valor':[],
            'ys':[],
            'Aviso':[]
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
             'Momento Carregamento':[momento],
             'Aviso':[],
             'Sinal':sinal
            },
        'Area':{
            'Area Efetiva':[],
            'Area Necessaria':[],
            'Area Adotada':[],
            'Aviso':[],
            'Aviso_arredondado':[]
        },
        'Discretizacao':{
            'Barras por camada':[],
            'Barras calculadas':[],
            'Barras totais':[],
            'Arredondamento de Bn':[]
        },
        'Verificacao Linha Neutra':
            {
                'Aviso':[],
                'Admensionais':[],
            },
        'Parametros':{
            'zeta':parametros.zeta,
            'Cobrimento':cnom,
            'eta':parametros.eta,
            'ecu':parametros.ecu,
            'av':parametros.av,
            'ah':parametros.ah,
            'w0':w0,
            'fcktsup':parametros.fctksup,
            'Ac':Ac
            
        }
            
        } 
    
        #parametros utilizados 
        
    
    
        
        while True  :
            #enquanto o numero de barras necessarias for maior que numero de barras calculadas, refazer o calculo
            while bn>numero_barras:
                
                #Cg das armaduras
                contador_qualquer = contador_qualquer + 1
                if contador_qualquer>=100:
                    sair = True
                    break
                
                ys, numero_barras, barra = incremento_cg_armaduras(bitolaL,parametros.av,h,numero_de_barras=bn,barras_por_camada=nc)
                saida['Altura Util']['ys'].append(ys)
                saida['Discretizacao']['Barras calculadas'].append(barra)
                #Altura util
                d = h - cnom - bitolaT - ys
                saida['Altura Util']['Valor'].append(d)
                saida['Altura Util']['Aviso'].append(ys<=0.1*h)
                if not (ys<=0.1*h) and ductilidade  :
                    sair=True
                    break
                
                #verificao momento
                momento, momentomin, momentomax, aviso = verificacao_momentos(momento, parametros.fctksup,w0,bw,d,fcd,parametros.zeta,c,ductilidade)
                saida['Verificacao Momento']['Momento Minimo'].append(momentomin)
                saida['Verificacao Momento']['Momento Maximo'].append(momentomax)
                saida['Verificacao Momento']['Momento de Calculo'].append(momento)
                saida['Verificacao Momento']['Aviso'].append(aviso)
                
                if momento==-1:
                    sair = True
                    break
                
                #admensionais(parametros.zeta,momento,parametros.eta,bw,d,fcd,Es,fyd,ecu)
                bx, bz, bs,aviso = admensionais(parametros.zeta,momento,parametros.eta,bw,d,fcd,Es,fyd,parametros.ecu)
                saida['Admensionais'].append([bx,bz,bs,aviso])
                if aviso =='Impossivel Calcular a posição da linha Neutra':
                    '''Foi impossivel Calcular a linha neutra, necessário aumentar a altura da viga'''
                    sair =True
                    break

                #Area de aco 
                a = area_aco(momento,bz,d,bs,fyd)
                a_min, verificacao, criterio = verificacao_area(a,Ac,str(fcd*14))
                saida['Area']['Area Necessaria'].append(a)
                #verificacao das areas
                if ductilidade:
                    if verificacao:
                        saida['Area']['Aviso'].append(criterio)
                    
                    else:
                        saida['Area']['Aviso'].append(criterio)
                        a = a_min
                else:
                     saida['Area']['Aviso'].append("ignorar")
                    
                saida['Area']['Area Adotada'].append(a)
                #bn = barras necessarias
                #nc barras por cama
                bn, nc = distruibuicao_camadas(a,bitolaL,bw,cnom,bitolaT,parametros.av,parametros.ah)
                

                
                #armadura minima
                if bn ==1:
                    bn = bn+1
                    saida['Discretizacao']['Arredondamento de Bn'] = 'Sim'
                else:
                    saida['Discretizacao']['Arredondamento de Bn'] = 'Não'
                
                saida['Discretizacao']['Barras por camada'].append(nc)
                saida['Discretizacao']['Barras totais'].append(numero_barras)
                Asef = area_efeitiva(numero_barras,bitolaL)
                
                saida['Area']['Area Efetiva'].append(Asef)
                    
                
                if ductilidade:
                    a_min, verificacao, criterio = verificacao_area(Asef,Ac,str(fcd*14))
                    if verificacao:
                        saida['Area']['Aviso_arredondado'].append('Armadura suficiente')
                        Asef = Asef
                        
                    else:
                        saida['Area']['Aviso_arredondado'].append('Armadura insuficiente')
                        Asef = a_min
                        

                else:
                    saida['Area']['Aviso_arredondado'].append('ignorar')
            
                    
            if sair:
                saida['Verificacao Linha Neutra']['Admensionais'].append(['ignorar','ignorar'])
                saida['Verificacao Linha Neutra']['Aviso'].append('ignorar')
                break
            
            verifica,bx_veri,bs_veri = verificacao_admensional(fyd,parametros.eta,parametros.zeta,d,bw,fcd,Asef,Es,parametros.ecu)
            saida['Verificacao Linha Neutra']['Admensionais'].append([bx_veri,bs_veri])
            if ductilidade:
                if verifica and bx_veri<bxmaximo:
                    saida['Verificacao Linha Neutra']['Aviso'].append(True)
                    break
                else:
                    saida['Verificacao Linha Neutra']['Aviso'].append(False)
                    break
            else:
                saida['Verificacao Linha Neutra']['Aviso'].append('ignorar')
                break
        

            
        return saida
    
    
    
    caracteristicas = data.dict()
    try:
        momento = abs(momento_maximo[1])
        sinal = -1 if momento_maximo[1]<0 else 1
    except:
        momento = abs(momento_maximo)
        sinal = -1 if momento_maximo<0 else 1
        
    parametros = ParametrosConcreto(caracteristicas['fck'],caracteristicas['classeambiental'],'Viga',caracteristicas['dL'],caracteristicas['bw'],caracteristicas['h'],caracteristicas['agregado'])
    Es = 200_000
    saida = secao_transversal(momento,caracteristicas['dL'],parametros,caracteristicas['h'],caracteristicas['fck']/14,caracteristicas['fck'],caracteristicas['bw'],Es,caracteristicas['fyk']/11.5,caracteristicas['dT'],caracteristicas['bw']*caracteristicas['h'],parametros.cobrimento,parametros.w0, parametros.bxmaximo,sinal,caracteristicas['ductilidade'])
    
    return saida


