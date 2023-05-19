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
    estabelecido pela norma 
    momento:Monento solicitante da secao 
    fctk : resitencia caracteristica de tracao superior do concreto 
    w0 : modulo de resistencia transversal 
    bw : largura comprimida do concreto 
    d : altura util 
    fcd : resistencia de calculo do concreto 
    zeta : paramentro zeta do concreto 
    c : class do concreto 
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
    bx = 1/zeta -(1/zeta)*(1-(2*momento)/(eta*bw*(d**2)*fcd))**0.5
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
    a: area de aco
    Ac: area da secao transversal
    return: Armadura min e Aviso(True tudo certo)
    '''
    #dados
    armadura_min = Ac *0.0015
    armadura_max = Ac * 0.04
    criterio = 'Armadura Suficiente'
    #verificacao da aramdura
    if a>=armadura_min:
        aviso = True
    else:
        aviso = False
        criterio = 'Armadura Insuficiente, adotada armadura mínima'
    
    if a<=armadura_max:
        aviso = True
    else:
        aviso = False
        criterio = 'Armadura Excessiva'
    
    return armadura_min, aviso, criterio #preciso que o programa no futuro passe todas essas coisas

def distruibuicao_camadas(area:float,bitolaL:float,bw:int,cnom:float,bitolaT:float,av:float,ah:float)->int:
    '''
    Discretiza a armadura em barras e verifica a camada se esta adequada
    area: area de aco
    bw: lagura da area comprimida 
    cnom: cobrimento nominal da peca 
    bitolaL: diametro da armadura logitudinal 
    bitolaT: diametro da armadura Transversal
    return: Barra necessárias, Barras por camada 
    '''
    #Dado
    barras_necessarias = int(ceil((4*area)/(3.1415*bitolaL**2)))
    barra_por_camada = int(floor((bw-2*cnom-2*bitolaT+ah)/(bitolaL+ah)))
    
    return barras_necessarias, barra_por_camada

def area_efeitiva(barras_necessarias:int,bitolaL:float) -> float:
    '''
    Retorna a area efetiva de aco utilizada
    barra_necessaira : quantidade de barras discretizadas
    bitolal: bitola logitudinal
    '''
    return barras_necessarias*3.1415*0.25*bitolaL**2

def verificacao_admensional(fyd:float,eta:float,zeta:float,d:float,bw:int,fcd:float,a:float, Es:float,ecu:float):
    '''
    Verifica a posicao da linha neutra apos o arrendondamento da area de aco
    fyd: resistencia de calculo do escoamento
    eta: parametro do concreto
    zeta: parametro do concreto
    d: altura util do concreto
    bw: largura comprimida da secao de aco
    fcd: resistencia de calculo a compressao do concreto
    a: area de aco efetiva
    Es: modulo de elasticidade do ACO
    ecu: deformacao de ruptura do concreto
    return: Bool
    '''
    bs_arbitrado = 1
    i = 0
    while i<=1000:
        bx = fyd/(eta*zeta*d*bw*fcd)*a*bs_arbitrado
        bs = min([Es/fyd*(1-bx)/bx*ecu,1])
        #print(f'bs:{bx}')
        #print(f'bs: {bs}')
        if bs_arbitrado == bs:
            return True,bx,bs 
        i += 1
    return False

def incremento_cg_armaduras(bitolaL:float,av:float,h:int,numero_de_barras:int,barras_por_camada:int)->list[float,bool]:
    '''
    Calculo do cg das armaduras
    return: ysi e numero de barras e distruibuicao de barras por camada
    OBS: todas as armaduras tem bitola igual e o calculo foi feito pensando na menor ysi possivel, ou seja, 
    maior quantidade de barras por camada e menor quantidade de barras
    '''
    barra= []
    Sobra_para_proxima_camada = numero_de_barras
    j =0 
    cri = False
    
    while Sobra_para_proxima_camada!=0:
        
        #iterador
        Sobra_para_proxima_camada = Sobra_para_proxima_camada-barras_por_camada
        
        if Sobra_para_proxima_camada>0:
            
            if Sobra_para_proxima_camada<barras_por_camada:
                
                if Sobra_para_proxima_camada%2 ==0:
                    #tudo certo, vai sobrar uma quantidade que é simétrica
                    barra.append(barras_por_camada)
                    
                else:
                    #vai sobrar uma quantidade assimetrica, add mais uma barra
                    barra.append(barras_por_camada)
                    Sobra_para_proxima_camada = Sobra_para_proxima_camada + 1
                    numero_de_barras = numero_de_barras + 1
                    
            else:
                #Tem mais barras ainda, ignorar e esperar
                barra.append(barras_por_camada)
                
        elif Sobra_para_proxima_camada == 0:
            barra.append(barras_por_camada)
            break
        else:
            #significa que tenho mais espaco do que barras, logo ta tudo certo
            barra.append(Sobra_para_proxima_camada+barras_por_camada)
            break
        
    for i in range(len(barra)):
        j = i*barra[i]*(av+bitolaL) +j
    return j/numero_de_barras, numero_de_barras, barra
    
    