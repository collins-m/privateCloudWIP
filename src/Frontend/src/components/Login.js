import React, {Component} from 'react'
import {login} from './UserFunctions'
import store from 'store';
import isLoggedIn from '../helpers/is_logged_in'
import {Redirect} from 'react-router-dom'; 
import styles from './styles.css';

class Login extends Component{
    //initialising the values of the state
    constructor(){
        super()
        this.state = {
            email: '', 
            password: '', 
            error: false,
        } 
        
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value}) //Changing the values of target name
    }

    onSubmit(e){
        e.preventDefault() //prevent form from submitting default
        const {history} = this.props; 
        
        const user = { //Update new values in state
            email: this.state.email,
            password: this.state.password
        }
        this.setState({ error: false });

        login(user).then(res => {
            if(res){
                store.set('loggedIn', true);
                this.props.history.push('/userprofile')
            }
        })

    }
//form on screen
    render() {
        if (isLoggedIn()){
            return <Redirect to = "/userprofile"/>
        }
        return (
            <div className="login-form">
                <div className="row"> 
                    <div className= "col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className = "h3 mb-3 font-weight-normal"> Please sign in </h1>
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
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
