from numpy import log

class ParametrosConcreto:
    
    def __init__(self, fck: int,unidades='kN/cm^2') -> None:
        '''
        Classe que contem os parametros do concreto presentes conforme NBR6118/2014
        fck = Resistência caracteristica do concreto a compresssao em 28 dias [MPa]
        unidades = por padrao adota-se como kN/cm^2, aceita-se MPa tambem
        '''
        self.__unidades = unidades
        self.__fck = fck
        self.__zeta  = 0.8 if fck<=50 else 0.8-(fck - 50)/400
        self.__eta = 0.85 if fck<=50 else 0.85*(1-(fck - 50)/200)
        self.__fctkm = 0.3*fck**(2/3) if fck<=50 else 2.12*log(1+0.11*fck)
        self.__fctkinf = 0.7*self.__fctkm
        self.__fctksup = 1.3*self.__fctkm
        self.__coef = 1 if unidades == 'MPa' else 10
      
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


    
