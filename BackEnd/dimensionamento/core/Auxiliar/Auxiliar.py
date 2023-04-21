def compatibilizacao(s_atual:dict,el_individual:dict,s_global:dict,sinal:str):
    '''
    Constroi o dicionario com todos os valore da envoltaria
    s_atual: valores maximos atuais 
    el_indiviudal: elemento equilibrado para uma combinacao
    s_global: dicionario contendo todos os valores 
    sinal: Positivo ou Negativo, para considerar 
    return: {'Trechos':[],'Momento':[],'Cortante':[]}
    '''
    
    
    #Feito para resolver o problema de quando um ponto ja existir, nao precisa fazer a pesquisa, ela foi feita para pontos novos
    #Portanto, caso ja exista o ponto cadastrado em s_global, pode-se sair da funcao
    ja_existente = False
    
    if len(s_global['Trecho']) == 0:
        s_global = el_individual.copy()
    

    
    #Conferindo pontos ja existentes
    for esforco_considerado in ['Momento','Cortante']:
        for i in [0,-1]:
            
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
                    
    for esforco_considerado in ['Momento','Cortante']:
        for x in range(len(s_atual['Trecho'])):
            for i in range(len(s_global['Trecho'])):
                if sinal =="Positivo":
                    if s_global['Trecho'][i] == s_atual['Trecho'][x] or abs(s_global['Trecho'][i]- s_atual['Trecho'][x])<=10:
                        ja_existente = True
                        if s_atual[esforco_considerado][x] > s_global[esforco_considerado][i]:
                            s_global[esforco_considerado][i] = s_atual[esforco_considerado][x]
                
                else:
                    if s_global['Trecho'][i] == s_atual['Trecho'][x] or abs(s_global['Trecho'][i]- s_atual['Trecho'][x])<=10:
                        ja_existente = True
                        if s_atual[esforco_considerado][x] < s_global[esforco_considerado][i]:
                            s_global[esforco_considerado][i] = s_atual[esforco_considerado][x]
                    

    
    
    #Variaveis 
    if len(s_atual['Momento']) == 0 or ja_existente:
        return s_global
    else:
        s = s_global['Trecho'].copy()
        s_novo = s_atual['Trecho'].copy()
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
    s_atual = [{'Trecho':[45],'Momento':[165],'Cortante':[-16]},{'Trecho':[],'Momento':[],'Cortante':[]}]
    el_individual = [{'Trecho':[0,300], 'Momento':[0,1200],'Cortante':[75,15]},{'Trecho':[0,300], 'Momento':[-170,1800],'Cortante':[75,15]}]
    
    for s,el in zip(s_atual,el_individual):
        s_global = compatibilizacao(s,el,s_global,'Positivo')
        print(s_global)