import React, {Component} from 'react'
import jwt_decode from 'jwt-decode'
import GetFiles from './GetFiles'


class UploadedFiles extends Component{
   render(){
       return(
           <GetFiles/>
       )
   }
}

export default UploadedFiles;