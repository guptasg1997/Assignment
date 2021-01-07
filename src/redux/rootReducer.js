import userReducer from './user/userReducer'
import loginReducer from './login/loginReducer'
import tokenReducer from './token/tokenReducer'

import { combineReducers } from 'redux'



const rootReducer = combineReducers({
    userReducer : userReducer ,
    loginReducer : loginReducer,
    tokenReducer : tokenReducer,
})

export default rootReducer;