import axios from 'axios';
import React, { Component } from 'react'
import { Button , Form , Table , Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Pagination from "react-js-pagination";
import { connect } from 'react-redux'



class AllTask extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             loading : true,
             data : '',
             errorMessage : '',
             progress : 'all',
             check : false,
             que : '',
             temp : '',
        }
    }

    storeCollector(pageNumber = 1){
        //if(this.props.location.aboutProps != null){
            axios
            .post(`http://localhost:8000/all-task?page=${pageNumber}` , {
                progress : this.state.progress,
                check : this.state.check,
                que : this.state.que
            },{
                headers: {
                  'Authorization': `Bearer ${this.props.token}` 
                }
              })
            .then(response => {
                //console.log(response.data)
                this.setState({
                    temp : response.data,
                    data : response.data.data,
                    loading : false
                })
                //console.log(response.data)
                //console.log(this.state.data)
            })
            .catch(error =>{
                let temp = Object.values(error.response.data)
                this.setState({errorMessage : temp[0]})})

        //}

    }

    handleSelect = (event)=>{
        this.setState({
            progress : event.target.value
        }, ()=>{this.storeCollector()})

    }

    handleCheck = (event)=>{
        this.setState({
            check : event.target.checked
        }, ()=>{this.storeCollector()})
    }

    handleQueChange = (event)=>{
        this.setState({
            que : event.target.value
        }, ()=>{this.storeCollector()})
    }

    handleDeleteClick(id){
        axios
        .post("http://localhost:8000/delete-task",{
            id : id
        })
        .then(response => {
            console.log('deleted')
        })
        .catch(error => {
            //console.log('error while deleting')
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp[0]})
        })

    }

    callTable(){
        const { current_page , per_page , total } = this.state.temp
        return(
        <>
        <Table striped bordered hover size="sm" >
            <thead>
                <tr>
                <th width = "10%">Assignee</th>
                <th width="60%">Task</th>
                <th width="30%">deadline/progress</th>
                </tr>
            </thead>
        {this.state.data && this.state.data.map((data) => {
            return(
                <tbody key = {data.id}>
                    <tr>
                        <td >{data.name}</td>
                        <td>
                            <Table>
                                <tbody>
                                    <tr><td>Title: {data.title}</td></tr>
                                    <tr><td>{data.task}</td></tr>
                                </tbody>
                            </Table>
                        </td>
                        <td>
                            <Table>
                                <tbody>
                                {/* <tr><td>{data.deadline}</td></tr> */}
                                <tr>
                                    {
                                        data.overdue?
                                        <td className = "text-danger"><b>{data.deadline}</b></td>
                                        :
                                        <td><b>{data.deadline}</b></td>
                                    }
                                </tr>
                                <tr><td>progress : {data.progress}</td></tr>
                                <tr>
                                    <td>
                                        <Link  to ={{
                                            pathname :'/admin/update-task',
                                            aboutProps :{
                                                id : data.id,
                                            }
                                        }} >
                                            update
                                        </Link>
                                        <Button size = "sm" variant = "outline-danger"
                                        onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.handleDeleteClick(data.id) } }>
                                            delete
                                        </Button>
                                    </td>
                                </tr>
                                {/* <tr><td><Button onClick = {this.handleDeleteClick(data.id)}>delete</Button></td></tr> */}
                                </tbody>
                            </Table>
                        </td>
                    </tr>
                </tbody>
            )
        })}
        </Table>
        
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
        </>
        )
    }

    componentDidMount(){
        this.storeCollector();
    }

    render() {

        if(this.state.loading){
            return(<p>loading...</p>)
        }

        return (
            <div>
                <h3>Viewing All Tasks</h3>
                
                { this.state.errorMessage &&
                    <h3 className="error"> { this.state.errorMessage } </h3> }

                <Form>
                    <Form.Row>
                        <Form.Group as={Col} xs = {9}>
                            <Form.Control
                            type = "text"
                            placeholder = "search"
                            value = {this.state.que}
                            onChange = {this.handleQueChange}
                            />   
                        </Form.Group>
                        <Form.Group as={Col} xs = {3} >
                            <Form.Control 
                            as="select" 
                            name = "progress"
                            value = {this.state.progress}
                            onChange = {this.handleSelect}>
                                <option>all</option>
                                <option>pending</option>
                                <option>in_progress</option>
                                <option>overdue</option>
                                <option>completed_late</option>
                                <option>completed_on_time</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} xs = {10} >
                            <Form.Check type="checkbox" label="tasks for today" 
                            name = 'check'
                            value = {this.state.check}
                            onChange = {this.handleCheck}/>
                        </Form.Group>
                        <Form.Group as={Col} xs = {2}>
                            <Link to ={{
                                pathname :'/admin/piechart',
                                aboutProps :{
                                    id : 0 ,
                                }
                            }} >
                            <i>view chart</i>
                            </Link>
                        </Form.Group>
                    </Form.Row>
                </Form>
                {this.callTable()}
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        token :state.tokenReducer.token,
    }
}

export default connect(mapStateToProps)(AllTask)


