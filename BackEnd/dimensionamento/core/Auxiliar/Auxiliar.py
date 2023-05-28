def compatibilizacao(s_atual:dict,el_individual:dict,s_global:dict,sinal:str):
    '''
    Constroi o dicionario com todos os valores da envoltaria
    s_atual: valores maximos atuais 
    el_indiviudal: elemento equilibrado para uma combinacao
    s_global: dicionario contendo todos os valores 
    sinal: Positivo ou Negativo, para considerar 
    return: {'Trechos':[],'Momento':[],'Cortante':[]}
    '''
    
    
    #Feito para resolver o problema de quando um ponto ja existir, nao precisa fazer a pesquisa, ela foi feita para pontos novos
    #Portanto, caso ja exista o ponto cadastrado em s_global, pode-se sair da funcao
    ja_existente = []
    
    tamanho = len(s_global['Trecho'])
    
    if tamanho == 0:
        s_global = el_individual.copy()
    
    '''
    #Conferindo pontos ja existentes entre s_global e el_individual
    for esforco_considerado in ['Momento','Cortante']:
        for i in range(tamanho-1):    
            if sinal =="Positivo":
                if esforco_considerado =="Momentos":
                    #Pegando so valor De momento fletor positivo (comprime em cima ), que sao negativos para analise de integral
                    if el_individual[esforco_considerado][i]< s_global[esforco_considerado][i]:
                        s_global[esforco_considerado][i] = el_individual[esforco_considerado][i]
                else:
                    #Sempre pegar os valores mais extremos de cortante, indepetende de ser positivo ou negativo
                    if abs(el_individual[esforco_considerado][i])>abs(s_global[esforco_considerado][i]):
                        s_global[esforco_considerado][i] = el_individual[esforco_considerado][i]
    
            else:
                if esforco_considerado =="Momentos":
                    #Pegando so valor De momento fletor negativos (comprime em cima ), que sao positivos para analise de integral
                    if el_individual[esforco_considerado][i]> s_global[esforco_considerado][i]:
                        s_global[esforco_considerado][i] = el_individual[esforco_considerado][i]
                else:
                    #Sempre pegar os valores mais extremos de cortante, indepetende de ser positivo ou negativo
                    if abs(el_individual[esforco_considerado][i])>abs(s_global[esforco_considerado][i]):
                        s_global[esforco_considerado][i] = el_individual[esforco_considerado][i]
    '''
    
                        
    #Conferindo pontos ja existentes entre s_global e s_atual    
    for esforco_considerado in ['Momento','Cortante']:
        for x in range(len(s_atual['Trecho'])):
            #x variavel que controla a pesquisa dos novos valores
            for i in range(len(s_global['Trecho'])):
                if sinal =="Positivo":
                    if s_global['Trecho'][i] == s_atual['Trecho'][x] or abs(s_global['Trecho'][i]- s_atual['Trecho'][x])<=1:
                        ja_existente.append(x)
                        if abs(s_atual[esforco_considerado][x]) > abs(s_global[esforco_considerado][i]):
                            s_global[esforco_considerado][i] = s_atual[esforco_considerado][x]
                
                else:
                    if s_global['Trecho'][i] == s_atual['Trecho'][x] or abs(s_global['Trecho'][i]- s_atual['Trecho'][x])<=10:
                        ja_existente.append(x)
                        if abs(s_atual[esforco_considerado][x]) < abs(s_global[esforco_considerado][i]):
                            s_global[esforco_considerado][i] = s_atual[esforco_considerado][x]
                    

    
    
    #adicionando pontos nao existentes
    if len(s_atual['Momento']) == 0:
        return s_global
    else:
        s = s_global['Trecho'].copy()
        s_novo = s_atual['Trecho'].copy()
        
        incremento = 0
        
        
        for valor in set(ja_existente):
            s_novo.pop(valor-incremento)
            incremento +=1
        
        
        criterio = False

        
        corrigido_m = []
        
        #Organizando a lista nova de trechos
        f = s.pop(-1)
        s.extend(s_novo)
        s.append(f)    
        s =sorted(s)
    
        #Compatibilizando as novas posicoes com os novos esforco_considerado
        for esforco_considerado in ['Momento','Cortante']:
            for x in s:
                for el in zip(s_global['Trecho'],s_global[esforco_considerado]):
                    if x ==el[0]:
                        criterio = True
                        corrigido_m.append(el[1])
                        break
                for el in zip(s_atual['Trecho'],s_atual[esforco_considerado]):
                    if criterio:
                        break
                    elif x ==el[0]:
                        corrigido_m.append(el[1])
                        break
                criterio = False
            
            s_global.update({
                esforco_considerado:corrigido_m.copy(),
            })
            corrigido_m.clear()
        #vendo as novas posicoes 
        s_global.update({
            'Trecho':s,
            })
   
    
        return s_global
    
    
    
if __name__ == '__main__':
    
    
    s_global = {'Trecho':[],'Momento':[],'Cortante':[]}
    s_atual = [{'Trecho':[0,80,300,48], 'Momento':[0,12,324,1200],'Cortante':[75,50,25,15]},{'Trecho':[0,80,48,300], 'Momento':[48,183,193,1800],'Cortante':[75,32,60,800]}]
    el_individual = [{'Trecho':[0,300],'Momento':[165,800],'Cortante':[-16,0]},{'Trecho':[0,300],'Momento':[0,7809],'Cortante':[0,80]},]
    
    for s,el in zip(s_atual,el_individual):
        s_global = compatibilizacao(s,el,s_global,'Positivo')
        print(s_global)