import {TOKEN_REQUEST} from './tokenType'

const initialState = {
    token : ''
}

const tokenReducer = (state = initialState , action) => {

    switch(action.type){
        case TOKEN_REQUEST:
            return{
                ...state,
                token : action.payload
            }
        default : return state
    }
}

export default tokenReducer
