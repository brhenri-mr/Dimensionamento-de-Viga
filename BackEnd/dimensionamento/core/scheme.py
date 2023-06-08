from ninja import Schema
from typing import List

class Apoios(Schema):
    id:str
    tipo: str
    value: float

class APoiosTrue(Schema):
    apoios:List[Apoios]


class Carregamento(Schema):
    describe: str
    name:str
    mag: float
    patter:str
    pos:list[float,float]
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
    combinacao:int
    
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
    dmax:float
    momento:float
    ductilidade: bool
   
