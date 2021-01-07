import {LOGIN_REQUEST} from './loginType'
import {LOGOUT_REQUEST} from './loginType'


export const loginRequest = (loginStatus) =>{  // payload hata dena...
    return{
        type : LOGIN_REQUEST,
        payload : loginStatus
    }
}
export const logoutRequest = (loginStatus) =>{
    return{
        type : LOGOUT_REQUEST,
        payload : loginStatus
    }
}

