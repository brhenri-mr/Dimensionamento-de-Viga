const comb =[
    'Normal',
    'Construção',
    'Execepcional'
]

const tipo_carr = [
    'Distribuido',
    'Pontual'
]

const patterConst = [
    'Carregamento permanente',
    'Carrregamento Variável'
]

const CP = [
    'Peso próprio de estruturas metálicas',
    "Peso próprio de estruturas pré-moldadas",
    "Peso próprio de estruturas moldadas no local",
    "Elementos construtivos industrializados",
    "Elementos construtivos industrializados com adições in loco",
    "Elementos construtivos em geral e equipamentos"

]

const CV = [
    "Ações truncadas",
    "Efeito de temperatura",
    "Ação do vento",
    "Ações variáveis em geral"
]

const Descricao ={
    "Cargas acidentais de edifícios":[
        "Locais em que não há predominância de pesos e de equipamentos que permanecem fixos por longos períodos de tempo, nem de elevadas concentrações de pessoas",
        "Locais em que há predominância de pesos de equipamentos que permanecem fixos por longos períodos de tempo, ou de elevadas concentrações de pessoas",
        "Bibliotecas, arquivos, depósitos, oficinas e garagens"
    ],
    Vento: ['Vento'],
    Temperatura:['Temperatura'],
    "Cargas móveis e seus efeitos dinâmicos":[
        "Passarelas de pedestres",
        "Pontes rodoviárias",
        "Pontes ferroviárias não especializadas",
        "Pontes ferroviárias especializadas",
        "Vigas de rolamentos de pontes rolantes"
        
    ]
}


const slicer = {
    patter: patterConst,
    describe:[CV,CP],
    tipo: tipo_carr


}

export {comb,slicer,patterConst,CP,CV,tipo_carr,Descricao}