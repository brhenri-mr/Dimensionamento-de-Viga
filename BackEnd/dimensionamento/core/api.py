from core.scheme import Carregamentos
from ninja import NinjaAPI
from typing import List
from ninja import Schema
from core.Auxiliar.Combinacoes import Combine


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
    
    print(f'entrada: {entrada}')
    
    comb = Combine(entrada, {"Local":"Bibliotecas, arquivos, depósitos, oficinas e garagens"})
    
    
    test = comb.ELU(modo='Normal')

    return comb.json()
