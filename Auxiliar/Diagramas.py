import sympy as sym

def cortante(tipo:str,mag: float, el:dict):
    
                
    w = sym.Symbol("w")
    x = sym.Symbol("x")

    
    match tipo:
        case "Pontual":
            return 1
        case "Distruibuido":
            eq_car = w
            temp = sym.integrate(eq_car,x)
            constante = el["Cortante"][0] - temp.subs({x:el["Trecho"][0], w:mag})
            return temp + constante
   
def momento(eq_cortante,mag,el):
    x = sym.Symbol("x")
    w = sym.Symbol("w")
    temp = sym.integrate(eq_cortante,x)
    constante = el["Momento"][0] - temp.subs({w:mag, x:el["Trecho"][0]})
    return temp + constante
