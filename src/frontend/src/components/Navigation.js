import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom'
//withRouter is used to push states in application
class Navigation extends Component{
    //Logout will accept an event object 
    logOut(e){
        e.preventDefault() //prevent the defualt action of logout function
        localStorage.removeItem('usertoken') //local storage token
        this.props.history.push('/') //push url to Homepage component
    }

    render(){
        //two different groups of unordered lists
        //first containing login and register
        const loginRegLink = (
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/logon" className ="nav-link">
                        Login
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/registration" className ="nav-link">
                        Register
                    </Link>
                </li>
            </ul>
        )
        //next group of unordered list for profile
        const userLink = (
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/userprofile" className ="nav-link">
                        User
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/upload" className ="nav-link">
                        Upload
                    </Link>
                </li>
                <li className="nav-item">
                    <a href="/UploadedFiles" className ="nav-link">
                        View Files
                    </a>
                </li>
                <li className="nav-item">
                    <a href="" onClick={this.logOut.bind(this)} className ="nav-link">
                        Logout
                    </a>
                </li>
                
            </ul>
        )// logOut function to call logOut function above

        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded">
                <button className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbar1"
                    aria-controls="navbar1"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-md-center" id = "navbar1">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                    </ul>
                    {localStorage.usertoken ? userLink : loginRegLink} 
                </div>   
            </nav>
        ) //if user token exist, choose the correct group
    }
}

export default withRouter(Navigation)