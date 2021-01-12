import React, { Component } from 'react'
import { Button , Form } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'


import axios from 'axios'




class AddTask extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             title :'',
             task : '',
             deadline : '',
             completed : false,
             errorMessage : '',
        }
    }
    
    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleSubmit = (event)=>{
        event.preventDefault()
        console.log(this.props.location.aboutProps.id)
        //console.log(this.state.deadline)
        axios
        .post('http://localhost:8000/add-task' ,{
            title : this.state.title,
            task : this.state.task,
            deadline : this.state.deadline,
            assigned_to : this.props.location.aboutProps.id,
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
            this.setState({errorMessage : temp[0]})        })
    }


    render() {
        // console.log(this.props.location.aboutProps)
        if(!this.props.location.aboutProps || this.state.completed){
            return(
                <Redirect to = "/dashboard"/>
            )
        }

        return (
            <>
                <h4>adding task to {this.props.location.aboutProps.name}</h4>
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
                        type = "datetime-local"
                        step = "1"
                        name ="deadline"
                        value = {this.state.deadline}
                        onChange = {this.handleChange}>
                        </Form.Control>
                    </Form.Group>
                    <Button type = "submit">Add</Button>
                </Form>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        token :state.tokenReducer.token,
    }
}

export default connect(mapStateToProps)(AddTask)
