import React, { Component } from 'react'
import axios from 'axios'

import { connect } from 'react-redux'
import { Redirect} from 'react-router-dom'
import { loginRequest } from '../redux'
import { logoutRequest } from '../redux'
import { tokenRequest } from '../redux'
import { fetchUsersRequest , fetchUsersSuccess , fetchUsersFailure } from '../redux'


class Delete extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
             password : ''
        }
    }
    

    delete(){
        if(this.props.loginStatus){
        axios
        .post('http://localhost:8000/delete',{}, {
            headers: {
                'Authorization': `Bearer ${this.props.token}` //this.props.store
              }
          })
          .then(response => {
                localStorage.setItem('localStorage' , JSON.stringify({
                login : false,
                token : ''
                }))
              //this.fetchUsersRequest([])  
              this.logoutRequest();
              this.tokenRequest('');
          })
          .catch(error =>{
            console.log(error.response)
        })
        }
    }

    componentDidMount(){
        this.delete()
    }

    render() {
        return (
            <>  
                {
                    !this.props.loginStatus?
                    <div>
                        <Redirect to = "/signup"/>
                    </div>
                    :
                    <div>
                        <p>Account Deleted</p>
                    </div>

                }

            </>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        loginStatus : state.loginReducer.loginStatus ,
        token :state.tokenReducer.token,
        userData : state.userReducer.users,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logoutRequest : ()=> dispatch(logoutRequest()) ,
        loginRequest : ()=> dispatch(loginRequest()) ,
        tokenRequest : (token)=> dispatch(tokenRequest(token)),
        fetchUsersRequest : () => dispatch(fetchUsersRequest()),
        fetchUsersSuccess : (users) => dispatch(fetchUsersSuccess(users)),
        fetchUsersFailure : (error) => dispatch(fetchUsersFailure(error)),
    }
}

export default connect(mapStateToProps,
    mapDispatchToProps)
    (Delete)
