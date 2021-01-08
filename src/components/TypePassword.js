import React, { Component } from 'react'

import axios from 'axios'

import { Button , Form , Container} from 'react-bootstrap'
import "./components.css"

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

export class TypePassword extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             password : '' ,
             retypepassword : '',
             errorMessage : ''
        }
    }
    


    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    
    }

    handleSubmit = (event) =>{
        event.preventDefault();

        if(!strongRegex.test(this.state.password)) {
            this.setState({errorMessage :'Password not strong enough'})
            return 
        }

        axios
        .post('http://localhost:8000/changepassword' , this.state , {
            headers: {
                'Authorization': `Bearer ${this.props.token}` //this.props.store
              }
        })
        .then(response =>{
            console.log("password updated successfully")
        })
        .catch(error =>{
            console.log('error')
        })
    }


    render() {
        return (
            <>
                <div className = "card">
                    <Container>
                        { this.state.errorMessage &&
                        <h3 className="error"> { this.state.errorMessage } </h3> }
                        <Form onSubmit = {this.handleSubmit}>
                        <div>
                            <Form.Label>Password:</Form.Label>{"\n"}
                            <Form.Control type = "password" 
                            name = "password"
                            value = {this.state.password} 
                            onChange = {this.handleChange}>
                            </Form.Control>
                        </div>

                        <div>
                            <Form.Label>Confirm Password:</Form.Label>{"\n"}
                            <Form.Control type = "password" 
                            name = "retypepassword"
                            value = {this.state.retypepassword} 
                            onChange = {this.handleChange}>
                            </Form.Control>
                        </div>

                        <Button type = "submit">Confirm</Button>
                        </Form>
                    </Container>
                </div>
            </>
        )
    }
}

export default TypePassword
