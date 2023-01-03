//combinar os reduces
import { combineReducers } from "redux";
import { reducers as apoiosReducers} from './Apoios.reduce';


const reducers = combineReducers({apoiosReducers,})



export {reducers}