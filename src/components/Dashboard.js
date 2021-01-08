import React, { Component  } from 'react'
import { connect } from 'react-redux'
import { Route , Redirect } from 'react-router-dom'

import { loginRequest ,logoutRequest ,tokenRequest } from '../redux'
import { fetchUsersRequest , fetchUsersSuccess , fetchUsersFailure } from '../redux'

import axios from 'axios'

import Update from './Update'
import ViewTaskDash from './ViewTaskDash'
import Piechart from './Piechart'

import { Nav , Navbar , Container , Row , Col , ListGroup  } from 'react-bootstrap'

class Dashboard extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            loading : true,
            progress : ''
            //user : [],
            //localLogin : ''
        }
    }
    
    storeCollector() {
        let store = JSON.parse(localStorage.getItem('localStorage'));
        if((store != null) && store.login && !this.props.loginStatus){
            this.props.loginRequest();  //
            this.props.tokenRequest(store.token) //
        }

        this.props.fetchUsersRequest()
        axios
        .get('http://localhost:8000/test' 
        ,{
            headers: {
              'Authorization': `Bearer ${store.token}` 
            }
          })
        .then(response =>{
            const users = response.data
            this.props.fetchUsersSuccess(users)
            this.getValues()

        })
        .catch(error =>{
            this.props.fetchUsersFailure('Failed')
            this.props.tokenRequest('')
            this.props.logoutRequest()
            localStorage.setItem('localStorage' , JSON.stringify({
                login : false,
                token : ''
            }))
        })
    }

     handleLogoutSubmit = (event) =>{
        localStorage.setItem('localStorage' , JSON.stringify({
            login : false,
            token : ''
        }))
        this.props.tokenRequest('')
        this.props.logoutRequest()
        this.props.fetchUsersSuccess([])
    }

    getValues(){
        axios
        .post("http://localhost:8000/piechart" , {
            id : this.props.userData[0].id //get value from props
        },{
            headers: {
              'Authorization': `Bearer ${this.props.token}` 
            }
          })
        .then(response => {
            this.setState({progress : response.data})
        })
        .catch(error =>{
            console.log("error")
        })
        this.setState({
            loading :false
        })
    }

    componentDidMount(){
        this.storeCollector()
    }

    render() {
        
        if(this.state.loading || this.props.loading)  // i made edit here
        return(
            <>
            <p>loading...</p>
            </>
        )

        if( this.props.loginStatus && !this.props.loading && this.props.userData[0].role === 'admin')
        return(
            <>
                <Redirect to = "/admin"/>
            </>
        )

        return (
            <>
              {
                this.props.loginStatus?
                  <div>
                      { this.state.errorMessage &&
                    <h3 className="error"> { this.state.errorMessage } </h3> }
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand href="/login">SG UI</Navbar.Brand>
                        <Nav.Link href="/dashboard/update" >Update</Nav.Link>
                        <Nav.Link href="/dashboard/delete">delete account</Nav.Link>
                        <Nav.Link onClick = {this.handleLogoutSubmit}>Logout</Nav.Link>
                    </Navbar>
                    <Container fluid >
                        <Row>
                            <Col xs = {3} >
                                <h4>Welcome {this.props.userData[0].name}</h4>
                                <h6>Tasks Status</h6>
                                <ListGroup>
                                <ListGroup.Item>pending : {this.state.progress.pending}</ListGroup.Item>
                                <ListGroup.Item>in progress : {this.state.progress.in_progress}</ListGroup.Item>
                                <ListGroup.Item>completed on time : {this.state.progress.completed_on_time}</ListGroup.Item>
                                <ListGroup.Item>completed late : {this.state.progress.completed_late}</ListGroup.Item>
                                <ListGroup.Item>overdue : {this.state.progress.overdue}</ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col xs = {9}>
                                <div>
                                <Route path = '/dashboard' exact component = {() => <ViewTaskDash id ={this.props.userData[0].id} />} />
                                <Route path = '/dashboard/update' exact component = {Update} />
                                <Route path = '/dashboard/piechart' exact component = {Piechart} />
                                </div>
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
    (Dashboard)
