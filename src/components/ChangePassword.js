import React, { Component } from 'react'

import TypePassword from './TypePassword'

class ChangePassword extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             token : '',
             loading :  true 
        }
    }
    
    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    
    }


    catchToken(){
        const query = new URLSearchParams(this.props.location.search);
        let para = query.get('token')
        
        this.setState({
            token : para ,
            loading : false ,
        })
    }

    componentDidMount(){
        this.catchToken();
    }

    render() {

        if(this.state.loading){
            return(
                <div>loading...</div>
            )
        }

        return (
            <div>
            <TypePassword token = {this.state.token}/>

            {/* <Form onSubmit = {this.handleSubmit}>
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
            </Form> */}
                
            </div>
        )
    }
}

export default ChangePassword


