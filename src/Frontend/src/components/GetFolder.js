import React, {Component} from 'react';
import axios from 'axios';
import {Button, ButtonToolbar} from 'react-bootstrap'
//import {ShareFolder} from './ShareFolder' //how to get function from different folder
import CreateFolder from './CreateFolder'
import ShareFile from './ShareFile' //how to get function from different file


class GetFolder extends Component{
    state = {
        folders:[], 
        isLoading: null,
        errors:null,
        showModel: false //false initially because we don't want to show it initially
    };
    
    async deleteFolder(id){
      //const formdata = new FormData();

     // formdata.append('path', "/textfolder.txt");
      const token = localStorage.usertoken; 

      let config = { 
        headers: {
            Authorization: token
        },
        data: { //! Take note of the `data` keyword. This is the request body.
            path: '/folder1'
             //! more `key: value` pairs as desired.
        } 
      }
     
      await axios.delete('/api/folder/{id}', config)
      
      console.log("Done!"); 
      
      //this.props.history.push(`/upload`) //redirect back to page
    }
    componentDidMount() {
       const token =  localStorage.usertoken; 

        axios
          .get('/api/folder/',{
            headers: {
            'Authorization': token
            }
        })
          .then(response =>
            
            response.data.folders.map(folder => ({
              id: `${folder.id}`,
              folderName: `${folder.folderName}`,
              path: `${folder.path}`,
              favourite: `${folder.favourite}`,
              accessList: `${folder.accessList}`
            }))
    
          )
          .then(folders => {
            this.setState({
              folders,
              isLoading: false
            });
            console.log()
          })
          .catch(error => this.setState({ error, isLoading: false }));
    }
    render() {
        const { isLoading, folders } = this.state;
        let closeModel = () => this.setState({showModel: false}); //on the event of a close button, it will be false

        return (
          <React.Fragment>
            <h2>List of folders</h2>
            <div>
              {!isLoading ? (
                folders.map(folder => {
                  const { id, folderName, path, favourite, accessList } = folder;
                  return (
                    <div key={id}>
                      <p>{folderName}</p>
                      <div>
                      <p>{}</p>
                      </div>
                      <div class="dropdown">
                          <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            Dropdown
                            <span class="caret"></span>
                          </button>
                          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                            <li><a href="#">Move</a></li>
                            <li><a href="#" onClick= {this.deleteFolder.bind(id)}>Delete</a></li>
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
                              variant= 'danger'
                              onClick={()=> this.setState({showModel:true})}
                              >Create Folder</Button>
                                
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
export default GetFolder;