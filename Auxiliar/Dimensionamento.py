from NBR6118 import ParametrosConcreto
from numpy import ceil, floor

'''
Segundo Fluxograma ARGENTA, 2021 Apostila ufpr concreto armado
'''

def modulo_de_resistencia_transversal(bw,h,tipo):
    match tipo:
        case "Seção Retangular":
            return (bw*h**2)/6
        case "Seção T":
            return "Ainda não implementado"
    return "Seção não cadastrada"
    
def verificacao_momentos(momento: float,fctksup: float,w0: float,bw: float,d: float,fcd: float,zeta: float, c: int)->list[float,float,float,str]:
    """
    Verifica o momento solicitante se está no intervalo de mínimo e máximo 
    estabelecido pela norma |
    momento = Monento solicitante da secao |
    fctk = resitencia caracteristica de tracao superior do concreto |
    w0 = modulo de resistencia transversal 
    bw = largura comprimida do concreto |
    d = altura util |
    fcd = resistencia de calculo do concreto |
    zeta = paramentro zeta do concreto |
    c = class do concreto |
    """
    #Dados
    momentomin = 0.8*w0*fctksup
    momentomax = 0.251*bw*(d**2)*fcd if 50<=50 else zeta*bw*d**2*(0.298-0.052*zeta)*(1-(c-50)/200)*fcd
    aviso = 'Status para verificação do momento OK'
    
    #Verificacao do intervalo
    if momento<momentomin:
        momentocalc = momentomin
        aviso = 'Status momento adotado como minimo'
        
    elif momento>momentomax:
        momentocalc = -1
        aviso = 'Viga Ultrapassa o Momento máximo para a seção'
        
    else:
        momentocalc = momento
    
    return momentocalc, momentomin, momentomax, aviso
    
def admensionais(zeta:float,momento:float,eta:float,bw:int,d:float,fcd:float,Es:float,fyd:float,ecu:float)-> list[float,float,float]:
    '''
    Calculo das variaveis auxiliares bx,by,bz,bs
    zeta = parametro estabelecido na NBR6118 |
    momento = momento solicitante na secao |
    eta = parametro estabelecido na NBR6118 |
    d = altura util da secao |
    fcd = resistencia caracteristica de calculo a compressao do concreto |
    Es = modulo elastico secante do concreto |
    fyd = resistencia ao escoamento de calculo do aco |
    ecu = deformacao ultima do concreto no devido Dominio |
    '''
    
    #Dados
    bx = 1/zeta -(1/zeta)*(1-(2*momento)/(eta*bw*d**2*fcd))**0.5
    bz = 1- 0.5*zeta*bx
    bs = min([Es/fyd*(1-bx)/bx*ecu,1])
    
    return bx, bz, bs

def area_aco(momento:float,bz:float,d:float,bs:float,fyd:float) -> float:
    '''
    Calculo da armadura de aco da secao
    momento = momento da secao 
    bz = variavel auxiliar
    d = altura util
    bs = variavel auxiliar
    fyd = resistencia caracteristica de calculo do aco
    '''
    area = (momento)/(d*bz*bs*fyd)
    
    return area

def verificacao_area(a,Ac) -> list[float,bool]:
    '''
    Verificacao da armadura minima da secao
    a = area de aco |
    Ac = area da secao transversal |
    '''
    #dados
    armadura_min = Ac *0.0015
    #verificacao da aramdura
    if a> armadura_min:
        aviso = True
    else:
        aviso = False
        
    return armadura_min, aviso #preciso que o programa no futuro passe todas essas coisas

def distruibuicao_camadas(area:float,bitolaL:float,bw:int,cnom:float,bitolaT:float,av,ah)->int:
    '''
    Discretiza a armadura em barras e verifica a camada se esta adequada |
    area = area de aco |
    bw = lagura da area comprimida |
    cnom = cobrimento nominal da peca |
    bitolaL = diametro da armadura logitudinal |
    bitolaT = diametro da armadura Transversal |
    '''
    #Dado
    barras_necessarias = ceil((4*area)/(3.1415*bitolaL**2))
    barra_por_camada = floor((bw-2*cnom-2*bitolaT+ah)/(bitolaL+ah))
    
    return barras_necessarias, barra_por_camada

def area_efeitiva(barras_necessarias:int,bitolaL:float) -> float:
    '''
    Retorna a area efetiva de aco utilizada
    barra_necessaira = quantidade de barras discretizadas
    bitolal = bitola logitudinal
    '''
    return barras_necessarias*3.1415*0.25*bitolaL**2

def verificacao_admensional(fyd:float,eta:float,zeta:float,d:float,bw:int,fcd:float,a:float, Es:float,ecu:float):
    bs_arbitrado = 1
    i = 0
    while i<=1000:
        bx = fyd/(eta*zeta*d*bw*fcd)*a*bs_arbitrado
        bs = min([Es/fyd*(1-bx)/bx*ecu,1])
        if bs_arbitrado == bs:
            return True 
        i += 1
    return False

def incremento_cg_armaduras(bitolaL:float,av:float,h:int,numero_de_barras,barras_por_camada)->list[float,bool]:
    '''
    Calculo do cg das armaduras.
    OBS: todas as armaduras tem bitola igual
    '''
    barra= []
    while numero_de_barras!=0:
        
        temp = numero_de_barras-barras_por_camada
        if temp>0:
            if temp == 1:
                #sobrou uma barra
                barra.append(barras_por_camada-1)
                temp = temp+1
            elif temp<barras_por_camada:
                #camada de cima será assimetrica
                pass
            else:
                #Tudo certo
                barra.append(barras_por_camada)
        elif temp ==0:
            break
        else:
            barra.append(temp)
            break
        
        numero_de_barras = temp
    
    
    
    ysi = bitolaL + av #bitola(i-1)+av+bitola(i)
    for camada in range(1,2):
        ys = (1)/numero_de_barras

        
        
    

if __name__ == '__main__':
    
    #Dados 
    h = 1 #altura da peca
    bw = 1 # largura comprimida
    cnom = 1 # cobrimento nominal
    fyk = 1 # tensão de escoamento
    fck = 1 # resistência caracteristica à compressão
    w0 = 1 #modulo
    bitolaT = 1 # bitola transversal

    parametros = ParametrosConcreto(fck)

    while True:
        
        ys = incremento_cg_armaduras()
        #Etapa de verificar se o momento esta no intervalo correto
        d = h - cnom - bitolaT - ys
        Msd, Mmin, Mmax, aviso = verificacao_momentos()
        print(aviso)
        if aviso == 'Viga Ultrapassa o Momento máximo para a seção':
            print(aviso)
            break
        #Calculo das variaveis auxiliares
        bx, by, bz, bs = admensionais()
        #Calculo da Area de Aco
        As = area_aco(Msd,bs)
        taxa, criterio = verificacao_area(As, bs)
        if criterio:
            distruibuicao_camadas(As)
            As = area_efeitiva()
            if verificacao_area(As, bs):
                break
        else:
            print('Área de armadura insuficiente')
            break