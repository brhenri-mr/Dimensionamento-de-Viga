import { reducers } from '../Reduce';
import {createStore} from 'redux';

const store = createStore(reducers)

export { store };