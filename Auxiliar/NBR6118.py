from numpy import log

class ParametrosConcreto:
    
    def __init__(self, fck: int,ambiente: str,peca: str,bitolaL: float,b:int,h:int,unidades='kN/cm^2') -> None:
        '''
        Classe com os parametros de dimensionamento do concreto presentes na norma Brasileira de estruturas de concreto  NBR6118/2014.

        Args:
            fck: Resistência caracteristica do concreto a compresssao em 28 dias [MPa]
            ambiente: ambiente onde se encontra a peça 
            peca: Tipo de peca de concreto (viga, laje, pilar)
            bitolaL: bitola logitudinal da armadura i
            b: Largura de concreto comprimido
            h: Altura da peca de concreto
            unidades: por padrao adota-se como kN/cm^2, aceita-se MPa tambem
        Obs:
            1: São aceitas apenas geometria retangular nos elementos estruturais
            2: É aceito apenas armadura passivas

        Return:
            zeta: coeficiente que reduz area de concreto comprimido no gráfico parabola-retangulo
            eta:1
            fctkm: Resistência caracteristica do concreto a tração média da peça
            fctk_sup: Resistência caracteristica do concreto a tração na região superior da peça
            ecu: deformação ultima do concreto definda no item 8.2.10.1 
            cobrimento: Cobrimento da peça de concreto item
            dmax: Diametro máximo da agregado
            ah: Distancia horizonal minima entre faces de armaduras consecutivas
            av: Distancia vertical minima entre faces de armaduras consecutivas
            agressividade: Classe de agressividade ambiental item 
            gammac: Coeficiente de ponderação da resistencia do concreto armado (padrao ELU)
        
        '''
        
        classe_de_agressividade_ambiental = {
        'Rural':1,
        'Submersa':1,
        'Urbana':2,
        'Marinha':3,
        'Industrial1':3,
        'Industrial2':4,
        'Respingos de maré':4
        }
        #Cobrimento por elemento em cm
        cobrimento_por_elemento = {
            'Viga':[2.0,2.5,3.5,4.5],
            'Laje':[2.5,3.0,4.0,5.0],
            'Elemento em contato com o solo':[3.0,3.0,4.0,5.0]
        }
        
        self.__unidades = unidades
        self.__coef = 1 if unidades == 'MPa' else 10
        self.__gammac = 1.4

        #Fck
        self.__fck = fck

        #Coef Zeta 
        self.__zeta  = 0.8 if fck<=50 else 0.8-(fck - 50)/400

        #Coef eta item
        self.__eta = 0.85 if fck<=50 else 0.85*(1-(fck - 50)/200)

        #Traçao
        self.__fctkm = 0.3*fck**(2/3) if fck<=50 else 2.12*log(1+0.11*fck)
        self.__fctkinf = 0.7*self.__fctkm
        self.__fctksup = 1.3*self.__fctkm

        #Deformacao ultima do concreto
        self.__ecu = 0.0035 if fck<=50 else 0.0026+0.035*((90-fck)/100)**4

        #Agressividade ambiental
        self.__agressividade = classe_de_agressividade_ambiental[ambiente]
        self.__cobrimento = cobrimento_por_elemento[peca][self.__agressividade-1]

        #Armaduras
        self.__dmax = 1.2*self.__cobrimento
        self.__ah = max(2,bitolaL,1.2*self.__dmax)
        self.__av = max(2,bitolaL,0.5*self.__dmax)
        self.__w0 = b*h**2/6


      
    @property
    def unidades(self):
        print(f'Unidades utilizadas para o calculos: {self.__unidades}')
        return self.__unidades
    
    @property
    def fck(self):
        return self.__fck/self.__coef
    
    @property
    def zeta(self):
        return self.__zeta
    
    @property
    def eta(self):
        return self.__eta
    
    @property
    def fctkm(self):
        return self.__fctkm
    @property
    def fctkinf(self):
        return self.__fctkinf
    
    @property
    def fctksup(self):
        return self.__fctksup
    
    @property
    def fctdm(self):
        return self.__fctkm/self.__coef
    
    @property
    def fctdinf(self):
        return self.__fctkinf/self.__coef
    
    @property
    def fctdsup(self):
        return self.__fctksup/self.__coef
    
    
    @property
    def ecu(self):
        '''
        deformação maxima do concreto definda no item 8.2.10.1 da
        NBR6618
        '''
        return self.__ecu

    @property
    def agressividade(self):
        return self.__agressividade
    
    @property
    def cobrimento(self):
        return self.__cobrimento
    
    @property
    def dmax(self):
        return self.__dmax
    
    @property
    def ah(self):
        return self.__ah
    
    @property
    def av(self):
        return self.__av
    
    @property
    def w0(self):
        return self.__w0

    @property
    def gammac(self):
        return self.__gammac