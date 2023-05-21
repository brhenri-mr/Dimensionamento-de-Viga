from numpy import log

class ParametrosConcreto:
    
    def __init__(self, fck: int,ambiente: str,peca: str,bitolaL: float,b:int,h:int,agregado:str,unidades='kN/cm^2') -> None:
        '''
        Classe que contem os parametros do concreto presentes conforme NBR6118/2014
        fck: Resistência caracteristica do concreto a compresssao em 28 dias [MPa]
        ambiente: ambiente onde se encontra a peça 
        peca: tipo de peça de concreto armadi( viga, laje, pilar)
        bitolaL: bitola logitudinal
        agregado: tipo de agregado estabelcido na NBR6118 item 8.2.8
        unidades: por padrao adota-se como kN/cm^2, aceita-se MPa tambem
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
        
        tipo_agregado ={
            'Basalto e Diabásio':1.2,
            'Granito e Gnaisse':1,
            'Calcário':0.9,
            'Arenito':0.7
        }
        
        
        self.__unidades = unidades
        self.__fck = fck
        self.__zeta  = 0.8 if fck<=50 else 0.8-(fck - 50)/400
        self.__eta = 0.85 if fck<=50 else 0.85*(1-(fck - 50)/200)
        self.__fctkm = 0.3*fck**(2/3) if fck<=50 else 2.12*log(1+0.11*fck)
        self.__fctkinf = 0.7*self.__fctkm
        self.__fctksup = 1.3*self.__fctkm
        self.__coef = 1 if unidades == 'MPa' else 10
        self.__ecu = 0.0035 if fck<=50 else 0.0026+0.035*((90-fck)/100)**4
        self.__agressividade = classe_de_agressividade_ambiental[ambiente]
        self.__cobrimento = cobrimento_por_elemento[peca][self.__agressividade-1]
        self.__dmax = 1.2*self.__cobrimento
        self.__ah = max(2,bitolaL,1.2*self.__dmax)
        self.__av = max(2,bitolaL,0.5*self.__dmax)
        self.__w0 = b*h**2/6
        self.__gammac = 1.4
        self.__alfai = 0.8+0.2*fck/80 if 0.8+0.2*fck/80<=1 else 1
        self.__alfae = tipo_agregado[agregado]
        self.__Eci = self.__alfae*5600*(fck)**0.5 if fck<=50 else self.__alfae*21500*(fck/10+1.25)**1/3
        self.__Ecs = self.__alfai *self.__Eci
        self.__bxmaximo = 0.45 if fck<=50 else 0.35
      
    @property
    def unidades(self):
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
        return self.__fctkm/self.__coef
    
    @property
    def fctkinf(self):
        return self.__fctkinf/self.__coef
    
    @property
    def fctksup(self):
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
    
    @property
    def alfae(self):
        return self.__alfae
    
    @property
    def alfai(self):
        return self.__alfai
    
    @property
    def Eci(self):
        return self.__Eci
    
    @property
    def Ecs(self):
        return self.__Ecs
    
    @property
    def bxmaximo(self):
        return self.__bxmaximo