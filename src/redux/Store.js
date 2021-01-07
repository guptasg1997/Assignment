import {createStore , applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './rootReducer'


const Store = createStore(
    rootReducer ,
    composeWithDevTools(applyMiddleware(thunk))
)

//const Store = createStore(rootReducer)

export default Store