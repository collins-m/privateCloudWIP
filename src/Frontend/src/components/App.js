import React from 'react';
import Cms from './Cms';
import {Route, Switch} from 'react-router-dom';
import SignIn from './Login'
import Welcome from './Welcome'
import Login from './Login'; 
import Register from './Register'



//if there's anything that matches the root route; everthing will match
//we want to render our cms
//it's gonna display eveything down that tree
const App = () => (
    <div className = "app-routes">
        <Switch>
            <Route exact path="/welcome" component={Welcome}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <Route path= "/" component= {Cms}/>
        </Switch>
    </div>
)

export default App;
