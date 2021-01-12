import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route , Redirect ,Switch} from 'react-router-dom'

import { loginRequest ,logoutRequest ,tokenRequest } from '../redux'
import { fetchUsersRequest , fetchUsersSuccess , fetchUsersFailure } from '../redux'

import axios from 'axios'
import Userlist from './Userlist'
import AddTask from './AddTask'
import UpdateTask from './UpdateTask'
import CreateUser from './CreateUser'
import ViewTask from './ViewTask'
import Piechart from './Piechart'
import AllTask from './AllTask'

import { Container , Row, Col ,Navbar  , Nav} from 'react-bootstrap'

class AdminDashboard extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            loading : true,
            id : 0,
            errorMessage : '',
            data : '',
        }
    }

    storeCollector() {
        let store = JSON.parse(localStorage.getItem('localStorage'));
        if((store != null) && store.login && !this.props.loginStatus){
            this.props.loginRequest();
            this.props.tokenRequest(store.token)
        }
        axios
        .get('http://localhost:8000/test' 
        ,{
            headers: {
              'Authorization': `Bearer ${store.token}` 
            }
          })
        .then(response =>{
            const users = response.data
            if(users.role !== 'admin'){
                this.props.tokenRequest('')
            this.props.logoutRequest()
            localStorage.setItem('localStorage' , JSON.stringify({
                login : false,
                token : ''
            }))
            }
        })
        .catch(error =>{
            this.props.tokenRequest('')
            this.props.logoutRequest()
            // localStorage.setItem('localStorage' , JSON.stringify({
            //     login : false,
            //     token : ''
            // }))
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp[0]})
        })

        this.setState({
            loading : false
        })
    }


    logoutreq = (event) =>{
        // localStorage.setItem('localStorage' , JSON.stringify({
        //     login : false,
        //     token : ''
        // }))
        this.props.logoutRequest()
        this.props.tokenRequest('')
    }

    componentDidMount(){
        this.storeCollector()
    }

    render() {

        if(this.state.loading ){
            return(
                <div>loading...</div>
            )
        }

        return (
            <>
              {
                this.props.loginStatus?
                  <div>
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand href="/login">SG UI</Navbar.Brand>
                        <Nav.Link href="/admin/create-user"  >Create User</Nav.Link>
                        <Nav.Link onClick = {this.logoutreq} >Logout</Nav.Link>
                    </Navbar>
                    <Container fluid true>
                        { this.state.errorMessage &&
                        <h3 className="error"> { this.state.errorMessage } </h3> }
                        <div className="text-left">
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
                                            <Nav.Link href="/admin/">Home</Nav.Link>
                                        </Navbar>
                                        <Navbar bg="light" expand="lg">
                                            <Nav.Link href="/admin/users">User Data</Nav.Link>
                                        </Navbar>
                                        {/* <Navbar bg="light" expand="lg">
                                            <Nav.Link href="/admin/"> Task Management</Nav.Link>
                                        </Navbar>
                                        <Navbar bg="light" expand="lg">
                                            <Nav.Link href = "/admin/dashboard"> Task</Nav.Link>
                                        </Navbar> */}
                                    </Row>
                                </Col>
                                <Col xs = {9}>
                                    {/* <Userlist /> */}
                                    <div>
                                        <Switch>
                                            <Route path = "/admin/users" component = {Userlist} />
                                            <Route path = '/admin/create-user' component = {CreateUser}/>
                                            <Route path = '/admin/add-task' exact component = {AddTask}/>
                                            <Route path = '/admin/view-task' exact component = {ViewTask} />
                                            <Route path = '/admin/update-task' exact component = {UpdateTask} />
                                            <Route path = '/admin/piechart' exact component = {Piechart} />
                                            <Route path = '/admin/' component = {AllTask} />
                                        </Switch>
                                    </div>
                                </Col>
                            </Row>
                        </div>
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
