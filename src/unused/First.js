import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class First extends Component {
    render() {
        return (
            <>
                <Link to ='/login' >
                    <h2>Login</h2>
                </Link>
                <Link to ='/signup' >
                    <h2>Signup</h2>
                </Link>
                <Link to ='/verify' >
                    <h2>Email Verification</h2>
                </Link>
                <Link to ='/forgotpassword' >
                    <h2>Forgot Password</h2>
                </Link>

                
                
            </>
        )
    }
}

export default First
