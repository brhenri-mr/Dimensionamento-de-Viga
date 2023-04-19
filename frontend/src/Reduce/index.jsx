//combinar os reduces
import { combineReducers } from "redux";
import { reducers as botoesReducers} from './Botoes.reduce';
import { reducers as barraReducers} from './Barra.reduce'
import {reducers as caracteristicasReducer} from './Caracteristicas.reduce'


const reducers = combineReducers({botoesReducers,barraReducers, caracteristicasReducer})

export {reducers}