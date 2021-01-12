import React, { Component  } from 'react'
import { connect } from 'react-redux'
import { Route , Redirect } from 'react-router-dom'

import { loginRequest ,logoutRequest ,tokenRequest ,myRequest } from '../redux'
import { fetchUsersRequest , fetchUsersSuccess , fetchUsersFailure } from '../redux'

import axios from 'axios'

import Update from './Update'
import ViewTaskDash from './ViewTaskDash'
import Piechart from './Piechart'
import UserlistNormal from './UserlistNormal'
import AddTask from './AddTask'
//import AllTask from './AllTask'
import AllTaskNormal from './AllTaskNormal'
import UpdateTask from './UpdateTask'


import { Nav , Navbar , Container , Row , Col , ListGroup ,Button } from 'react-bootstrap'

class Dashboard extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            loading : true,
            progress : '' ,
            errorMessage : '',
            myData :'',
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

        //this.props.fetchUsersRequest()
        axios
        .get('http://localhost:8000/test' 
        ,{
            headers: {
              'Authorization': `Bearer ${store.token}` 
            }
          })
        .then(response =>{
            //console.log('success')
            //const users = response.data
            //this.props.fetchUsersSuccess(users)
            this.setState({myData : response.data} , () => {this.getValues()})

        })
        .catch(error =>{
            //console.log(error)
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp[0]})
            this.props.fetchUsersFailure('Failed')
            this.props.tokenRequest('')
            this.props.logoutRequest()
            this.setState({loading :false})
            
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
            id : this.state.myData.id //get value from props
        },{
            headers: {
              'Authorization': `Bearer ${this.props.token}` 
            }
          })
        .then(response => {
            this.setState({progress : response.data})
        })
        .catch(error =>{
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp[0]})
            //console.log("error")
        })
        this.setState({
            loading :false
        })
    }

    componentDidMount(){
        this.storeCollector()
    }

    render() {
        
        if(this.state.loading)  // i made edit here
        return(
            <>
            <p>loading...</p>
            </>
        )

        if( this.props.loginStatus && this.state.myData.role === 'admin')
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
                        {/* <Button variant = "link" onClick = {()=>{ if (window.confirm('Are you sure you wish to delete this item?')) <Redirect to  = "/dashboard/update" /> } }>
                        delete</Button> */}
                        {/* <Nav.Link href="/dashboard/delete">delete account</Nav.Link> */}
                        {/* <Nav.Link onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) href="/dashboard/update" } }>delete account</Nav.Link> */}
                        <Nav.Link onClick = {this.handleLogoutSubmit}>Logout</Nav.Link>
                    </Navbar>
                    <Container fluid className = "text-left" >
                        <Row>
                            <Col xs = {3} >

                                <h4>Welcome {this.state.myData.name}</h4>
                                 <Navbar bg="light" expand="lg">
                                    <Nav.Link href="/dashboard"  >Home</Nav.Link>
                                </Navbar>
                                <Navbar bg="light" expand="lg">
                                    <Nav.Link href="/dashboard/userlist"  >View Users</Nav.Link>
                                </Navbar>
                                <Navbar bg="light" expand="lg">
                                    <Nav.Link href="/dashboard/all-task"  >Assigned by you</Nav.Link>
                                </Navbar>
                                {/* <h6>Tasks Status</h6>
                                <ListGroup>
                                <ListGroup.Item>pending : {this.state.progress.pending}</ListGroup.Item>
                                <ListGroup.Item>in progress : {this.state.progress.in_progress}</ListGroup.Item>
                                <ListGroup.Item>completed on time : {this.state.progress.completed_on_time}</ListGroup.Item>
                                <ListGroup.Item>completed late : {this.state.progress.completed_late}</ListGroup.Item>
                                <ListGroup.Item>overdue : {this.state.progress.overdue}</ListGroup.Item>
                                </ListGroup> */}
                            </Col>
                            <Col xs = {9}>
                                <div>
                                <Route path = '/dashboard' exact component = {() => <ViewTaskDash id ={this.state.myData.id} />} />
                                <Route path = '/dashboard/update' exact component = {Update} />
                                <Route path = '/dashboard/piechart' exact component = {Piechart} />
                                <Route path = '/dashboard/userlist' exact component = {UserlistNormal} />
                                <Route path = '/dashboard/add-task' exact component = {AddTask} />
                                <Route path = '/dashboard/all-task' exact component = {AllTaskNormal} />
                                <Route path = '/dashboard/update-task' exact component = {UpdateTask} />
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
        myData : state.loginReducer.myData
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
        myRequest : (myData) => dispatch(myRequest(myData)),
    }
}

export default connect(mapStateToProps,
    mapDispatchToProps)
    (Dashboard)
