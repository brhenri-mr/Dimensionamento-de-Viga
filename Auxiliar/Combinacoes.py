
class Combine():
    
    CP = {
        "Peso próprio de estruturas metálicas":{
            "Normal":[1.25,1],
            "Construção":[1.15,1],
            "Excepecional":[1.10,1]
            },
        "Peso próprio de estruturas pré-moldadas":{
            "Normal":[1.30,1],
            "Construção":[1.20,1],
            "Excepecional":[1.10,1]
            },
        "Peso próprio de estruturas moldadas no local":{
            "Normal":[1.35,1],
            "Construção":[1.25,1],
            "Excepecional":[1.15,1]
            },
        "Elementos construtivos industrializados":{
            "Normal":[1.35,1],
            "Construção":[1.25,1],
            "Excepecional":[1.15,1]
            },
        "Elementos construtivos industrializados com adições in loco":{
            "Normal":[1.40,1],
            "Construção":[1.30,1],
            "Excepecional":[1.20,1]
            },
        "Elementos construtivos em geral e equipamentos":{
            "Normal":[1.50,1],
            "Construção":[1.40,1],
            "Excepecional":[1.30,1]
            },
    }
    
    CV = {
        "Ações truncadas":{
            "Normal":[1.20,0],
            "Construção":[1.1,0],
            "Excepcional":[1,0]
        },
        "Efeito de temperatura":{
            "Normal":[1.20,0],
            "Construção":[1,0],
            "Excepcional":[1,0]
        },
        "Ação do vento":{
            "Normal":[1.4,0],
            "Construção":[1.2,0],
            "Excepcional":[1,0]
        },
        "Ações veriáveis em geral":{
            "Normal":[1.5,0],
            "Construção":[1.3,0],
            "Excepcional":[1,0]
        }
    }
    
    FATORES_DE_REDUCAO = {
        "Cargas acidentais de edifícios":{
            "Locais em que não há predominância de pesos e de equipamentos que permanecem fixos por longos períodos de tempo, nem de elevadas concentrações de pessoas":[0.5,0.4,0.3],
            "Locais em que há predominância de pesos de equipamentos que permanecem fixos por longos períodos de tempo, ou de elevadas concentrações de pessoas":[0.7,0.6,0.4],
            "Bibliotecas, arquivos, depósitos, oficinas e garagens":[0.8,0.7,0.6]
        },
        "Vento": [0.6,0.3,0],
        "Temperatura":[0.6,0.5,0.3],
        "Cargas móveis e seus efeitos dinâmicos":{
            "Passarelas de pedestres":[0.6,0.4,0.3],
            "Pontes rodoviárias":[0.7,0.5,0.3],
            "Pontes ferroviárias não especializadas":[0.8,0.7,0.5],
            "Pontes ferroviárias especializadas":[1,1,0.6],
            "Vigas de rolamentos de pontes rolantes":[1,0.8,0.5]
            
        }
    }
    
    def __init__(self,carregamento: dict, caracteristicas: dict) -> None:
        self.carregamento = carregamento
        self.caracteristicas = caracteristicas

    def ELU(self, modo:str, CP = CP, CV = CV, FATORES_DE_REDUCAO=FATORES_DE_REDUCAO) -> list:
        """
        Retorna uma lista contendo todas as comvbinações possiveis com seus coeficiente para cada
        classe de carregamento: carga permanente, carga variável, etc.
        
        modo = tipo da combinação: normal, construção ou excepcional
        """
        
        temp = []
        s=  []
        perma = []
        var = []
        principal_var = []
        z= -1
        
        #divisão de dados
        for key, el in self.carregamento.items():
            if el['patter'] == "CP":
                desfav, fav = CP[el['describe']][modo]
                perma.append([key, [desfav, fav]])
                
            elif el['patter'] == "CV":
                desfav, fav = CV[el['describe']][modo]
                if el['describe'] == 'Ação do vento':
                    coef_auxi = FATORES_DE_REDUCAO['Vento'][0]
                var.append([key, [desfav, fav, coef_auxi]])

        #Combinção permanente 
        for item in perma:
              
            if len(s) == 0:
                for i in item[1]:
                    temp.append(f"{i}*{item[0]}")
            else:
                for comb in s: 
                    for i in item[1]:
                        temp.append(comb + f"{i}*{item[0]}")
                
            s = temp.copy()
            temp.clear()
        

        #Combinção variaveis
        for item in var:
            principal_var.append([f'{item[1][0]}*{item[0]}'])
        

        for el in var:
            for item in principal_var:
                z +=1
                for comb in item:
                    if el[0] in comb:
                        temp.append(f'{comb}')
                    else:
                        temp.append(f'{comb}+{el[1][0]}*{el[1][2]}*{el[0]}')
                        temp.append(f'{comb}+{el[1][1]}*{el[1][2]}*{el[0]}')
                principal_var[z]= temp.copy()
                temp.clear()
            z = -1
        
        for element in s:
            for item in principal_var:
                for el in item:
                    temp.append(f'{element} + {el}')
        
        return temp + s
    
    def ELS(self):
        pass


car = {
    "Peso da viga":{
        "index": "01",
        "patter": "CP",
        "describe":"Peso próprio de estruturas metálicas",
        "tipo": "pontual",
        "mag": 15,
        "pos":(15,90)
    },
    "Vento":{
        "index": "01",
        "patter": "CV",
        "describe":"Ação do vento",
        "tipo": "Distruibuido",
        "mag": 15,
        "pos":(15,90)
    },
    "bolinha":{
        "index": "01",
        "patter": "CV",
        "describe":"Ação do vento",
        "tipo": "Distruibuido",
        "mag": 15,
        "pos":(15,90)
    }
}

ed= {
    "Local":"Passarelas de pedestres"
}


test = Combine(car, ed).ELU('Normal')
