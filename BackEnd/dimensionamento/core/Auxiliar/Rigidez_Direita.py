import numpy as np

def entrada_test(data: dict, apoio: dict, comprimentoTotal:float):
    """
    recebe o Json do React
    data: JSON com propriedade das viga 
    apoio: JSON com a especificacao dos apoios
    """
    
    def comprimento_trecho(carregamento:dict, apoios:dict, comprimentototal:float) ->list:
        '''
        Separa do vetor geral data, um vetor do comprimento de cada trecho 
        de elemento
        
        carregamento = próprio data
        '''
        #Variaveis
        comprimento = []
        
        #Definicao elementos pelo carregamentos
        for chave in carregamento.keys():
            temp = carregamento[chave]['pos']
            if isinstance(temp,int):
                temp = [temp]
            else:
                temp = [*temp]
            [comprimento.append(i) if i not in comprimento else 0 for i in temp]
            
        #Definicao do eelementos pelo apoios
        for chave in apoios.keys():
            if apoios[chave]['value'] not in comprimento:
                comprimento.append(apoios[chave]['value'])
                
        #Conferencia do total ou inicio
        if 0 not in comprimento:
            comprimento.append(0)
        elif comprimentototal not in comprimento:
            comprimento.append(comprimentototal)
        
        return sorted(comprimento)
    
    def grau_de_liberdade(parametro:str)->int:
        #[vetor para cima, momento]
        match parametro:
            case 'Apoio Rotulado':
                return [0,1]
            case 'Apoio Simples':
                return [0,1]
            case 'Engaste':
                return [0,0]
            case 'Livre':
                return [1,1]
            
        return 'Caso Nao Cadastrado'
            
    
    #Dados
    comprimento = comprimento_trecho(data,apoio,comprimentoTotal)
    numero_nos = len(comprimento) -1
    elementos={}
    
    #Definicao da estrtura do obejto elementos 
    for i in range(numero_nos):
        elementos[f'El{i+1}'] = {'Trecho':comprimento[i+0:2+i],
                                 'Comprimento':comprimento[i+1]-comprimento[i],
                                 'Carregamento':{},
                                 'Grau de Liberdade':[],
                                 'Deslocabilidades':[],
                                 'Forcas Locais': [0,0,0,0]
                                 }
    
    #definicao do objeto interno carregamentos
    for chave_data in data.keys():
        temp = data[chave_data]['pos']
        #Verificar se é esforço pontual
        if isinstance(temp,int):
            for chave_el in elementos.keys():
                if temp in elementos[chave_el]['Trecho']:
                    contador = 1 + len(elementos[chave_el]['Carregamento'])
                    elementos[chave_el]['Carregamento'][f'Car{contador}'] = {'nome':chave_data,'tipo':data[chave_data]['tipo'],'mag':data[chave_data]['mag'],'pos':temp,'comb':data[chave_data]['comb']}
                    break
        #Verificar se é esforço distruibuido
        else:
            for chave_el in elementos.keys():
                contador = 1 + len(elementos[chave_el]['Carregamento'])
                if temp[0] <= elementos[chave_el]['Trecho'][0] and temp[1] >= elementos[chave_el]['Trecho'][1]: #esta dentro do intervalo
                    elementos[chave_el]['Carregamento'][f'Car{contador}'] = {'nome':chave_data,'tipo':data[chave_data]['tipo'],'mag':data[chave_data]['mag'],'pos':elementos[chave_el]['Trecho'],'comb':data[chave_data]['comb']}
    
    #Definindo valores para grau de liberdade
    for chave_el in elementos.keys():
        for item in elementos[chave_el]['Trecho']:
            for chave in apoio.keys():
                temp = apoio[chave]['value']
                if temp == item:
                    nome_apoio =apoio[chave]['tipo']
                    elementos[chave_el]['Grau de Liberdade'].append(grau_de_liberdade(nome_apoio))
                    break
            #Caso nao encontre na primeira tentativa, ele adotada um livre
            if len(elementos[chave_el]['Grau de Liberdade']) in [0]:
                elementos[chave_el]['Grau de Liberdade'].append(grau_de_liberdade("Livre"))
        if len(elementos[chave_el]['Grau de Liberdade']) in [1]:
                elementos[chave_el]['Grau de Liberdade'].append(grau_de_liberdade("Livre"))


    
    return elementos
                
def rigidez_local(l:int, rigidez:int):
    '''
    Matriz de rigidez local do elemento
    l: largura do vão do elemento
    rigidez: produto entre módulo de Elastico
    '''
    
    #gera a matriz local do elemento
    ke = np.array([[12, 6 * l, -12, 6 * l],
                   [6 * l, 4 * l**2, -6 * l, 2 * l**2],
                   [-12, -6 * l, 12, -6 * l],
                   [6 * l, 2 * l**2, -6 * l, 4 * l**2]])

    return (rigidez / pow(l, 3)) * ke

