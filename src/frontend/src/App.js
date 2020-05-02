import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import Navigation from './components/Navigation'
import HomePage from './components/HomePage'
import SignIn from './components/SignIn'
import Registration from './components/Registration'
import UserProfile from './components/UserProfile'
import FileUpload from './components/FileUpload'


//import Sidebar from './Sidebar'

class App extends Component {
  //wrapping application with Router Component
  //Navbar component will be positioned at the top of the window
  //path variable will be linked with the components
  render () {
    return (
      <Router> 
        <div className= "App">
          <Navigation/>
          <Route exact path="/" component={HomePage}/>
          <div className="container">
            <Route exact path="/registration" component={Registration}/> 
            <Route exact path="/logon" component={SignIn}/>
            <Route exact path="/userprofile" component={UserProfile}/>
            <Route exact path="/upload" component={FileUpload}/>
          </div>
        </div>
      </Router>
    )
    }
}
export default App //export in order to link the application to this app.js
