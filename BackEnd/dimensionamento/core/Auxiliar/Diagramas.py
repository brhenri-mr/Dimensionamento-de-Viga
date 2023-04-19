import sympy as sym

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
            return -mag
        case "Distribuido":
            eq_car = w
            temp = sym.integrate(eq_car,x)
            constante = el["Cortante"][0] - temp.subs({x:el["Trecho"][0]/100, w:-mag})
            return (temp + constante).subs({w:-mag})
   
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
    constante = el["Momento"][0] - temp.subs({x:el["Trecho"][0]})
    return temp + constante

def maxmomento(cortante,momento,el):
    saida = {'Momento':[],'Trecho':[]}
    x = sym.Symbol('x')
    xs = sym.solve(cortante,x)
    momento_pronto = sym.lambdify(x,momento)
    for coordenada in xs:
        #Vendo se esta na barra
        if coordenada>= el['Trecho'][0] and coordenada<=el['Trecho'][1]:
            saida['Momento'].append(momento_pronto(coordenada))
            saida['Trecho'].append(coordenada)
        else:
            pass
    return saida


if __name__ == '__main__':

    el = {'Cortante':[15,12],"Momento":[15,60],"Trecho":[0,150]}

    formula_cortante = cortante('Distribuido',15,el)
    print(formula_cortante)
    formula_momento = momento(formula_cortante,30,el)
    print(formula_momento)
    maximo = maxmomento(formula_cortante,formula_momento,el)
    print(maximo)