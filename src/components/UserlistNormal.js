import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link  } from 'react-router-dom'

import { loginRequest ,logoutRequest ,tokenRequest } from '../redux'
import { fetchUsersRequest , fetchUsersSuccess , fetchUsersFailure } from '../redux'

import axios from 'axios'
import { Button , Form , Table , Col, Navbar , Nav} from 'react-bootstrap'
import Pagination from "react-js-pagination";


export class Userlist extends Component {


    constructor(props) {
        super(props)
    
        this.state = {
            que : '',
            loading : true,
            errorMessage : '',
            temp :'',
            check : false,
            pageNumber : 1,
            noOfUsers : 5,
        }
    }

    storeCollector(pageNumber = 1) {
        //console.log(this.state.noOfUsers)
        this.setState({pageNumber : pageNumber})
        this.props.fetchUsersRequest()
        axios
        .post(`http://localhost:8000/alluser?page=${pageNumber}` ,{
            que : this.state.que,
            check : this.state.check,
            noOfUsers : this.state.noOfUsers,
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
            this.props.fetchUsersFailure('Failed')
            this.props.tokenRequest('')
            this.props.logoutRequest()
            localStorage.setItem('localStorage' , JSON.stringify({
                login : false,
                token : '',
            }))
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp[0]})
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
            this.storeCollector(this.state.pageNumber)
        })
        .catch(error =>{
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp[0]})
        })
    }

    handleChange = (event) => {
        this.setState({
            que : event.target.value
        }, () => {this.storeCollector()})
        
    }

    handleCheck = (event) => {
        this.setState({
            check : event.target.checked
        }, () =>{this.storeCollector()})
        
    }

    handleSelect = (event) => {
        this.setState({
            noOfUsers : event.target.value
        }, ()=>{this.storeCollector()})
    }

    tableCall(){
        //console.log(this.state.temp)
        const { current_page , per_page , total } = this.state.temp
        return(
            <>
            <Table striped bordered hover size="sm" className = "text-left" >
                <thead>
                    <tr>
                    <th width = "40%">Email</th>
                    <th width = "30%">Name</th>
                    <th width = "10%">add task</th>
                    </tr>
                </thead>
                {
                    this.props.userData && this.props.userData.map(((userData) => {
                    
                    let status = ''
                    if(userData.verify === 1)
                    status = 'verified'
                    else
                    status = 'not verified'

                    return (
                        <tbody key= {userData.id}>
                            <tr>
                                <td>{userData.email}</td> 
                                <td>{userData.name}</td>
                                <td className = "text-center" >
                                    {
                                        userData.verify?
                                        <Link  to ={{
                                            pathname :'/dashboard/add-task',
                                            aboutProps :{
                                                id : userData.id,
                                                name : userData.name
                                            }
                                        }} >
                                            add
                                        </Link>
                                        :
                                        <p>--</p>
                                    }
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

    componentDidMount(){
        this.storeCollector()
    }

    render() {

        if(this.state.loading && this.props.loading){
            return(
                <>loading...</>
            )
        }
        return (
            <>
                { this.state.errorMessage &&
                    <h3 className="error"> { this.state.errorMessage } </h3> }
                <Form className = "text-left">
                        <Form.Row>
                            <Form.Group as = {Col} xs = {9}>
                                <Form.Control
                                type = 'text'
                                name = 'que'
                                placeholder = 'search'
                                value = {this.state.que}
                                onChange = {this.handleChange}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as = {Col} xs = {1}>
                                <Form.Control 
                                as="select" 
                                name = "number"
                                value = {this.state.noOfUsers}
                                onChange = {this.handleSelect}>
                                    <option>5</option>
                                    <option>10</option>
                                    <option>20</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
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
