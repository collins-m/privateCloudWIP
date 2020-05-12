import React, {Component} from 'react';
import axios from 'axios';

const token = localStorage.usertoken

class GetFiles extends Component{
    state = {
        files:[], 
        isLoading: null,
        errors:null
    };
    
    async deleteFile(id){
      let s = '\textFile1.txt'  ;
        await axios.delete(`/api/file/${id}`, {
          headers: {
          'Authorization': token
          }
      },
      { path: s})
      
      let files2 = this.state.files
      for (let i = 0; i < files2.length; i++){
        let file = file[i]
        if (file.id === id){
          files2.slice(i, 1)
          break; 
        }
      }
      this.setState({files:files2});

      this.props.history.push(`/upload`) //redirect back to page
    }
    componentDidMount() {
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
          })
          .catch(error => this.setState({ error, isLoading: false }));
    }
    render() {
        const { isLoading, files } = this.state;
        return (
          <React.Fragment>
            <h2>List of Files</h2>
            <div>
              {!isLoading ? (
                files.map(file => {
                  const { id, filename, path, favourite, accessList } = file;
                  return (
                    <div key={id}>
                      <p>{id}</p>
                      <div>
                      <p>{"path" + path}</p>
                      </div>
                      <div class="dropdown">
                          <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            Dropdown
                            <span class="caret"></span>
                          </button>
                          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                            <li><a href="#">Move</a></li>
                            <li><a href="#" onClick= {this.deleteFile.bind(id)}>Delete</a></li>
                            <li><a href="#">Share with a friend</a></li>
                            <li role="separator" class="divider"></li>
                          </ul>
                      </div>
                      <hr />
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