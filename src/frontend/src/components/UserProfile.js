import React, {Component} from 'react'
import jwt_decode from 'jwt-decode'

class UserProfile extends Component{
    constructor() {
        super()
        this.state = {
            firstname: '', 
            surname: '',
            email: ''
        }
    }

    componentDidMount(){
        const token = localStorage.usertoken //localstorage token
        const decoded = jwt_decode(token) 
        this.setState({ //set states will automatically update states
            firstname: decoded.data.firstname,
            surname: decoded.data.surname, 
            email: decoded.data.email,
        })
        console.log(decoded)
    }
//Display on screen 
    render(){
        return(
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">PROFILE</h1>
                    </div>
                    <table className="table col-md-6 mx-auto">
                        <tbody>
                            <tr>
                                <td> First Name </td>
                                <td>{this.state.firstname}</td>
                            </tr>
                            <tr>
                                <td> Surname </td>
                                <td>{this.state.surname}</td>
                            </tr>
                            <tr>
                                <td> Email </td>
                                <td>{this.state.email}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
export default UserProfile