import React, { Component } from 'react'

class Signup extends Component {

    constructor(props){
        super(props)
    
        this.state ={
            name: '' ,
            email:'' ,
            password:'',
            password2:''
        }
    }
    
    handleUserNameChange = (event) => {
        this.setState({
            name : event.target.value
        })
    
    }
    handleUserEmailChange = (event) => {
        this.setState({
            email : event.target.value
        })
    
    }
    handleUserPasswordChange = (event) => {
        this.setState({
            password : event.target.value
        })
    
    }
    handleUserPassword2Change = (event) => {
        this.setState({
            password2 : event.target.value
        })
    
    }

    handleSubmit = (event) =>{
        event.preventDefault()
    }

    render(){
        return(
            <form onSubmit = {this.handleSubmit}>
                <div>
                    <label>Name:</label>{"\n"}
                    <input type = 'text' 
                    name ="name"
                    value = {this.state.name} 
                    onChange = {this.handleUserNameChange}>
                    </input>
                </div>
                <div>
                    <label>Email:</label>{"\n"}
                    <input type = "email" 
                    name = "email"
                    value = {this.state.email} 
                    onChange = {this.handleUserEmailChange}>
                    </input>
                </div>

                <div>
                    <label>Password:</label>{"\n"}
                    <input type = "password" 
                    name = "password"
                    value = {this.state.password} 
                    onChange = {this.handleUserPasswordChange}>
                    </input>
                </div>

                <div>
                    <label>Confirm Password:</label>{"\n"}
                    <input type = "password" 
                    name = "retypepassword"
                    value = {this.state.password2} 
                    onChange = {this.handleUserPassword2Change}>
                    </input>
                </div>

                <button type = "submit">Signup</button>
            </form>
        )
    }
}

export default Signup