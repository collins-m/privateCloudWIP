import React, { Component } from 'react';
import * as FilePond from 'filepond';
import 'filepond/dist/filepond.min.css'

class DragFile extends Component {
  constructor(props) {
    super(props);

    this.state = {
        // Set initial files, type 'local' means this is a file
        // that has already been uploaded to the server (see docs)
        files: [{
            source: 'photo.jpeg',
            options: {
                type: 'local'
            }
        }]
    };
  }

  handleInit() {
      console.log('FilePond instance has initialised', this.pond);
  }

  render() {
      return (
          <div className="App">
          
              <FilePond ref={ref => this.pond = ref}
                        files={this.state.files}
                        allowMultiple={true}
                        server={{
                            // fake server to simulate loading a 'local' server file and processing a file
                            process: (fieldName, file, metadata, load) => {
                                // simulates uploading a file
                                setTimeout(() => {
                                    load(Date.now())
                                }, 1500);
                            },
                            load: (source, load) => {
                                // simulates loading a file from the server
                                fetch(source).then(res => res.blob()).then(load);
                            }
                        }}
                        oninit={() => this.handleInit() }
                        onupdatefiles={fileItems => {
                            // Set currently active file objects to this.state
                            this.setState({
                                files: fileItems.map(fileItem => fileItem.file)
                            });
                        }}>
              </FilePond>
              
          </div>
      );
  }
}

export default DragFile;