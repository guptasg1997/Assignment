import React, { Component } from 'react'

class RedirectLogin extends Component {
    render() {
        return (
            <>
                <div>
                    <Redirect to = "/dashboard"/>
                </div>
                <div>
                    <Redirect to = "/admindashboard"/>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        loginStatus : state.loginReducer.loginStatus ,
        token :state.tokenReducer.token,
    }
}

export default RedirectLogin
