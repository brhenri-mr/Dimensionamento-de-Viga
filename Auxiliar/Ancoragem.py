def resistencia_aderencia(bitola:float,fctd:float, classeaco:float, d:float, h:float)->float:
    """
    Funcao que retorna a resistencia de aderencia entre o aco/concreto segundo a NBR6118
    bitola: diametro da secao transversal da aramdura
    fctd: resistencia a tracao media do concreto
    classeaco: classe do aco
    d: altura util
    h: altura da secao
    """
    #eta1 vai ficar na nbr parametros
    #eta2 vai ficar na nbr parametros
    
    #eta1
    match classeaco:
        case 50:
            eta1 = 2.25
        case 60:
            eta1 = 1
        case 25:
            eta1 = 1


    #eta2
    if h>60:
        if h-30>d:
            eta2 = 1
        else:
            eta2 = 0.7
            
    else:
        if d<30:
            eta2 = 0.7
        else:
            eta2 = 1
    
    #eta3
    if bitola<=32:
        eta3 = 1
    else:
        eta3 = 132-bitola/100

    return (eta1*eta2*eta3)*(fctd)

def comprimento_necessario(bitola:float, fbd:float, fyd:float, Ascal:float, Asef:float, alfa:float)->float:
  '''
  Funcao que retorna o comprimento necessario de ancoragem
  bitola: diametro da secao transversal da aramdura
  fbd: resistencia de aderencia 
  fyd: resistencia de calculo a escoamento do aco
  Ascal: area de aco calculada
  Asef: area de aco efetivo 
  '''
  lb = max(bitola / 4 * fyd / fbd, 25 * bitola)
  lbmin = max(0.3 * lb, 10 * bitola, 10)
  lbnec = max(alfa * lb * Ascal / Asef, lbmin)
  return lbnec

def decalagem(vsdmax:float, vc:float, d:float, modelo:str)->float:
  '''
  Retorna a decalgem (ah) 
  vsdmax: esforco resistente de cortante maximo
  vs: resistencia do concreto a cortante
  d: altura util do concreto armado
  modelo: modelo a ser adotado Modelo 1 ou Modelo 2
  '''
  match modelo:
    case 'Modelo 1':
      return max(0.5*d*(vsdmax/(vsdmax-vc)),0.5*d)
    case 'Modelo 2':
      return max(0.866*d,0.5*d)

def momento_por_camada(d:float,zeta:float,bx:float,bs:float,fyd:float,armaduras:list,bitola:float)->list:
    '''
    Funcao que retorna uma lista com os momento resistentes por camada de armadura
    d: Altura util sa secao 
    zeta: parametro do concreto
    bx: relacao da altura util com a linha neutra
    bs: relacao da linha neutra com as armaduras
    fyd: resistencia de calculo a escoamento do aco
    armaduras: discretizacao das camadas em quantidade de barras
    bitola: diametro das armaduras
    '''
    saida = []
    temp = 0
    As = 3.1415*0.25*bitola**2
    constante = d*(1-zeta*bx/2)*bs*fyd
    for camada in armaduras:
        for _ in range(0,int(camada)):
            temp = temp + As
        if len(saida)==0:
            saida.append(round(temp*constante,2))
        else:
            saida.append(round(temp*constante+saida[-1],2))
        temp = 0
    return saida

def comprimento_de_ancoragem(lbnec,al,bitola,xcamada:list,xinferior:list):
    if lbnec+al+(xcamada[1]-xcamada[0])>10*bitola+al+(xinferior[1]-xinferior[0]):
        return lbnec+al,10*bitola+al,xcamada,"lbnec+al"
    else:
        return lbnec+al,10*bitola+al,xinferior,"10*bitola+al"

