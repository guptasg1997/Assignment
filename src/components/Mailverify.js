import React, { Component } from 'react'
import { Button , Form  , Container , Navbar , Nav} from 'react-bootstrap'
import { connect } from 'react-redux'
import { Redirect} from 'react-router-dom'
import axios from 'axios'
import "./components.css"

class Mailverify extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             email:'',
             errorMessage :''
        }
    }
    

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    
    }

    handleSubmit = (event) =>{
        event.preventDefault()
        axios.post('http://localhost:8000/verify_request' , this.state)
        .then(response =>{
            console.log(response)
        })
        .catch(error =>{
            // console.log("ssssgggg")
            //console.log(error)
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp})
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

                { this.state.errorMessage &&
                        <h3 className="error"> { this.state.errorMessage[0] } </h3> }
            
                <Container className = "card">
                    <h3>Email Verification</h3>
                    <Form onSubmit = {this.handleSubmit}>
                        <div>
                            <Form.Label>Email:</Form.Label>{"\n"}
                            <Form.Control type = "email" 
                            name = "email"
                            value = {this.state.email} 
                            onChange = {this.handleChange}>
                            </Form.Control>
                        </div>

                        <Button type = "submit" variant = "secondary">Send Email</Button>
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



export default connect(mapStateToProps)(Mailverify)
