import {TOKEN_REQUEST} from './tokenType'

export const tokenRequest = (token = '') => {
    return {
        type : TOKEN_REQUEST,
        payload : token
    }
}