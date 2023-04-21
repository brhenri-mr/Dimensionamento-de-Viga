from core.scheme import Carregamentos, MetRigidez
from ninja import NinjaAPI
from typing import List
from ninja import Schema
from core.Auxiliar.Combinacoes import Combine
from core.Auxiliar.Rigidez_Direita import *
from numba import jit
from core.Auxiliar.Auxiliar import compatibilizacao
import copy


api = NinjaAPI()

@api.get("/hello")
def hello(request):
    return "Hello world"

@api.post("/test")
def test(request, carregamentos: Carregamentos):
    """
    A bagunça de valores negativo se deve a descontinuidade que geram as analises locais:
    em um lado um momento ou cortante é positivo e do outro lado o mesmo momento é negativo
    foi feito um ajuste de forma empírica
    """
    
    nome = []
    entrada = carregamentos.dict()['carregamento']

    #pequeno tratamento para o valor padrão a ser recebido
    for i in range(len(entrada)):
        nome.append(entrada[i]['name'])
    
    entrada = dict(zip(nome,entrada))
    
    
    comb = Combine(entrada, {"Local":"Bibliotecas, arquivos, depósitos, oficinas e garagens"})
    
    
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
            k_aglomerado.append(rigidez_local(elemento["Comprimento"]/100,448000000))
            
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
        
        
        for i in range(quantidade_comb):
        #vetor de forças

            elementos = copy.deepcopy(test)
            
            vetor_de_forcas = []
            for chave in test.keys():
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

        match tipo:
            case "Pontual":
                return -mag
            case "Distribuido":
                eq_car = w
                temp = sym.integrate(eq_car,x)
                constante = el["Cortante"][0] - temp.subs({x:el["Trecho"][0]/100, w:-mag})
                return (temp + constante).subs({w:-mag})
            case 'Nada':
                return el["Cortante"][0]

    def momento(eq_cortante,mag,el):
        """
        Retorna a equacao do Momento
        tipo: Natureza do carregamento (pontual, distruibuido)
        mag: Maginitude do carregamento
        el: elementos discretizados
        """
        w = sym.Symbol("w")
        x = sym.Symbol("x")
        temp = sym.integrate(eq_cortante,x)
        constante = -el["Momento"][0] - temp.subs({x:el["Trecho"][0]/100})
        return (temp + constante)
    
    def maxmomento(cortante,momento,el):
        
        saida = {'Momento':[],'Trecho':[],'Cortante':[]}
        x = sym.Symbol('x')
        xs = sym.solve(cortante,x)
        momento_pronto = sym.lambdify(x,momento)
        cortante_pronto = sym.lambdify(x,cortante)
        for coordenada in xs:
            #Vendo se esta na barra
            if coordenada*100>= el['Trecho'][0] and coordenada*100<=el['Trecho'][1]:
                saida['Momento'].append(round(float(momento_pronto(coordenada)),2))
                saida['Trecho'].append(round(float(coordenada*100),2))
                saida['Cortante'].append(round(float(cortante_pronto(coordenada)),2))
            else:
                pass
        return saida
    
    
    s_global = {'Trecho':[],'Momento':[],'Cortante':[]}
    momento_temp = []
    momento_el = []
    cortante_el = []
    cortante_temp = []
    cortante_eq = []
    j = 0
    incremento = 0
    comb_atual = 0
    momento_eq = []
    saida,entrada,quantidade_comb = interno(data)
    
    #Obtendo a funcao de momento para cada tramo
    #Rodando cada combinacao
    for i in range(quantidade_comb):
        #rodando cada elemento
        for chave in entrada.keys():
            #Obtendo informacoes sobre cada carregamento
            if len(entrada[chave]['Carregamento'].keys())>0:
                for chave_carregamento in entrada[chave]['Carregamento'].keys():
                    if entrada[chave]["Carregamento"][chave_carregamento]['tipo'] =="Pontual":
                        # por cortamos a um infitessimo a regiao do ponto, o carregamento pontual nao pode existir, mas sua energia esta nas reacoes
                        pass
                    else:
                        print(saida['Esforcos Internos'][i][chave])
                        temp = cortante(entrada[chave]["Carregamento"][chave_carregamento]['tipo'],entrada[chave]["Carregamento"][chave_carregamento]['mag']*entrada[chave]["Carregamento"][chave_carregamento]['comb'][i],saida['Esforcos Internos'][i][chave])
                        momento_temp.append(momento(temp,entrada[chave]["Carregamento"][chave_carregamento]['mag']*entrada[chave]["Carregamento"][chave_carregamento]['comb'][i],saida['Esforcos Internos'][i][chave]))
                        cortante_temp.append(temp)
            else:
                temp = cortante('Nada',1,saida['Esforcos Internos'][i][chave])
                momento_temp.append(momento(temp,1,saida['Esforcos Internos'][i][chave]))
                cortante_temp.append(temp)
            #definicao das eqs de momento para uma elemento e uma combinacao
            if len(momento_temp) >1:
                for m in momento_temp:
                    j = m + j
                momento_el.append(j)
                j = 0
                for m in cortante_temp:
                    incremento = m + incremento
                cortante_el.append(incremento)
                incremento = 0

                    
            elif len(momento_temp)==1:
                momento_el.append(momento_temp[0])
                cortante_el.append(cortante_temp[0])
            momento_temp.clear()
            cortante_temp.clear()
            
        #vetor global das eq de momento para cada elemento com todas as combinacoes
        #momento_eq = [[elementos comb1],[elementos 2],....]
        momento_eq.append(momento_el.copy())
        cortante_eq.append(cortante_el.copy())
        cortante_el.clear()
        momento_el.clear()
        
    generico = {}
    print(cortante_eq)
    #acessar uma elemento, indice corresponde a combinacao
    for indice,chave in enumerate(entrada.keys()):
        for comb_momento, comb_cortante in zip(momento_eq,cortante_eq):
            #previnindo equacoes inexistentes
            s = maxmomento(comb_cortante[indice],comb_momento[indice],saida['Esforcos Internos'][comb_atual][chave])
            s_global = compatibilizacao(s,saida['Esforcos Internos'][comb_atual][chave],s_global,'Positivo')
            comb_atual = 1+ comb_atual
            
        generico[chave] = copy.deepcopy(s_global)
        comb_atual = 0
        s_global = {'Trecho':[],'Momento':[],'Cortante':[]}
    
    saida["Esforcos Internos"] = generico

                

    '''
    for chave,eq in zip(entrada.keys(),momento_eq):
        posicoes_temp.append(saida['Esforcos Internos'][chave]['Trecho'][0])
        momento_temp.append(float(-saida['Esforcos Internos'][chave]['Momento'][0]))

        intervalo = (saida['Esforcos Internos'][chave]['Trecho'][1]-posicoes_temp[0])/(padrao)
        #aplicando valores
        for i in range(1,padrao+1,1):
            eq_temp = eq.subs({x:(posicoes_temp[0] +intervalo*i)/100})
            momento_temp.append(round(float(eq_temp),2))
            posicoes_temp.append((posicoes_temp[0] +intervalo*i))
        
        saida["Esforcos Internos"][chave]['Trecho'] = posicoes_temp.copy()
        saida["Esforcos Internos"][chave]['Momento'] = momento_temp.copy()
        
        posicoes_temp.clear()
        momento_temp.clear()
                
    '''         
    print(saida)
    return saida
