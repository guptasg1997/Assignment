import { 
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE
    } from "./userType"

export const fetchUsersRequest = () => {
    return {
        type : FETCH_USER_REQUEST
    } 
}

export const fetchUsersSuccess = (users) => {
    return {
        type : FETCH_USER_SUCCESS ,
        payload : users
    }
}

export const fetchUsersFailure = (error) => {
    return {
        type : FETCH_USER_FAILURE ,
        payload : error
    }
}

// const fetchUsers = () =>{
 //ouhefpisrjpggit 
    

    // return (dispatch) => {
    //     dispatch(fetchUsersRequest)
    //     axios.get('http://localhost:8000/test')
    //     .then(response => {
    //         const users = response.data
    //         dispatch(fetchUsersSuccess(users))
    //     })
    //     .catch(error => {
    //         const errorMsg = error.message
    //         dispatch(fetchUsersFailure(errorMsg))
    //     })
    // }
// }



