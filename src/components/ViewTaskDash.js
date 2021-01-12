import axios from 'axios';
import React, { Component } from 'react'
import { Button , Table , Form , Col , Container , Dropdown , ButtonGroup , Navbar, Nav} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Pagination from "react-js-pagination";
import { connect } from 'react-redux'


class ViewTaskDash extends Component {
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
             pageNumber : 1,
             progressStatus : 'pending',
        }
    }

    storeCollector(pageNumber = 1){
        this.setState({pageNumber:pageNumber})
        if(this.props.id != null){
            axios
            .post(`http://localhost:8000/view-task?page=${pageNumber}` , {
                id : this.props.id,
                progress : this.state.progress,
                check : this.state.check,
                que : this.state.que
            },{
                headers: {
                  'Authorization': `Bearer ${this.props.token}` 
                }
              })
            .then(response => {
                this.setState({
                    temp : response.data,
                    data : response.data.data,
                    loading : false
                })
                console.log(this.state.data)
            })
            .catch(error =>{
                let temp = Object.values(error.response.data)
                this.setState({errorMessage : temp[0]})            })

        }

    }

    // handleClick =(id) => (event) =>{

    handleClick(id){
        axios
        .post("http://localhost:8000/complete-task" ,{
            id : id
        },{
            headers: {
              'Authorization': `Bearer ${this.props.token}` 
            }
          })
        .then(response => {
            console.log("done")
            this.storeCollector(this.state.pageNumber)
        })
        .catch(error=>{
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp[0]})        })
    }

    handleSelect = (event)=>{
        this.setState({
            progress : event.target.value
        }, ()=>{this.storeCollector()})

    }

    // handleProgressSelect = (event)=>{
    //     this.setState({
    //         progressStatus : event.target.value
    //     })
    //     console.log(this.state.progressStatus)
    // }

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

    handleProgressClick = (id)=>(event) => {
        //console.log(id)
        axios
        .post("http://localhost:8000/active-task" ,{
            id : id
        },{
            headers: {
              'Authorization': `Bearer ${this.props.token}` 
            }
          })
        .then(response => {
            console.log("done")
            this.storeCollector(this.state.pageNumber)
            //console.log(response.data)
        })
        .catch(error=>{
            console.log('error in finishing task')
        })

    }

    submitProgress =(id)=> (event) =>{
        console.log(this.state.progressStatus)
        axios
        .post("http://localhost:8000/submit-progress" ,{
            id : id,
            progress : this.state.progressStatus
        },{
            headers: {
              'Authorization': `Bearer ${this.props.token}` 
            }
          })
        .then(response => {
            console.log("done")
            this.storeCollector(this.state.pageNumber)
            //console.log(response.data)
        })
        .catch(error=>{
            console.log('error in finishing task')
        })
    }
    
    componentDidMount(){
        this.storeCollector();
    }

    callTable(){
        const {data , current_page , per_page , total } = this.state.temp
        return(
        <>
            <Table striped bordered  hover size="sm">
                <thead>
                    <tr>
                    <th width = "70%">Tasks</th>
                    <th width = "30%">deadline/progress</th>
                    </tr>
                </thead>
            {this.state.data && this.state.data.map((data) => {
                return(
                    <tbody key = {data.id}>
                        <tr>
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
                                        {/* <td>
                                        <Button size ="sm" variant = "outline-primary"
                                        onClick = {this.handleProgressClick(data.id)}>
                                            start/stop
                                        </Button>
                                        <Button size = "sm" variant = "outline-success"
                                        onClick={() => 
                                        { if (window.confirm('Are you sure you wish to finish this task?')) this.handleClick(data.id) } }>
                                            complete
                                        </Button>
                                        </td> */}
                                        <td>
                                            <Dropdown as={ButtonGroup}>
                                                <Button variant = "outline-secondary" size = "sm" onClick = {this.submitProgress(data.id)} >Submit Progress</Button>
                                                <Dropdown.Toggle size="sm" split variant="outline-secondary" id="dropdown-split-basic" />
                                                <Dropdown.Menu>
                                                    <Dropdown.Item size = "sm" onClick = {() => {this.setState({progressStatus : 'pending'})}}>pending</Dropdown.Item>
                                                    <Dropdown.Item size = "sm" onClick = {() => {this.setState({progressStatus : 'in_progress'})}}>in_progress</Dropdown.Item>
                                                    <Dropdown.Item size = "sm" onClick = {() => {this.setState({progressStatus : 'completed'})}}>completed</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            {/* <Form.Row>
                                            <Button variant = "outline-secondary" size = "sm" onClick = {this.submitProgress(data.id)} >Submit Progress</Button>
                                            <DropdownButton variant = "outline" id="dropdown-basic-button" size = "sm">
                                                <Dropdown.Item size = "sm" onClick = {() => {this.setState({progressStatus : 'pending'})}}>pending</Dropdown.Item>
                                                <Dropdown.Item size = "sm" onClick = {() => {this.setState({progressStatus : 'in_progress'})}}>in_progress</Dropdown.Item>
                                                <Dropdown.Item size = "sm" onClick = {() => {this.setState({progressStatus : 'completed'})}}>completed</Dropdown.Item>
                                            </DropdownButton>
                                            </Form.Row> */}
                                        </td>
                                    </tr>
                                    {/* <tr><td><Button onClick ={this.handleClick(data.id)}>submit</Button></td></tr> */}
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

    render() {
        console.log(this.props.id)

        if(this.state.loading){
            return(<p>loading...</p>)
        }
        
        return (
            <div>
                <Container fluid className = "text-left">
                {/* <Navbar>
                    <Nav.Link href="/dashboard" >Assigned To you</Nav.Link>
                    <Nav.Link href="/dashboard/all-task" >Assigned By you</Nav.Link>
                </Navbar> */}
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
                        <Form.Group as={Col} xs = {3} controlId="formGridState" >
                            <Form.Control 
                            as="select" 
                            name = "progress"
                            value = {this.state.progress}
                            onChange = {this.handleSelect}
                            >
                                <option>all</option>
                                <option>pending</option>
                                <option>in_progress</option>
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
                                pathname :'/dashboard/piechart',
                                aboutProps :{
                                    id : this.props.id,
                                }
                            }} >
                            <i>view chart</i>
                            </Link>
                        </Form.Group>
                    </Form.Row>
                </Form>
                { this.state.errorMessage &&
                    <h3 className="error"> { this.state.errorMessage } </h3> }
                {this.callTable()}
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        token :state.tokenReducer.token,
    }
}

export default connect(mapStateToProps)(ViewTaskDash)