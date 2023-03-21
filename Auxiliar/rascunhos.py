nc = 3
nt = 7

coef_regra_centros = 1 +(((nc+1)/2)-3)/2 if (nc+1)/2 %2 !=0 else 1+ (((nc+1)/2)-3-1)/2


parametro = nt/nc

if parametro == int(parametro):
    #quantidade exata
    pass
else:
    barra_restantes= (nt - int(parametro)*nc)
    if temp%coef_regra_centros == 0:
        #par
        s = 'Distribui certo'
    else:
        #impar
        pass