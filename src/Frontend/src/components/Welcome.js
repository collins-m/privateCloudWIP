import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './styles.css'
class Welcome extends Component{
    //Responsible for the grey area with large welcome sign
    render(){
        return(
            <div className= "right"> 
                <div className= "Jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <div className="center">
                            <h1>DCU xDrive 
                                </h1>
                                <div id="outer">
                                    <div class="inner"><Link to= "/login "><button type="submit" className="msgBtn"  >Login</button></Link></div>
                                    <div class="inner"><Link to= "/register"><button type="submit" className="msgBtn2" >Register</button></Link></div>
                                    </div>
                            </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default Welcome