import numpy as np

def entrada_test(data: dict, apoio: dict):
    
    def comprimento_trecho(carregamento:dict) ->list:
        '''
        Separa do vetor geral data, um vetor do comprimento de cada trecho 
        de elemento
        
        carregamento = próprio data
        '''
        #Variaveis
        comprimento = []
        
        #Definicao elementos
        for chave in carregamento.keys():
            temp = carregamento[chave]['pos']
            if isinstance(temp,int):
                temp = [temp]
            else:
                temp = [*temp]
            [comprimento.append(i) if i not in comprimento else 0 for i in temp]
                
        return sorted(comprimento)
    
    def grau_de_liberdade(parametro:str)->int:
        match parametro:
            case 'Apoio Rotulado':
                return 1
            case 'Apoio Simples':
                return 1
            case 'Engaste':
                return 0
            case 'Livre':
                return 2
            
        return 'Caso Nao Cadastrado'
            
    
    #Dados
    comprimento = comprimento_trecho(data)
    numero_nos = len(comprimento) -1
    elementos={}
    
    #Definicao da estrtura do obejto elementos 
    for i in range(numero_nos):
        elementos[f'El{i+1}'] = {'Trecho':comprimento[i+0:2+i],
                                 'Comprimento':comprimento[i+1]-comprimento[i],
                                 'Carregamento':{},
                                 'Grau de Liberdade':[],
                                 'deslocabilidades':[]
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
    for chave in Apoios.keys():
        temp = Apoios[chave]['value']
        for chave_el in elementos.keys():
            if temp in elementos[chave_el]['Trecho']:
                nome_apoio = Apoios[chave]['tipo']
            else:
                nome_apoio = 'Livre'
            elementos[chave_el]['Grau de Liberdade'].append(grau_de_liberdade(nome_apoio))
    
    return elementos
                
def rigidez_local(l:int, rigidez:int):
    '''
    Matriz de rigidez local do elemento
    l = largura do vão do elemento
    rigidez = produto entre módulo de Elastico
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
    vetores = lista de matriz de rigidez local
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
    k = matriz de rigidez global
    d = vetor das deslocabilidade sglobais dos nos
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

def vetor_local_forcas(carga:float, comprimento:int, tipo:str):
    '''
    Vetor das forças local para cada elemento
    carga = magnitude da força ou momento aplicado
    comprimento = comprimento do elemento em questão
    tipo = formato/natureza do carregamento (momento, distribuido, pontual, triangular)
    '''
    
    if tipo == 'dist':
        v_um = -carga * comprimento / 2
        v_dois = v_um
        momento_um = -carga * (comprimento**2) / 12
        momento_dois = -momento_um
        return [v_um, momento_um, v_dois, momento_dois]
    elif tipo == "pontual":
        a = comprimento[0]
        b = comprimento[1]
        if a == 0:
            return [carga, 0, 0, 0]
        elif b == comprimento:
            return [0, carga, 0, 0]
        else:
            l = a + b
            v_um = -carga * b**2 * (3 * a + b) / l**3
            v_dois = -carga * a**2 * (a + 3 * b) / l**3
            momento_um = -carga * a * b**2 / l**2
            momento_dois = carga * a * b**2 / l**2
            return [v_um, momento_um, v_dois, momento_dois]
    elif tipo == 'momento':
        a = comprimento[0]
        b = comprimento[1]
        l = a + b
        v_um = -6 * carga * a * b / l**3
        v_dois = 6 * carga * a * b / l**3
        momento_um = -carga * b * (2 * a - b) / l**2
        momento_dois = -carga * a * (2 * b - a) / l**2
        return [v_um, momento_um, v_dois, momento_dois]
    elif tipo == 'triangular':
        v_um = -3 * carga * comprimento / 20
        v_dois = -7 * carga * comprimento / 20
        momento_um = -carga * l**2 / 30
        momento_dois = carga * l**2 / 30
        return [v_um, momento_um, v_dois, momento_dois]

def vetor_global_forcas(*args):  #conferir
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
    r = []
    for i in range(len(d)):
        if des[i] != 0:
            r.append(forcas[i])
    for i in range(len(d)):
        if des[i] == 0:
            r.append(forcas[i])
    return r

def submatrizes_rigizes(k, des):
    '''
    retorna as submatrizes kll e klp do sistema
    k = matrizes de rigidez organizada do sistema
    des = filtro de deslocamentos global
    '''
    #Determinacao do corte do vetor pela: quantidade de zeros
    coef_d = len(d) - des.count(0)
    
    #definicao das submatrizes
    kll = k[:coef_d, :coef_d]
    kpl = np.array(k[coef_d:, :coef_d])
    
    return kll,kpl

def subvetores_forca(forcas, des):
    '''
    Retorna os subvetores de forcas do sistema [f_d, f_f]
    forcas = vetor de forcas organizado 
    des = filtro de deslocamentos global
    '''
    #Determinacao do corte do vetor pela: quantidade de zeros
    coef_d = len(d) - des.count(0)
    
    #Determinacao dos subvetores
    forcas_d = np.array(forcas[0:coef_d])
    forcas_f = np.array(forcas[coef_d:])
    
    return forcas_d, forcas_f

def deslocabilidade(kll,forcas_d, elementos):
    '''
    Retorna as deslocabilidades dos sistema
    kll= matriz que transforma acoes externas em deslocamentos
    elementos = elementos cadastrado
    '''
    
    k_reacoes_inversa_d = np.linalg.inv(kll)
    desloc = forcas_d.dot(k_reacoes_inversa_d)
    
    #
    temp = list(desloc).copy()
    d = []
    for chave in elementos.keys():
        for gdl in elementos[chave]['Grau de Liberdade']:
            match gdl:
                case 0:
                    d.append(0)
                    d.append(0)
                case 1:
                    d.append(0)
                    d.append(temp.pop(0))
                case 2:
                    d.append(temp.pop(0))
                    d.append(temp.pop(1))
        elementos[chave]['Deslocabilidades'] = d.copy()
        print(elementos[chave]['Deslocabilidades'])
        d.clear()
    
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
    ke = matriz de rigidez local do elemento
    de = deslocamentos locais do elemento
    f = forcas nodais equivalentes do elemento
    '''
    temp = ke.dot(de)
    return temp - f




if __name__ == '__main__':
    
    props = {
        'fck':20,
        'h':50,
        'Altura Util':45,
        'bw':25,
        'fyk':50
    }
    
    
    car = {
        "Peso da aco":{
            "index": "01",
            "patter": "CP",
            "describe":"Peso próprio de estruturas metálicas",
            "tipo": "Pontual",
            "mag": 15,
            "pos": 45,
            'comb':[1.25,1.40]
        },
        "Peso da Telha":{
            "index": "01",
            "patter": "CP",
            "describe":"Elementos construtivos industrializados",
            "tipo": "Distruibuida",
            "mag": 15,
            "pos":[150,300],
            'comb':[1.25,1.40]
        },
        "Vento":{
            "index": "02",
            "patter": "CV",
            "describe":"Ação do vento",
            "tipo": "Distruibuido",
            "mag": 15,
            "pos":[0,150],
            'comb':[1.25,1.40]
        },
        "Sobrecarga":{
            "index": "03",
            "patter": "CV",
            "describe":"Ações veriáveis em geral",
            "tipo": "Pontual",
            "mag": 15,
            "pos": 250,
            'comb': [1.25,1.40]
        }
    }
    
    
    Apoios = {
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
    
    
    #Rigidez local do elemento
    
    elementos = entrada_test(car,Apoios)

    ri = 10000
    x = rigidez_local(6, ri)
    y = rigidez_local(8, ri)
    z = rigidez_local(5, ri)

    #Lembrar que o d é quando o deslocamento não é travado, ou seja, grau de indeterminação cinemática
    #Isso é um filtro, não importa o valor
    #....[Vertical,momento]
    d = [0, 2, 0, 4, 0, 6, 0, 8]

    #Rigidez global do elemento
    w = rigidez_global([x, y, z])
    k_ord = ordenador(w, d)

    # Forcas = Engastamento perfeito/nodais equivalentes + reações + Forcas pontais
    vetv1 = np.array(vetor_local_forcas(1.5, 6, "dist"))
    vetv2 = np.array(vetor_local_forcas(2, 8, "dist"))
    vetv3 = np.array(vetor_local_forcas(1, 5, "dist"))
    vetv4 = np.array(vetor_local_forcas(4, [2.5, 2.5], "pontual"))
    vetv3_1 = vetv3 + vetv4

    #Vetor de forcas global
    vetfglobal = vetor_global_forcas(vetv1, vetv2, vetv3_1)
    vtord = ordenar_forcas(vetfglobal, d)

    #Submatrizes
    kpp, klp = submatrizes_rigizes(k_ord,d)

    #Subvetores
    f_d, f_f = subvetores_forca(vtord,d)

    #Deslocabilidades
    desc = deslocabilidade(kpp,f_d,elementos)

    #Reacoes de apoio
    r = reacoes(klp,desc,f_f)
    print(r)
