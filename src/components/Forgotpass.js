import React, { Component } from 'react'
import { Button , Form ,Container , Nav , Navbar } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Redirect} from 'react-router-dom'
import axios from 'axios'
import "./components.css"

class Forgotpass extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             email:'',
        }
    }
    

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleSubmit = (event) =>{
        event.preventDefault()
        axios.post('http://localhost:8000/forgotpassword' , this.state)
        .then(response =>{
            console.log(response)
        })
        .catch(error =>{
            //console.log("ssssgggg")
            console.log(error)
        })
    }

    render() {
        return (
            <>
            {
            !this.props.loginStatus?
             <div > 
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/login">SG UI</Navbar.Brand>
                        <Nav.Link href="/signup">Signup</Nav.Link>
                        <Nav.Link href="/verifyreq">Email Verification</Nav.Link>
                </Navbar>
                <Container className = "card">
                    <h3>Forgot Password</h3>
                    <Form onSubmit = {this.handleSubmit}>
                    <div>
                        <Form.Label>Email:</Form.Label>{"\n"}
                        <Form.Control type = "email" 
                        name = "email"
                        value = {this.state.email} 
                        onChange = {this.handleChange}>
                        </Form.Control>
                    </div>

                    <Button type = "submit">Send Email</Button>
                    </Form>
                </Container> 
            </div>
            :
            <div>
                <Redirect to = "/login"/>
            </div> 

        }
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        loginStatus : state.loginReducer.loginStatus ,
    }
}



export default connect(mapStateToProps)(Forgotpass)