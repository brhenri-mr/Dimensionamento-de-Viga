from NBR6118 import ParametrosConcreto

def verificacao_momentos(momento: float,fctksup: float,w0: float,bw: float,d: float,fcd: float,zeta: float, c: int)->list[float,float,float,str]:
    """
    Verifica o momento solicitante se está no intervalo de mínimo e máximo 
    estabelecido pela norma |
    momento = Monento solicitante da secao |
    fctk = resitencia caracteristica de tracao superior do concreto |
    w0 = 
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
    
def admensionais():
    pass

def area_aco():
    pass

def verificacao_area():
    pass

def distruibuicao_camadas():
    pass

def area_efeitiva():
    pass


#Dados 


bw = 1 # largura comprimida
cnom = 1 # cobrimento nominal
fyk = 1 # tensão de escoamento
fck = 1 # resistência caracteristica à compressão
w0 = 1 #modulo

parametros = ParametrosConcreto(fck)



if __name__ == '__main__':

    while True:
        
        Msd, Mmin, Mmax, aviso = verificacao_momentos()
        print(aviso)
        if aviso == 'Viga Ultrapassa o Momento máximo para a seção':
            print(aviso)
            break
        
        bx, by, bz, bs = admensionais()
        As = area_aco(Msd,bs)
        if verificacao_area(As, bs):
            distruibuicao_camadas(As)
            As = area_efeitiva()
            if verificacao_area(As, bs):
                break