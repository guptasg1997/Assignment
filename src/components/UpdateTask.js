import axios from 'axios'
import React, { Component } from 'react'
import { Button , Form } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

class UpdateTask extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             title :'',
             task : '',
             deadline :'',
             loading : true,
             completed  : false,
             errorMessage : '',
        }
    }

    getPreviousValues(){
        if(!this.props.location.aboutProps)
        return;

        axios
        .post("http://localhost:8000/get-task" , {
            id : this.props.location.aboutProps.id /// get id from props
        },{
            headers: {
              'Authorization': `Bearer ${this.props.token}` 
            }
          })
        .then(response =>{
            //console.log(response.data)
            const data = response.data;
            this.setState({
                title: data.title,
                task: data.task,
                deadline : data.deadline,
                loading : false,
            })
        })
        .catch(error=>{
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp[0]})
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleSubmit = (event)=>{
        event.preventDefault()
        //console.log(this.props.location.aboutProps.id)
        axios
        .post('http://localhost:8000/update-task' ,{
            id : this.props.location.aboutProps.id,  ///get this from props
            task : this.state.task,
            title : this.state.title,
            deadline : this.state.deadline,
            assigner : this.state.assigner,
        },{
            headers: {
              'Authorization': `Bearer ${this.props.token}` 
            }
          })
        .then(response =>{
            this.setState({completed : true})
        })
        .catch(error => {
            let temp = Object.values(error.response.data)
            this.setState({errorMessage : temp[0]})
        })
    }
    
    componentDidMount(){
        this.getPreviousValues()
    }

    render() {

        if(!this.props.location.aboutProps){
            return(
                <Redirect to = "/dashboard"/>
            )
        }

        if(this.state.completed){
            return(
                <Redirect to = "/dashboard"/>
            )
        }

        if(this.state.loading){
            return(<p>loading...</p>)
        }
        return (
            <div>
                { this.state.errorMessage &&
                    <h3 className="error"> { this.state.errorMessage } </h3> }
                <Form onSubmit = {this.handleSubmit}>
                 <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                        name ="title"
                        value = {this.state.title} 
                        onChange = {this.handleChange}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Task</Form.Label>
                        <Form.Control
                        as ="textarea"
                        rows = {5}
                        name ="task"
                        value = {this.state.task} 
                        onChange = {this.handleChange}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control
                        // type = "datetime-local"
                        // step = "1"
                        type = "text"
                        name ="deadline"
                        value = {this.state.deadline}
                        onChange = {this.handleChange}>
                        </Form.Control>
                    </Form.Group>
                    <Button type = "submit">Add</Button>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        token :state.tokenReducer.token,
    }
}

export default connect(mapStateToProps)(UpdateTask)