def rigidez_global(vetores:list):
    '''
    Define a matriz global da viga
    vetores: lista de matriz de rigidez local
    '''
    #Dados
    incremento = 0
    dim = len(vetores)
    saida = np.zeros((4 + 2 * (dim - 1), 4 + 2 * (dim - 1)), dtype=float)
    
    #concateção das matrizes locais
    for vetor in vetores:
        for linha in range(4):
            for coluna in range(4):

                saida[linha + 2 * incremento][coluna + 2 * incremento] = round(vetor[linha][coluna] +saida[linha + 2 * incremento][coluna + 2 * incremento], 3)

        incremento = 1 + incremento
    return saida

def ordenador(k, d):
    '''
    Orderna a matriz global de rigidez em funcao da matriz de deslocabilidade
    k: matriz de rigidez global
    d: vetor das deslocabilidade sglobais dos nos
    '''
    #Dados
    local = []
    ord = []
    final = []
    for indice, item in enumerate(d):
        if item != 0:
            local.append(indice)
    for item in local:
        ord.append(k[item])

    for i in range(len(d)):
        if i in local:
            pass
        else:
            ord.append(k[i])
    ord = np.array(ord).T

    for item in local:

        final.append(ord[item])

    for i in range(len(d)):
        if i in local:
            pass
        else:
            final.append(ord[i])

    return np.array(final).T

def deslocamento(k, ford):
    criterio = len(ford)
    matriz = np.zeros((criterio, criterio), dtype=float)
    for i in range(criterio):
        for j in range(criterio):
            matriz[i][j] = k[i][j]
    vec = np.dot(np.array(ford), np.linalg.inv(matriz))
    return vec

def vetor_local_forcas(carga:float, comprimento:int, tipo:str,trecho:list,pos:int, bd, chave) -> list:
    '''
    Vetor das forças local para cada elemento
    carga: magnitude da força ou momento aplicado
    comprimento: comprimento do elemento em questão
    tipo: formato/natureza do carregamento (momento, distribuido, pontual, triangular)
    trecho: coordenadas dos pontos
    pos: coordenada da aplicacao dos carregamentos
    '''

    if tipo == 'Distribuido':
        v_um = -carga * comprimento / 2
        v_dois = v_um
        momento_um = -carga * (comprimento**2) / 12
        momento_dois = -momento_um
        bd[chave]["Forcas Locais"] = np.array([v_um, momento_um, v_dois, momento_dois])+bd[chave]["Forcas Locais"]
        return [v_um, momento_um, v_dois, momento_dois],bd
    elif tipo == "Pontual":
        if trecho[0] == pos:
            bd[chave]["Forcas Locais"] = bd[chave]["Forcas Locais"] #+np.array([-carga, 0, 0, 0])
            return [-carga, 0, 0, 0],bd
        else:
            bd[chave]["Forcas Locais"] = bd[chave]["Forcas Locais"] #+np.array([0, 0,-carga, 0])  
            return [0, 0,-carga, 0],bd
        
    elif tipo == 'Momento Pontual':
        a = comprimento[0]
        b = comprimento[1]
        l = a + b
        v_um = -6 * carga * a * b / l**3
        v_dois = 6 * carga * a * b / l**3
        momento_um = -carga * b * (2 * a - b) / l**2
        momento_dois = -carga * a * (2 * b - a) / l**2
        
        bd[chave]["Forcas Locais"].append([v_um, momento_um, v_dois, momento_dois])
        return [v_um, momento_um, v_dois, momento_dois], bd
    elif tipo == 'Triangular':
        v_um = -3 * carga * comprimento / 20
        v_dois = -7 * carga * comprimento / 20
        momento_um = -carga * l**2 / 30
        momento_dois = carga * l**2 / 30
        bd[chave]["Forcas Locais"] = np.array([v_um, momento_um, v_dois, momento_dois])+ bd[chave]["Forcas Locais"]
        return [v_um, momento_um, v_dois, momento_dois], bd
    else:
        return[0,0,0,0],bd

def vetor_global_forcas(*args): 
    r = []
    conjunto = np.array(list(args))
    for i in range(conjunto.shape[0]):
        for j in range(conjunto.shape[1]):
            if i == 0:
                r.append(conjunto[i][j])
            else:
                if j <= 1:
                    r[2 + 2 * (i - 1) + j] = r[2 + 2 *
                                               (i - 1) + j] + conjunto[i][j]
                else:
                    r.append(conjunto[i][j])
    return r

