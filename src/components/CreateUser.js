import React, { Component } from 'react'
import axios from 'axios'
import { Button , Form , Container } from 'react-bootstrap'
import { loginRequest , logoutRequest , tokenRequest } from '../redux' 
import { connect } from 'react-redux'

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

class CreateUser extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            name: '' ,
            email:'' ,
            password:'',
            retypepassword:'',
            loading : true,
            status : '',
            errorMessage : '',
        }
    }

    handleChange = (event) => {
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
        this.setState({
            loading : false
        })
    }

    handleSubmit = (event) =>{
        event.preventDefault()
        if(!strongRegex.test(this.state.password)) {
            this.setState({errorMessage :'Password not strong enough'})
            return 
        }
        axios
        .post('http://localhost:8000/create-user' ,{
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            retypepassword: this.state.retypepassword
        },{
            headers: {
                'Authorization': `Bearer ${this.props.token}` //this.props.store
              }  
          })
        .then(response =>{
            console.log(response)
            this.setState({status : 'successfull'})
        })
        .catch(error =>{
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp[0]})
        })
    }


    componentDidMount(){
        this.storeCollector();
    }

    render() {

        if(this.state.loading){
            return(
                <div><h3>loading</h3></div>
            )
        }

        return (
            <div>
                {/* <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/login">SG UI</Navbar.Brand>
                    <Nav.Link href="/admindashboard">Home</Nav.Link>
                </Navbar> */}
                <Container >
                    { this.state.errorMessage &&
                    <h3 className="error"> { this.state.errorMessage } </h3> }
                    
                    {(this.state.status) && <h4>User added</h4>}
                    <h3 className = 'test-left'>create user</h3>
                    <Form onSubmit = {this.handleSubmit} >
                        <div>
                            <Form.Label>Name:</Form.Label>{"\n"}
                            <Form.Control type = 'text' 
                            name ="name"
                            value = {this.state.name} 
                            onChange = {this.handleChange}>
                            </Form.Control>
                        </div>
                        <div>
                            <Form.Label>Email:</Form.Label>{"\n"}
                            <Form.Control type = "email" 
                            name = "email"
                            value = {this.state.email} 
                            onChange = {this.handleChange}>
                            </Form.Control>
                        </div>

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
                        <div/>
                        <Button type = "submit">Create</Button>
                    </Form>
                    </Container>

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
    (CreateUser)

