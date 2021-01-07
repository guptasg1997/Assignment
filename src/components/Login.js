import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button , Form , Container , Row , Col , Navbar , Nav} from 'react-bootstrap'
//import { useHistory } from 'react-router-dom'
import { Redirect} from 'react-router-dom';
import "./components.css"

import { loginRequest , tokenRequest } from '../redux'

import axios from 'axios'


class Login extends Component {

    constructor(props){
        super(props)
    
        this.state ={
            email:'' ,
            password:'',
            errorMessage : ''
            //store :'',
            // login : false,
        }
    }

    storeCollector(){
        let store = JSON.parse(localStorage.getItem('localStorage'));
        if((store != null) && store.login && !this.props.loginStatus){
            this.props.loginRequest()
            this.props.tokenRequest(store.token)
        }

        // if(store && store.login){
        //     this.setState({login : true , store : store})
        // }
    }

    componentDidMount(){
        console.log("login cdm")
        this.storeCollector()
    }
    
    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    
    }


    handleSubmit = (event) =>{
        //const history = useHistory();
        event.preventDefault()
        axios
        .post('http://localhost:8000/login' , this.state)
        .then(response =>{
            //this.setState.token = response.data
            //console.log(response)
            localStorage.setItem('localStorage' , JSON.stringify({
                login : true,
                token : response.data['token']
            }))
            this.props.tokenRequest(response.data['token'])
            this.props.loginRequest()
        })
        .catch(error =>{
            //console.log(error.message)
            this.setState({
                errorMessage : error.response.data[0]
            })
        })
    }

    render(){
        return(
            <>
                {
                    !this.props.loginStatus?
                    <div>
                        <Navbar bg="light" expand="lg">
                            <Navbar.Brand href="/login">SG UI</Navbar.Brand>
                                <Nav.Link href="/signup">Signup</Nav.Link>
                                <Nav.Link href="/verifyreq">Email Verification</Nav.Link>
                        </Navbar>
                        { this.state.errorMessage &&
                        <h3 className="error"> { this.state.errorMessage } </h3> }
                        <Container className="card" >
                            <Row>
                            <Col xs = {0}></Col>
                            <Col xs = {12}>
                            <h3 className="text-center">Login</h3>
                            <Form onSubmit = {this.handleSubmit}>
                                <Form.Group >
                                    <Form.Label >Email:</Form.Label>{"\n"}
                                    <Form.Control type = "email" 
                                    name = "email"
                                    value = {this.state.email} 
                                    placeholder = 'example@mail.com'
                                    onChange = {this.handleChange}>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group >
                                    <Form.Label >Password:</Form.Label>{"\n"}
                                    <Form.Control type = "password" 
                                    name = "password"
                                    placeholder = "........."
                                    value = {this.state.password} 
                                    onChange = {this.handleChange}>
                                    </Form.Control>
                                </Form.Group>

                                <Button type = "submit">Login</Button>
                            </Form>
                            {/* <Link to ='/signup' >
                                Signup
                            </Link> */}
                            
                            {/* <div/> */}
                            <Link to ='/forgotpassword' >
                                Forgot Password
                            </Link>
                            <div/>
                            {/* <Link to ='/verifyreq' >
                                Email Verification
                            </Link> */}
                            </Col>
                            </Row>
                        </Container>
                    </div>
                    :
                    <div>
                        <Redirect to = "/dashboard" />
                    </div>

                }
            </>
        )
    }

}

const mapStateToProps = (state) => {
    return{
        loginStatus : state.loginReducer.loginStatus
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest : ()=> dispatch(loginRequest()) ,
        tokenRequest : (token)=> dispatch(tokenRequest(token))
    }
}

export default connect(mapStateToProps,
    mapDispatchToProps)
    (Login)