def ordenar_forcas(forcas, des):
    """
    Ordena o vetor de forças em funcao do filtro de deslocabilidades
    forcas: vetor de forcas do sistema
    des: filtro de deslocamentos 
    """
    r = []
    for i in range(len(des)):
        if des[i] != 0:
            r.append(forcas[i])
    for i in range(len(des)):
        if des[i] == 0:
            r.append(forcas[i])
    return r

def submatrizes_rigizes(k, des) ->list:
    '''
    retorna as submatrizes kll e klp do sistema
    k: matrizes de rigidez organizada do sistema
    des: filtro de deslocamentos global
    return: [kll,kpl]
    '''
    #Determinacao do corte do vetor pela: quantidade de zeros
    coef_d = len(des) - des.count(0)
    
    #definicao das submatrizes
    kll = k[:coef_d, :coef_d]
    kpl = np.array(k[coef_d:, :coef_d])
    
    return kll,kpl

def subvetores_forca(forcas, des):
    '''
    Retorna os subvetores de forcas do sistema [f_d, f_f]
    forcas: vetor de forcas organizado 
    des: filtro de deslocamentos global
    '''
    #Determinacao do corte do vetor pela: quantidade de zeros
    coef_d = len(des) - des.count(0)
    
    #Determinacao dos subvetores
    forcas_d = np.array(forcas[0:coef_d])
    forcas_f = np.array(forcas[coef_d:])
    
    return forcas_d, forcas_f

def deslocabilidade(kll,forcas_d, elementos):
    '''
    Retorna as deslocabilidades dos sistema
    kll: matriz que transforma acoes externas em deslocamentos
    elementos: elementos cadastrado
    '''
    
    k_reacoes_inversa_d = np.linalg.inv(kll)
    desloc = forcas_d.dot(k_reacoes_inversa_d)
    #
    temp = list(desloc).copy()
    #Constroi uma vetor de deslocamento dos nos
    #Os elementos sempre vão aparecer em ordem
    d = []
    d_nos = []
    for chave in elementos.keys():
        for _ in range(2 if len(d_nos)==0 else 1):
            for el in elementos[chave]['Grau de Liberdade'][0 if len(d_nos)==0 else 1]:
                match el:
                    case 0:
                        d.append(0)
                    case 1:
                        d.append(temp.pop(0))
            d_nos.append(d.copy())
            d.clear()
    for chave,indice in zip(elementos.keys(),range(len(d_nos)-1)):
        elementos[chave]['Deslocabilidades'] = [d_nos[indice],d_nos[indice+1]]
            
    return desloc, elementos

def reacoes(kpl,deslocabilidade,forcas_f):  #conferir
    '''
    Calcula das reacoes de apoio da estruturas |
    kpl = submatriz que transforma deslocabilidades em efeitos |
    forcas_f = vetor dos carregamentos externos com incodgitas |
    '''
    #Reacao
    x = kpl.dot(deslocabilidade)
    r = x - forcas_f

    return r

def reacoes_internas(ke,de,f):
    '''
    Retorna as reacoes internas do elemento 
    [cortante, momento, cortante, momento]
    ke: matriz de rigidez local do elemento
    de: deslocamentos locais do elemento
    f: forcas nodais equivalentes do elemento
    '''
    d_aberto = []
    for par_ordenado_desloc in de:
        for item_desloc in par_ordenado_desloc:
            d_aberto.append(item_desloc)
            
    temp = ke.dot(np.array(d_aberto))
    return temp - np.array(f)

if __name__ == '__main__':
    
    props = {
        'fck':20,
        'h':50,
        'Altura Util':45,
        'bw':25,
        'fyk':50
    }
    
    car = {

        "Peso da Telha":{
            "index": "01",
            "patter": "CP",
            "describe":"Elementos construtivos industrializados",
            "tipo": "Pontual",
            "mag": 20,
            "pos":0,
            'comb':[1.25,1.40]

    }
}
    
    Adpoios = {
        '1':{
            'id':'Hoje',
            'tipo':'Apoio Rotulado',
            'value':0
        },
        '2':{
            'id':'Hoje',
            'tipo':'Apoio Simples',
            'value':300     
        }
    }


    test = entrada_test(car,Adpoios,300)
    print(test)
    #Matriz de rigidez
    k_aglomerado = []
    d_global = []
    
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
    
    parcial = []
    for item in elementos.values():
        print(item)
        print('---------')

    for chave,indice in zip(elementos.keys(),range(len(elementos))):
        parcial.append(list(map(lambda x: round(x,2),(reacoes_internas(k_aglomerado[indice],elementos[chave]["Deslocabilidades"],elementos[chave]["Forcas Locais"])))))

    saida = dict(zip(elementos.keys(),parcial))
    
    print(saida)

    
    
    