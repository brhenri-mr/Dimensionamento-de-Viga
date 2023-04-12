from ninja import Schema
from typing import List

class Apoios(Schema):
    id: str
    tipo: str
    value: int

class APoiosTrue(Schema):
    apoios:List[Apoios]


class Carregamento(Schema):
    describe: str
    id: str
    name:str
    mag: int
    patter:str
    pos:list[int,int]
    tipo:str
    comb:list

class Carregamentos(Schema):
    carregamento:List[Carregamento]
    
class MetRigidez(Schema):
    carregamento:List[Carregamento]
    apoios:List[Apoios]
    comprimento:float