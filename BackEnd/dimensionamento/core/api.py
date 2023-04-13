from core.scheme import Carregamentos, MetRigidez
from ninja import NinjaAPI
from typing import List
from ninja import Schema
from core.Auxiliar.Combinacoes import Combine
from core.Auxiliar.Rigidez_Direita import *


api = NinjaAPI()

@api.get("/hello")
def hello(request):
    return "Hello world"

@api.post("/test")
def test(request, carregamentos: Carregamentos):
    
    nome = []
    entrada = carregamentos.dict()['carregamento']

    #pequeno tratamento para o valor padrão a ser recebido
    for i in range(len(entrada)):
        nome.append(entrada[i]['name'])
    
    entrada = dict(zip(nome,entrada))
    
    #print(f'entrada: {entrada}')
    
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
        
        #vetor de forças
        vetor_de_forcas = []
        for chave in test.keys():
            comprimento = test[chave]["Comprimento"]/100
            temp = np.array([0,0,0,0])
            for carregamento in test[chave]["Carregamento"].values():

                incremento,elementos = vetor_local_forcas(carregamento["mag"],comprimento,carregamento["tipo"], trecho=test[chave]["Trecho"] , pos=carregamento["pos"], bd = test, chave=chave)
                temp = temp + np.array(incremento)
            vetor_de_forcas.append(temp.copy())
        
        vetor_glob = vetor_global_forcas(*vetor_de_forcas)
        
        vetor_glob_ord = ordenar_forcas(vetor_glob,d_global)
        
        kll, kpl= submatrizes_rigizes(k_ordenado,d_global)
        
        f_d, f_f = subvetores_forca(vetor_glob_ord,d_global)
        
        deslocabilidade_valores, elementos = deslocabilidade(kll,f_d,elementos)
        reacoes_externas = reacoes(kpl,deslocabilidade_valores,f_f)
        
        parcial_esforcos = []
        parcial_posicoes = []

        for chave,indice in zip(elementos.keys(),range(len(elementos))):
            parcial_esforcos.append(list(map(lambda x: round(x,2),(reacoes_internas(k_aglomerado[indice],elementos[chave]["Deslocabilidades"],elementos[chave]["Forcas Locais"])))))
            parcial_posicoes.append(elementos[chave]["Trecho"])
        
        saida = {}
        
        for indice,chave in enumerate(elementos.keys()):
        
            saida.update({chave:{
                "Trecho":parcial_posicoes[indice],
                "Cortante":[parcial_esforcos[indice][0],parcial_esforcos[indice][2]],
                "Momento":[parcial_esforcos[indice][1],parcial_esforcos[indice][3]]}})
            
        return {"Esforcos Internos":saida, "Reacoes externas":list(reacoes_externas)},test
    
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
                return 1
            case "Distribuido":
                eq_car = w
                temp = sym.integrate(eq_car,x)
                constante = el["Cortante"][0] - temp.subs({x:el["Trecho"][0], w:-mag})
                return temp + constante
   
    def momento(eq_cortante,mag,el):
        """
        Retorna a equacao do Momento
        tipo: Natureza do carregamento (pontual, distruibuido)
        mag: Maginitude do carregamento
        el: elementos discretizados
        """
        x = sym.Symbol("x")
        w = sym.Symbol("w")
        temp = sym.integrate(eq_cortante,x)
        constante = el["Momento"][0] - temp.subs({w:-mag, x:el["Trecho"][0]})
        return (temp + constante).subs({w:-mag})

    momento_temp = []
    posicoes_temp = []
    padrao = 50
    j = 0
    x = sym.Symbol("x")
    momento_eq = []
    saida,entrada = interno(data)
    print(saida)
    print('----------------')
    print(entrada)
    
    #Obtendo a funcao de momento para cada tramo
    for chave in entrada.keys():
        for chave_carregamento in entrada[chave]['Carregamento'].keys():
            temp = cortante(entrada[chave]["Carregamento"][chave_carregamento]['tipo'],entrada[chave]["Carregamento"][chave_carregamento]['mag'],saida['Esforcos Internos'][chave])
            momento_temp.append(momento(temp,entrada[chave]["Carregamento"][chave_carregamento]['mag'],saida['Esforcos Internos'][chave]))
            print(momento_temp)
        if len(momento_temp) >1:
            for m in momento_temp:
                j = m + j
            momento_eq.append(j)
        else:
            momento_eq.append(momento_temp[0])
        momento_temp.clear()
        
    print(momento_eq)
    
    for chave,eq in zip(entrada.keys(),momento_eq):

        posicoes_temp.append(saida['Esforcos Internos'][chave]['Trecho'][0])
        momento_temp.append(float(saida['Esforcos Internos'][chave]['Momento'][0]))

        intervalo = (saida['Esforcos Internos'][chave]['Trecho'][1]-posicoes_temp[0])/(padrao)
        print(f'intervalo = {intervalo}')
        for i in range(1,padrao+1,1):
            eq_temp = eq.subs({x:(posicoes_temp[0] +intervalo*i)/100})
            momento_temp.append(round(float(eq_temp),2))
            posicoes_temp.append((posicoes_temp[0] +intervalo*i))
        
        saida["Esforcos Internos"][chave]['Trecho'] = posicoes_temp.copy()
        saida["Esforcos Internos"][chave]['Momento'] = momento_temp.copy()
        
        posicoes_temp.clear()
        momento_temp.clear()
                
                
    print(saida)

    
    return saida
