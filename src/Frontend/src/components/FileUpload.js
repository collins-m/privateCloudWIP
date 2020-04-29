import React, {Component} from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

class FileUpload extends Component{
    constructor() {
        super()
        this.state = {
            email: '',
            file: null
        }
    }

    componentDidMount(){
        const token = localStorage.usrtoken //localstorage token
        const decoded = jwt_decode(token) 
        this.setState({ //set states will automatically update states 
            email: decoded.data.email,
        })
        console.log(decoded)
    }

    handleFile(e){
        let file = e.target.files[0]

        this.setState({file:file})
    }

    handleUpload(e){
        
        let file = this.state.file

        let formdata = new FormData()

        formdata.append('image', file)

        formdata.append('name', "bla bla")

        axios({
            url:"", 
            method: "POST",
            headers: {
                authorization: "token"
            }, 
            data: formdata,
        }).then((res)=>{

        })
    }

    render(){
        return(
            <div className='App'>

                <h1> The Form </h1>
                
                <form>

                    <div className="">
                        <label> Select </label>
                        <input type = "file" name="file" onChange={(e) => this.
                        handleFile(e)}/> 
                    </div>
                    <button>Upload</button>
                </form>

            </div>
        )
    }
}
export default FileUpload 