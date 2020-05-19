import React, {Component} from 'react';
import ReactDOM from "react-dom";//NEW
import {BrowserRouter as Router, Route} from 'react-router-dom'
import "./components/styles.css"; //NEW
import {Switch} from 'react-router-dom'

import Navigation from './components/Navigation'
import HomePage from './components/HomePage'
import SignIn from './components/SignIn'
import Registration from './components/Registration'
import UserProfile from './components/UserProfile'
import FileUpload from './components/FileUpload'
import Sidebar from './components/Sidebar';
import UploadedFiles from './components/UploadedFiles'

const Child = ({match})=> console.log('match', match) || (
  <div>
    <h1>{match.params.id}</h1>
  </div>
)
class App extends Component {
  //wrapping application with Router Component
  //Navbar component will be positioned at the top of the window
  //path variable will be linked with the components
  render () {
    return (
      <Router> 
        <div className= "App">
        

        <Sidebar pageWrapId={"page-wrap"} outerContainerId={"App"} /> 
        <div id="page-wrap"></div>
          <Navigation/>
          
          <div className="container">
            <Switch>
            <Route exact path="/registration" component={Registration}/> 
            <Route exact path="/logon" component={SignIn}/>
            <Route exact path="/userprofile" component={UserProfile}/>
            <Route exact path="/upload" component={FileUpload}/>
            <Route exact path="/uploadedFiles" component={UploadedFiles}/>
            <Route exact path="/" component={HomePage}/>
           
            </Switch>
          </div>
        </div>
      </Router>
    )
    }
}
export default App //export in
