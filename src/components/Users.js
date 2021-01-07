import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect , Link  } from 'react-router-dom'

import { loginRequest ,logoutRequest ,tokenRequest } from '../redux'
import { fetchUsersRequest , fetchUsersSuccess , fetchUsersFailure } from '../redux'

import axios from 'axios'
import AddTask from './AddTask'

import { Button , Form , Table , Container , Row, Col ,Navbar , Tabs , Nav} from 'react-bootstrap'

class AdminDashboard extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            que : '',
            loading : true,
            serial : 1,
            errorMessage : '',
            id : 0,
            route : 0,
        }
    }

    
    storeCollector() {
        let store = JSON.parse(localStorage.getItem('localStorage'));
        if((store != null) && store.login && !this.props.loginStatus){
            this.props.loginRequest();
            this.props.tokenRequest(store.token)
        }
        this.props.fetchUsersRequest()
        axios
        .post('http://localhost:8000/alluser' ,{
            que : this.state.que
        }
        ,{
            headers: {
              'Authorization': `Bearer ${store.token}` //this.props.store
            }
          })
        .then(response =>{
            const users = response.data
            this.props.fetchUsersSuccess(users)
        })
        .catch(error =>{
            console.log(error)
            this.setState({errorMessage : error.message})
            this.props.fetchUsersFailure('Failed')
            this.props.tokenRequest('')
            this.props.logoutRequest()
            localStorage.setItem('localStorage' , JSON.stringify({
                login : false,
                token : '',
            }))
        })
        this.setState({
            loading : false
        })
    }

    handleChange = (event) => {
        event.preventDefault()
        this.setState({
            [event.target.name] : event.target.value
        })

        this.props.fetchUsersRequest()
        axios
        .post('http://localhost:8000/alluser' ,{
            que : event.target.value
        }
        ,{
            headers: {
              'Authorization': `Bearer ${this.props.token}` //this.props.store
            }
          })
        .then(response =>{
            //this.setState({user : response.data})
            const users = response.data
            console.log(users)
            this.props.fetchUsersSuccess(users)
        })
        .catch(error =>{
            console.log('error')
            this.setState({errorMessage : error.message})
            this.props.fetchUsersFailure('Failed')
        })
    }

   
    handleDeleteClick = (id) => (event) =>{   // for delete 
        if(this.props.loginStatus){
            console.log(this.props.token)  
            console.log(id)  
            axios
            .delete('http://localhost:8000/delete',{
                headers: {
                    'Authorization': `Bearer ${this.props.token}` //this.props.store
                }
            },{
                id : id
            })
            .then(response => {
                console.log(response.data)
            })
            .catch(error =>{
                this.setState({errorMessage : error.message})
                console.log(error)
            })
        }
    }

    logoutreq = (event) =>{
        localStorage.setItem('localStorage' , JSON.stringify({
            login : false,
            token : ''
        }))
        this.props.logoutRequest()
        this.props.tokenRequest('')
        this.props.fetchUsersSuccess([])
    }

    handleAddTask = (id) => (event) => {
        this.setState({
            route : 1,
            id : id ,
        })
    }

    componentDidMount(){
        this.storeCollector()
    }

    render() {

        if(this.state.loading ){ //this.props.loading
            return(
                <div>loading...</div>
            )
        }
        return (
            <>
              {
                this.props.loginStatus?
                  <div >
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand href="/login">SG UI</Navbar.Brand>
                        <Nav.Link href="/create_user">Create User</Nav.Link>
                        <Nav.Link onClick = {this.logoutreq}>Logout</Nav.Link>
                    </Navbar>
                    { this.state.errorMessage &&
                    <h3 className="error"> { this.state.errorMessage } </h3> }
                    <Container className="text-left">
                        <Row >
                            <Col xs = {3}>
                                <Row>
                                    <div className = "dashboard">
                                    <div>ADMIN</div>
                                    <div>admin@gmail.com</div>
                                    </div>
                                </Row>
                                <Row>
                                    <Navbar bg="light" expand="lg">
                                        <Nav.Link href="/admin/users"> User Data</Nav.Link>
                                    </Navbar>
                                    <Navbar bg="light" expand="lg">
                                        <Nav.Link href="/admin/dashboard"> Task Management</Nav.Link>
                                    </Navbar>
                                    <Navbar bg="light" expand="lg">
                                        <Nav.Link href="/admin/dashboard"> Task</Nav.Link>
                                    </Navbar>
                                </Row>
                            </Col>
                            <Col xs = {9}>
                                <Form>
                                    <div>
                                    <Form.Control
                                    type = 'text'
                                    name = 'que'
                                    placeholder = 'search'
                                    value = {this.state.que}
                                    onChange = {this.handleChange}>
                                    </Form.Control>
                                    </div>
                                </Form>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                        <th>id</th>
                                        <th>Email</th>
                                        <th>Name</th>
                                        <th>add task</th>
                                        <th>Delete</th>
                                        </tr>
                                    </thead>

                                    {
                                        this.props.userData.map((userData ) => {
                                        return (
                                            userData.role == 'admin'?
                                            <tbody key = {userData.id}>
                                                <tr>
                                                    <td>{userData.id}</td>
                                                    <td>{userData.email}</td> 
                                                    <td>{userData.name}</td> 
                                                    <td>admin</td>
                                                    <td className = "text-right">admin</td>
                                                </tr>
                                            </tbody>
                                            :
                                            <tbody key = {userData.id}>
                                                <tr>
                                                    <td>{userData.id}</td>
                                                    <td>{userData.email}</td> 
                                                    <td>{userData.name}</td> 
                                                    <td className = "text-right">
                                                        <Button variant = "secondary" onClick = {this.handleAddTask} >
                                                            add
                                                        </Button>
                                                    </td> 
                                                    <td className = "text-right">
                                                        <Button variant = "secondary" onClick = {this.handleDeleteClick(userData.id)}>
                                                            delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        )
                                        })   
                                    }
                                </Table>
                            </Col>
                        </Row>
                    </Container>
                    </div>
                    :
                    <div>
                      <Redirect to = "/"/> 
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
        loading : state.userReducer.loading,
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
    (AdminDashboard)
