import React, {Component} from 'react'
import jwt_decode from 'jwt-decode'
import GetFiles from './GetFiles'
import GetFolder from './GetFolder'
import ShareFile from './ShareFile'





class UploadedFiles extends Component{
   render(){
       return(
           <div>
           <GetFiles/>
           <br/>
           <br/>
           <br/>
           <GetFolder/>
           <br/>
           <br/>
           <br/>
           <h2>Shared Files and Folders</h2>
           </div>

       )
   }
}

export default UploadedFiles;