from core.scheme import Apoios
from ninja import NinjaAPI
from typing import List
from ninja import Schema


api = NinjaAPI()

@api.get("/hello")
def hello(request):
    return "Hello world"

@api.post("/test")
def test(request, apoio: Apoios):
    print(request)
    saida = apoio.dict()
    print(apoio)
    return saida
