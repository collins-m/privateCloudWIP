import React, {Component} from 'react'; 
import {Modal, Button, Row, Col, Form} from 'react-bootstrap'; 
import axios from 'axios';


 class RenameFile extends Component{
    constructor(props){
        super(props);
        
        this.handleSubmit = this.handleSubmit.bind(this)
    }

     handleSubmit(event){
        event.preventDefault();

        const token = localStorage.usertoken; 

        let config = { 
            headers: {
                Authorization: token
            },
        }
        

         axios.put(`/api/file/${this.props.id}`, { //! Take note of the `data` keyword. This is the request body.
        oldPath: `${this.props.path}`,
        newName: event.target.Rename.value
         //! more `key: value` pairs as desired.
    }, config)
        .then((result) => {
            alert("SuccessFul: Please exit!");
        }, 
    
        )
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
                       Please enter new name : 
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="container"> 
                      <Row> 
                        <Col sm={6}>
                        <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId= "Rename">
                        <Form.Label>New Name</Form.Label>
                        <Form.Control
                            type = "text"
                            name = "Rename"
                            required
                            placeholder=" (For Example: newName)"
                        />
                        </Form.Group>
                        <Form.Group>
                            <Button variant= "primary" type = "submit"> Rename </Button>
                        </Form.Group>
                        </Form>
                        </Col>

                    </Row>
                      </div>
                    </Modal.Body>

                    <Modal.Footer>
                      <Button varient="danger" onClick={this.props.onHide}>exit</Button>
                    </Modal.Footer>
                  </Modal>
                );
              }
    }
export default RenameFile;