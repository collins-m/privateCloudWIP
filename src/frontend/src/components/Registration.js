import React, {Component} from 'react'
import {registration} from './UserFunctions'

class Registration extends Component{
    constructor(){
        super()
        this.state = {
            firstname: '',
            surname: '',
            email: '', 
            password: '', 
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit(e){
        e.preventDefault()

        const NUser = { //new user information
            firstname: this.state.firstname,
            surname: this.state.surname,
            email: this.state.email,
            password: this.state.password
        }

        registration(NUser).then(res => {
            this.props.history.push('/logon') //will show logon component
        })
    }
//Display on screen
    render() {
        return (
            <div className="container">
                <div className="row"> 
                    <div className= "col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className = "h3 mb-3 font-weight-normal"> Please Register</h1>
                            <div className="form-group"> 
                                <label htmlfor="firstname">First Name</label>
                                <input type="text" 
                                    className= "form-control"
                                    name= "firstname"
                                    placeholder="Enter First Name"
                                    value={this.state.firstname}
                                    onChange={this.onChange}/>
                            </div>
                            <div className="form-group"> 
                                <label htmlfor="surname">Surname</label>
                                <input type="text" 
                                    className= "form-control"
                                    name= "surname"
                                    placeholder="Enter Last Name"
                                    value={this.state.surname}
                                    onChange={this.onChange}/>
                            </div>
                            <div className="form-group"> 
                                <label htmlfor="email">Email Address</label>
                                <input type="email" 
                                    className= "form-control"
                                    name= "email"
                                    placeholder="Enter Email"
                                    value={this.state.email}
                                    onChange={this.onChange}/>
                            </div>
                            <div className="form-group"> 
                                <label htmlfor="password">Password</label>
                                <input type="password" 
                                    className= "form-control"
                                    name= "password"
                                    placeholder="Enter Password"
                                    value={this.state.password}
                                    onChange={this.onChange}/>
                            </div>
                            <button type = "submit" className= "btn btn-lg btn-primary btn-block">
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Registration //export so other js files can see
