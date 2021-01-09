import React, { Component } from 'react'
import axios from 'axios'
import { Redirect} from 'react-router-dom'
import { connect } from 'react-redux'

import { loginRequest ,logoutRequest ,tokenRequest } from '../redux'
import { fetchUsersRequest , fetchUsersSuccess , fetchUsersFailure } from '../redux'

import { Button , Form , Container } from 'react-bootstrap'
import "./components.css"

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

class Update extends Component {

    constructor(props){
        super(props)
    
        this.state ={
            name: '' ,
            email:'' ,
            password:'',
            retypepassword:'',
            loading : true,
            updateStatus :false,
            errorMessage : ''
        }
    }
    
    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    
    }

    storeCollector(){
        let store = JSON.parse(localStorage.getItem('localStorage'));
        if(store!= null && store.login && !(this.props.loginStatus)){
            this.props.loginRequest();
            this.props.tokenRequest(store.token)
        }
        this.setState({
            loading : false
        })
    }
    
    handleSubmit = (event) => {
        event.preventDefault()
        axios.post('http://localhost:8000/update' , this.state, 
        {
            headers: {
              'Authorization': `Bearer ${this.props.token}` //this.props.store
            }
        })
        .then(response =>{
            console.log(response)

            if(this.state.email !== ''){
                localStorage.setItem('localStorage' , JSON.stringify({
                    login : false,
                    token : ''
                }))
            }
            
            this.setState({
                updateStatus : true
            })
        })
        .catch(error =>{
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp})
        })

    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    componentDidMount(){
        this.storeCollector()
    }


    render() {

        if(this.state.loading)
        return(
            <>
            <p>loading...</p>
            </>
        )

        if(this.state.updateStatus)
        return(
            <>
            <Redirect to = '/dashboard' />
            </>
        )
        return (
            
            <>
            {
                this.props.loginStatus?
                <div>
                    { this.state.errorMessage &&
                        <h3 className="error"> { this.state.errorMessage[0] } </h3> }

                    <Container className = "text-left">
                        <h2>Update your Details </h2>
                        <p>*If you don't want to update any field, leave it blank</p>
                        <Form onSubmit = {this.handleSubmit}>
                            <Form.Group>
                                <Form.Label>Name:</Form.Label>{"\n"}
                                <Form.Control type = 'text' 
                                name ="name"
                                value = {this.state.name} 
                                onChange = {this.handleChange}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email:</Form.Label>{"\n"}
                                <Form.Control type = "email" 
                                name = "email"
                                value = {this.state.email} 
                                onChange = {this.handleChange}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password:</Form.Label>{"\n"}
                                <Form.Control type = "password" 
                                name = "password"
                                value = {this.state.password} 
                                onChange = {this.handleChange}>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Confirm Password:</Form.Label>{"\n"}
                                <Form.Control type = "password" 
                                name = "retypepassword"
                                value = {this.state.retypepassword} 
                                onChange = {this.handleChange}>
                                </Form.Control>
                            </Form.Group>

                            <Button type = "submit">UPDATE</Button>
                        </Form>
                    </Container>
                    </div>
                :
                <div>
                    <Redirect to = "/" />
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
    (Update)
