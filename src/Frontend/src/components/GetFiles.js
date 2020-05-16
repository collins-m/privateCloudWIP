import React, {Component} from 'react';
import axios from 'axios';
import {Button, ButtonToolbar} from 'react-bootstrap'
import ShareFile from './ShareFile' //how to get function from different file
import CreateFolder from './CreateFolder'

class GetFiles extends Component{
    state = {
        files:[], 
        isLoading: null,
        errors:null,
        showModel: false //false initially because we don't want to show it initially
    };
    
    async deleteFile(id){
      //const formdata = new FormData();

     // formdata.append('path', "/textFile.txt");
      const token = localStorage.usertoken; 

      let config = { 
        headers: {
            Authorization: token
        },
        data: { //! Take note of the `data` keyword. This is the request body.
            path: '/textFile.txt'
             //! more `key: value` pairs as desired.
        } 
      }
     
      await axios.delete('/api/file/{id}', config)
      
      console.log("Done!"); 
      
      //this.props.history.push(`/upload`) //redirect back to page
    }
    componentDidMount() {
       const token =  localStorage.usertoken; 

        axios
          .get('/api/file/',{
            headers: {
            'Authorization': token
            }
        })
          .then(response =>
            
            response.data.files.map(file => ({
              id: `${file.id}`,
              filename: `${file.filename}`,
              path: `${file.path}`,
              favourite: `${file.favourite}`,
              accessList: `${file.accessList}`
            }))
    
          )
          .then(files => {
            this.setState({
              files,
              isLoading: false
            });
            console.log()
          })
          .catch(error => this.setState({ error, isLoading: false }));
    }
    render() {
        const { isLoading, files } = this.state;
        let closeModel = () => this.setState({showModel: false}); //on the event of a close button, it will be false

        return (
          <React.Fragment>
            <h2>List of Files</h2>
            <div>
              {!isLoading ? (
                files.map(file => {
                  const { id, filename, path, favourite, accessList } = file;
                  return (
                    <div key={filename}>
                      <p>{filename}</p>
                      <div>
                     
                      </div>
                      <div class="dropdown">
                          <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            Dropdown
                            <span class="caret"></span>
                          </button>
                          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                            <li><a href="#">Move</a></li>
                            <li><a href="#" onClick= {this.deleteFile.bind(id)}>Delete</a></li>
                            <li role="separator" class="divider"></li>
                          </ul>
                          

                      </div>
                     
                      <hr />
                      <ButtonToolbar>
                              <Button
                              variant= 'primary'
                              onClick={()=> this.setState({showModel:true})}
                              >Share</Button>
                                
                            <ShareFile 
                            show= {this.state.showModel}
                            onHide = {closeModel}
                            />

                            <Button
                             
                              variant= 'Lime'
                              onClick={()=> this.setState({showModel:true})}
                              >Download</Button>
                                
                            <CreateFolder 
                            show= {this.state.showModel}
                            onHide = {closeModel}

                            
                            />
                
                    
                            </ButtonToolbar>

                    </div>

                  );
                })
              ) : (
                <p>Loading...</p>
              )}
           </div>
           
          </React.Fragment>
        );
      }
}
export default GetFiles;