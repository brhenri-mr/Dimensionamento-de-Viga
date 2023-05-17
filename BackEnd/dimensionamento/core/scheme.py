from ninja import Schema
from typing import List

class Apoios(Schema):
    id:str
    tipo: str
    value: int

class APoiosTrue(Schema):
    apoios:List[Apoios]


class Carregamento(Schema):
    describe: str
    name:str
    mag: int
    patter:str
    pos:list[int,int]
    tipo:str
    comb:list

class ED(Schema):
    Local:str
    informacao:str


class Carregamentos(Schema):
    carregamento:List[Carregamento]
    ed:List[ED]
    
class MetRigidez(Schema):
    carregamento:List[Carregamento]
    apoios:List[Apoios]
    comprimento:float
    MomentodeInercia:float
    fck:str
    agregado:str
    
class Caracteristicas(Schema):
    fck:int
    fyk:int
    h:float
    agregado:str
    bw:float
    dL:float
    dT:float
    fykt:float
    classeambiental:str
   
