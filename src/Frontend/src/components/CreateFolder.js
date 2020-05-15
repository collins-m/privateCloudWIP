import React, {Component} from 'react'; 
import {Modal, Button, Row, Col, Form} from 'react-bootstrap'; 
import axios from 'axios';

export class CreateFolder extends Component{
    constructor(props){
        super(props);
    }

    async handleSubmit(event){
        event.preventDefault();

        const token = localStorage.usertoken; 

        let config = { 
            headers: {
                Authorization: token
            },
        }
        await axios.post('/api/folder/create', { //! Take note of the `data` keyword. This is the request body.
        folderName: event.target.Folder.value,
        path: '/folder1'
         //! more `key: value` pairs as desired.
    }, config)
        .then(response=> response.json())
        .then((result) => {
            alert(result);
        }, 
        (error) => {alert('Failed')}
        )
        //alert(event.target.Email.value);
    }
    render(){
        return(
                  <Modal
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title id="contained-modal-title-vcenter">
                        Create Folder
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="container"> 
                      <Row> 
                        <Col sm={6}>
                        <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId= "Folder">
                        <Form.Label>"Please add folder name"</Form.Label>
                        <Form.Control
                            type = "text"
                            name = "Folder"
                            required
                            placeholder="Folder"
                        />
                        </Form.Group>
                        <Form.Group>
                            <Button variant= "primary" type = "submit"> Create </Button>
                        </Form.Group>
                        </Form>
                        </Col>

                    </Row>
                      </div>
                    </Modal.Body>

                    <Modal.Footer>
                      <Button varient="danger" onClick={this.props.onHide}>Cancel</Button>
                    </Modal.Footer>
                  </Modal>
                );
              }
    }
