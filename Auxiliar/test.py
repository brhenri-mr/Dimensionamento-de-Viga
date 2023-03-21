import numpy as np

class Viga():
    
    def __init__(self,rigidez:int,carregamentos:dict) -> None:
        '''
        rigidez = rigidez do elemento
        carregamento = diciotnario das caracteristicas dos carregamentos
        '''
        self.carregamentos = carregamentos
        self.rigidez = rigidez
        print('to aqui')
    
    def Reacoes(self):
        return self.interno_reacoes(self)
    
    class interno_reacoes(object):
        def __init__(self,pai) -> None:
            self.pai = pai
            
        def Metodos_da_Rigidez_direita(self):
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
        def Metodo_das_Forcas():
            pass       