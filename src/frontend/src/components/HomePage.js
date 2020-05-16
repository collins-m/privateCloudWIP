import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './styles.css'
class HomePage extends Component{
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
                                    <div class="inner"><button type="submit" class="msgBtn" onClick="return false;" >Login</button></div>
                                    <div class="inner"><button type="submit" class="msgBtn2" onClick="return false;">Register</button></div>
                                    </div>
                            </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default HomePage