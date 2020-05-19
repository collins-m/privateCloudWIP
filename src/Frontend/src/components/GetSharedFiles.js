import React, {Component} from 'react';
import axios from 'axios';
import {Button, ButtonToolbar} from 'react-bootstrap'
import { Dropdown,Icon } from 'semantic-ui-react'
import ShareFile from './ShareFile' //how to get function from different file
import MoveFile from './MoveFile' //how to get function from different file
import RenameFile from './RenameFile' //how to get function from different file
import DeleteFile from './DeleteFile' //how to get function from different file
import DownloadFile from './DownloadFile' //how to get function from different file




import CreateFolder from './CreateFolder'
import {Route, Link} from 'react-router-dom' 
import './styles.css'

class GetSharedFiles extends Component{
    constructor(props){
      super(props)
      this.state = {
          sharedFiles:[], 
          isLoading: null,
          errors:null,
          showModel: false //false initially because we don't want to show it initially    
      };
      
      this.handleDelete = this.handleDelete.bind(this);
   }
    
    handleDelete(){
      //const formdata = new FormData();
      const {match: {params}, history} = this.props;

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
      axios.delete(`/api/file/${params.id}`, config)
      .then(() => {
        history.push('/docs/upload');  //history is saved in visited
      });
      
      console.log(this.props.match); 
      
      //this.props.history.push(`/upload`) //redirect back to page
    }

    handleMove(path){
      //const formdata = new FormData();
      const {match: {params}, history} = this.props;

     // formdata.append('path', "/textFile.txt");
      const token = localStorage.usertoken; 

      let config = { 
        headers: {
            Authorization: token
        },
        data: { //! Take note of the `data` keyword. This is the request body.
            oldPath: path
             //! more `key: value` pairs as desired.
        } 
      }
      axios.put(`/api/file/${params.id}`, config)
      .then(() => {
        history.push('/docs/upload');  //history is saved in visited
      });
      
      console.log(this.props.match); 
      
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
            
            response.data.sharedFiles.map(file => ({
              id: `${file.id}`,
              filename: `${file.filename}`,
              path: `${file.path}`,
              favourite: `${file.favourite}`,
              accessList: `${file.accessList}`
            }))
    
          )
          .then(sharedFiles => {
            this.setState({
              sharedFiles,
              isLoading: false
            });
            console.log()
          })
          .catch(error => this.setState({ error, isLoading: false }));
    }
    render() {
        const { isLoading, sharedFiles } = this.state;
        let closeModel = () => this.setState({showModel: false}); //on the event of a close button, it will be false

        return (
          <React.Fragment>
            <div>
              {!isLoading ? (
                sharedFiles.map(file => {
                  const { id, filename, path, favourite, accessList } = file;
                  return (
                    <div key={filename}>
                      <li><Link to = {`/docs/files/${file.id}`}>{filename}</Link></li>
                      <p>{path}</p>
                      
                     
                     
                      <ButtonToolbar>
                              <Button
                              variant= 'primary'
                              onClick={()=> this.setState({showModel:true})}
                              >Share</Button>
                                
                            <ShareFile 
                            show= {this.state.showModel}
                            onHide = {closeModel}
                            path = {path}
                            id = {id}
                            />

                            <Button
                              variant= 'primary'
                              onClick={()=> this.setState({showModel:true})}
                              >Move</Button>
                                
                            <MoveFile 
                            show= {this.state.showModel}
                            onHide = {closeModel}
                            path = {path}
                            id = {id}
                            filename={filename}

                            />

                          <Button
                              variant= 'primary'
                              onClick={()=> this.setState({showModel:true})}
                              >Rename</Button>
                                
                            <RenameFile 
                            show= {this.state.showModel}
                            onHide = {closeModel}
                            path = {path}
                            id = {id}

                            />
                          <span></span>

                          <Button
                              variant= 'primary'
                              onClick={()=> this.setState({showModel:true})}
                              >Delete</Button>
                                
                            <DeleteFile 
                            show= {this.state.showModel}
                            onHide = {closeModel}
                            path = {path}
                            id = {id}

                            />

                            <Button
                              variant= 'primary'
                              onClick={()=> this.setState({showModel:true})}
                              >Download</Button>
                                
                              <DownloadFile 
                              show= {this.state.showModel}
                              onHide = {closeModel}
                              path = {path}
                              id = {id}

                            />
                            
                            </ButtonToolbar>
                            <br/>

                    </div>
                  );
                })
              ) : (
                <p>Loading...</p>
              )}
           </div>
           <hr/>
          </React.Fragment>
        );
      }
}
export default GetSharedFiles;