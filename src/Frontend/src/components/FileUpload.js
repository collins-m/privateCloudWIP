import React, {Component} from 'react'

class fileUpload extends Component{

    //Store File 
    state = {
        selectedFile: null
    }

    fileSelectedHandler = event => {
        this.setState({
        selectedFile: event.target.files[0]
        })
        //console.log(event.target.files[0]); //First file in the array of files
    }

    //Upload a file 
    fileUploadHandler = (email, passcode) => {
        const fd = new FormData(); 
        fd.append('image', this.state.selectedFile, this.state.selectedFile.name)
        axios.post('/api/file/upload',fd, this.email, this.passcode)
        .then(res => {
        console.log(res); 
        }); 
    }

    render() {
        return (
        <div className="App">
            <input type="file" onChange={this.fileSelectedHandler}/>
            <button onClick={this.fileSelectedHandler}>Upload</button>
        </div>
        );
    }
}  
export default fileUpload 