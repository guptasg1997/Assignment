import React, { Component } from 'react'
import axios from 'axios'
import { Link , Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { loginRequest } from '../redux'
import { logoutRequest } from '../redux'
import { tokenRequest } from '../redux'

import { Button , Form , Container , Navbar , Nav } from 'react-bootstrap'
import "./components.css"

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

class Signup extends Component {

    
    constructor(props){
        super(props)  
    
        this.state ={
            name: '' ,
            email:'' ,
            password:'',
            retypepassword:'',
            errorMessage : '',
            successMessage :'',
        }
    }
    
    handleChange = (event) => {
        //let name = event.target.name
        this.setState({
            [event.target.name] : event.target.value
        })    
    }

    storeCollector(){
        let store = JSON.parse(localStorage.getItem('localStorage'));
        if((store != null) && store.login && !(this.props.loginStatus)){
            this.props.loginRequest();
            this.props.tokenRequest(store.token)
        }
    }

    handleSubmit = (event) =>{
        event.preventDefault()

        if(!strongRegex.test(this.state.password)) {
            this.setState({errorMessage :['Password not strong enough']})
            return 
        }

        axios.post('http://localhost:8000/signup' , 
            this.state
            // name: this.state.name,
            // email: this.state.email,
            // password: this.state.password,
            // retypepassword: this.state.retypepassword
        )
        .then(response =>{
            document.getElementById("clear").reset();
            this.setState({successMessage : 'Account Created'})
            //console.log(response)
            // this.context.router.history.push(`/login`)
            //history.push("/login")
        })
        .catch(error =>{
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp[0]})
        })
    }

    componentDidMount(){
        this.storeCollector()
        //this.post()
    }

    render(){
        return(
            
            
                !this.props.loginStatus?
                <div >

                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand href="/">SG UI</Navbar.Brand>
                            <Nav.Link href="/signup">Signup</Nav.Link>
                            <Nav.Link href="/verifyreq">Email Verification</Nav.Link>
                    </Navbar>

                    { this.state.errorMessage &&
                        <h3 className="error"> { this.state.errorMessage } </h3> }

                    { this.state.successMessage &&
                        <h3 className="error"> { this.state.successMessage } </h3> }

                    {/* Object.keys(myObject).map(function(key, index) {
                    myObject[key] *= 2;
                    }) */}

                    <Container className = "card">
                    <h3>Signup Page</h3>
                    <Form id = "clear" onSubmit = {this.handleSubmit} >
                        <Form.Group>
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type = 'text' 
                            name ="name"
                            value = {this.state.name} 
                            onChange = {this.handleChange}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type = "email" 
                            name = "email"
                            value = {this.state.email} 
                            onChange = {this.handleChange}>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type = "password" 
                            name = "password"
                            value = {this.state.password} 
                            onChange = {this.handleChange}>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control type = "password" 
                            name = "retypepassword"
                            value = {this.state.retypepassword} 
                            onChange = {this.handleChange}>
                            </Form.Control>
                        </Form.Group>

                        <Button type = "submit">Signup</Button>
                    </Form>

                    <div/>
                    <Link to ='/forgotpassword' >
                        Forgot Password
                    </Link>
                    <div/>
                    </Container>
                </div>
                :
                <div>
                <Redirect to = "/dashboard"/>
                </div>
                        
            
        )
    }

}

const mapStateToProps = (state) => {
    return{
        loginStatus : state.loginReducer.loginStatus ,
        token :state.tokenReducer.token,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logoutRequest : ()=> dispatch(logoutRequest()) ,
        loginRequest : ()=> dispatch(loginRequest()) ,
        tokenRequest : (token)=> dispatch(tokenRequest(token)),
    }
}

export default connect(mapStateToProps,
    mapDispatchToProps)
    (Signup)