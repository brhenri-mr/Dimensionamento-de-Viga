from Dimensionamento import verificacao_momentos, admensionais, area_aco, verificacao_area
from NBR6118 import ParametrosConcreto


'''
verificacao_momentos - Verificada
admensionais - verificada
area - verificada
verificacao_area - verificada
'''

w0 = 8333.33
h = 50
bw = 20
d= 45
c= 20
momento = 12500
parametros = ParametrosConcreto(20, 'Rural', 'Viga', 1)
fcd =2/1.4 
Es = 210_000
fyd = 50/1.15
ecu= parametros.ecu
Ac = bw*h

print(parametros.av)

#admensionais(parametros.zeta,momento,parametros.eta,bw,d,fcd,Es,fyd,ecu)
bx, bz, bs = admensionais(parametros.zeta,momento,parametros.eta,bw,d,fcd,Es,fyd,parametros.ecu)

a = area_aco(momento,bz,d,bs,fyd)

print(verificacao_area(a,Ac))
