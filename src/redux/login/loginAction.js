import {LOGIN_REQUEST} from './loginType'
import {LOGOUT_REQUEST , MY_REQUEST} from './loginType'


export const loginRequest = (loginStatus) =>{  // payload hata dena...
    return{
        type : LOGIN_REQUEST,
        payload : loginStatus
    }
}
export const logoutRequest = (loginStatus) =>{
    
    localStorage.setItem('localStorage' , JSON.stringify({
        login : false,
        token : ''
    }))
    return{
        type : LOGOUT_REQUEST,
        payload : loginStatus
    }
}

export const myRequest = (myData) =>{
    return {
        type : MY_REQUEST,
        payload : myData
    }
}

