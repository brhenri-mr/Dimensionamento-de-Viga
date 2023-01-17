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
    "Ações veriáveis em geral"
]


const slicer = {
    patter: patterConst,
    describe:[CV,CP],
    tipo: tipo_carr


}

export {comb,slicer,patterConst,CP,CV,tipo_carr}