//combinar os reduces
import { combineReducers } from "redux";
import { reducers as botoesReducers} from './Botoes.reduce';
import { reducers as barraReducers} from './Barra.reduce'


const reducers = combineReducers({botoesReducers,barraReducers})

export {reducers}