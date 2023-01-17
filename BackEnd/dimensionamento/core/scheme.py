from ninja import Schema

class Apoios(Schema):
    id: str
    tipo: str
    value: int

class APoiosTrue(Schema):
    data:Apoios
