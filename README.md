# Dimensionamento-de-Viga
Aplicação web para cálculo e distribução da armadura transversal de vigas de concreto retangulares segundo a NBR6118:2014 e aplicações práticas

## Overview
O aplicativo se divide em duas linguagem com propostas diferentes: python para o backend (processamento de cálculos com framework Django) e Javscript(framework React).
Foram utilizados o numpy, sympy, Django e Django ninja para o BackEnd
Foram utilizados o React, Material UI, Redux e LatexReact para o FrontEnd

## Combinações de Ações
A combinação das ações é feita segundo a NBR8681:2003 para o estado limite de utilização (ELU) para o estado normal. Foi feita a implementação para os estados raros e excepcional, mas não foram utilizados.

## Equilíbrio
O cálculo do equilibrio da viga é feita com o uso do cálculo matrical de estruturas ou método da rigidez direta para vigas unidirecionais.

## Dimensionamento
O dimensionamento é feito com a premissa da flexão simples, logo o aplicativo garante a distruibuição simétrica da armadura na seção transversal.
