import React, { Component } from 'react'
import { Redirect} from 'react-router-dom'
import axios from 'axios'

class Verify extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             loading : true,
             token : ''
        }
    }
    


    verification(){
        const query = new URLSearchParams(this.props.location.search);
        let para = query.get('token')
        
        this.setState({
            token : para
        })
        console.log(this.state.token)
        axios
        .post("http://localhost:8000/verify" , {
            token: para
        })

        this.setState({
            loading : false
        })
        // .then(response =>{
        //     this.setState({
        //         loading : false
        //     })
        // })
        // .catch(response => {
        //     this.setState({
        //         loading : false
        //     })
        // })
    }

    componentDidMount(){
        this.verification()
    }



    render() {

        // .verthisification()
        
        if(this.state.laoding){
            return <p>verifying</p>
        }

        return (
            <div>
                <p>verified</p>
                {/* <Redirect to = '/' /> */}
            </div>
        )
    }
}

export default Verify


