import React, {Component} from 'react'; 
import {Modal, Button, Row, Col, Form} from 'react-bootstrap'; 
import axios from 'axios';


 class MoveFile extends Component{
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
        newPath: "/"+event.target.Path.value+"/"+this.props.filename
         //! more `key: value` pairs as desired.
    }, config)
        .then((result) => {
            alert("Successful! Please Exit.");
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
                       Please enter address below: 
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="container"> 
                      <Row> 
                        <Col sm={6}>
                        <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId= "Path">
                        <Form.Label>New Path</Form.Label>
                        <Form.Control
                            type = "text"
                            name = "Path"
                            required
                            placeholder=" (For Example: MyFolder"
                        />
                        </Form.Group>
                        <Form.Group>
                            <Button variant= "primary" type = "submit"> Send </Button>
                        </Form.Group>
                        </Form>
                        </Col>

                    </Row>
                      </div>
                    </Modal.Body>

                    <Modal.Footer>
                      <Button varient="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                  </Modal>
                );
              }
    }
export default MoveFile;