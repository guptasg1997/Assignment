import {LOGIN_REQUEST} from './loginType'
import {LOGOUT_REQUEST} from './loginType'

const initialState = {
    loginStatus : false
}

const loginReducer = (state = initialState , action) => {
    switch(action.type){
        case LOGIN_REQUEST:
            return{
                ...state,
                // loginStatus : !(state.loginStatus)
                loginStatus : true
            }
        case LOGOUT_REQUEST:
            return{
                ...state,
                loginStatus : false
            }
        default: return state
        
    }

}

export default loginReducer