import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect , Link  } from 'react-router-dom'

import { loginRequest ,logoutRequest ,tokenRequest } from '../redux'
import { fetchUsersRequest , fetchUsersSuccess , fetchUsersFailure } from '../redux'

import axios from 'axios'
import { Button , Form , Table , Container , Row, Col ,Navbar , Tabs , Nav} from 'react-bootstrap'
import Pagination from "react-js-pagination";


export class Userlist extends Component {


    constructor(props) {
        super(props)
    
        this.state = {
            que : '',
            loading : true,
            errorMessage : '',
            temp :'',
            check : false
        }
    }

    storeCollector(pageNumber = 1) {
        
        this.props.fetchUsersRequest()
        axios
        .post(`http://localhost:8000/alluser?page=${pageNumber}` ,{
            que : this.state.que,
            check : this.state.check
        }
        ,{
            headers: {
              'Authorization': `Bearer ${this.props.token}` //this.props.store
            }
          })
        .then(response =>{
            const users = response.data.data  ///
            this.setState({temp:response.data})
            this.props.fetchUsersSuccess(users)
        })
        .catch(error =>{
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


    handleDeleteClick(para){ 
        axios
        .post('http://localhost:8000/delete',{
            id : para
        },{
            headers: {
                'Authorization': `Bearer ${this.props.token}` //this.props.store
            }
        })
        .then(response => {
            console.log(response.data)
            this.storeCollector()
        })
        .catch(error =>{
            this.setState({errorMessage : error.message})
            console.log(error)
        })
    }

    handleChange = (event) => {
        //event.preventDefault()
        this.setState({
            que : event.target.value
        }, () => {this.storeCollector()})
        // this.props.fetchUsersRequest()
        // axios
        // .post('http://localhost:8000/alluser' ,{
        //     que : event.target.value,
        //     check : this.state.check
        // }
        // ,{
        //     headers: {
        //       'Authorization': `Bearer ${this.props.token}` //this.props.store
        //     }
        //   })
        // .then(response =>{
        //     //this.setState({user : response.data})
        //     const users = response.data.data
        //     this.setState({temp:response.data})
        //     this.props.fetchUsersSuccess(users)
        // })
        // .catch(error =>{
        //     console.log('error')
        //     this.setState({errorMessage : error.message})
        //     this.props.fetchUsersFailure('Failed')
        // })
    }

    tableCall(){

        const {data , current_page , per_page , total } = this.state.temp
        return(
            <>
            <Table striped bordered hover size="sm" >
                <thead>
                    <tr>
                    <th width = "5%"  >view</th>
                    <th width = "40%">Email</th>
                    <th width = "30%">Name</th>
                    <th width = "5%">add</th>
                    <th width = "10%">status</th>
                    <th width = "10%">Delete</th>
                    </tr>
                </thead>
                {
                    this.props.userData.map(((userData) => {
                    let status = ''
                    if(userData.verify == 1)
                    status = 'verified'
                    else
                    status = 'not verified'

                    return (
                        userData.role == 'admin'?
                        <tbody key = {userData.id}>
                            <tr >
                                <td>--</td>
                                <td>{userData.email}</td> 
                                <td>{userData.name}</td> 
                                <td>--</td>
                                <td>--</td>
                                <td className = "text-right">admin</td>
                            </tr>
                        </tbody>
                        :
                        <tbody key= {userData.id}>
                            <tr>
                                <td className = "text-right">
                                    <Link  to ={{
                                        pathname :'/admin/view-task',
                                        aboutProps :{
                                            id : userData.id,
                                            name : userData.name
                                        }
                                    }} >
                                        view
                                    </Link>
                                </td> 
                                <td>{userData.email}</td> 
                                <td>{userData.name}</td>
                                <td className = "text-right">
                                    <Link  to ={{
                                        pathname :'/admin/add-task',
                                        aboutProps :{
                                            id : userData.id,
                                            name : userData.name
                                        }
                                    }} >
                                        add
                                    </Link>
                                </td> 
                                <td>{status}</td>
                                <td className = "text-right">
                                    <Button  variant = "secondary" 
                                        onClick={() => 
                                        { if (window.confirm('Are you sure you wish to delete this item?')) this.handleDeleteClick(userData.id) } }>
                                        delete
                                    </Button>
                                    {/* <Button variant = "secondary" onClick = {this.handleDeleteClick(userData.id)}>
                                        delete
                                    </Button> */}
                                </td>
                            </tr>
                        </tbody>
                    )
                    }))   
                }
            </Table>
            <div>
                <Pagination 
                activePage = {current_page}
                totalItemsCount = {total}
                itemsCountPerPage = {per_page}
                onChange ={(pageNumber) => this.storeCollector(pageNumber)}
                itemClass = "page-item"
                linkClass = "page-link"
                firstPageText = "first"
                lastPageText = "last"
                />
            </div>
            </>
        )
    }

    handleCheck = (event) => {
        this.setState({
            check : event.target.checked
        }, () =>{this.storeCollector()})
        // console.log(event.target.checked)
        // let isChecked = event.target.checked;
        // this.props.fetchUsersRequest()
        // axios
        // .post('http://localhost:8000/alluser' ,{
        //     que : this.state.props,
        //     check : event.target.checked
        // }
        // ,{
        //     headers: {
        //       'Authorization': `Bearer ${this.props.token}` //this.props.store
        //     }
        //   })
        // .then(response =>{
        //     //this.setState({user : response.data})
        //     const users = response.data.data
        //     this.setState({temp:response.data})
        //     this.props.fetchUsersSuccess(users)
        // })
        // .catch(error =>{
        //     console.log('error')
        //     this.setState({errorMessage : error.message})
        //     this.props.fetchUsersFailure('Failed')
        // })
    }

    componentDidMount(){
        this.storeCollector()
    }

    render() {

        if(this.state.loading){
            return(
                <>loading1...</>
            )
        }
        return (
            <>
            <Form>
                    <Form.Control
                    type = 'text'
                    name = 'que'
                    placeholder = 'search'
                    value = {this.state.que}
                    onChange = {this.handleChange}
                    >
                    </Form.Control>
                    <Form.Check type="checkbox" label="view all users" 
                    name = 'check'
                    value = {this.state.check}
                    onChange = {this.handleCheck}
                    size = "sm" />
            </Form>
            {
            (!this.props.loading)?
            <div>
                {this.props.userData && this.tableCall()}
            </div>
            
            :
            <div>
                <p>loading...</p>
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
    (Userlist)