import React, {Component} from 'react'; 
import {Modal, Button, Row, Col, Form} from 'react-bootstrap'; 
import axios from 'axios';


 class DeleteFile extends Component{
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
        

         axios.post(`/api/file/${this.props.id}/download`, { //! Take note of the `data` keyword. This is the request body.
        path: `${this.props.path}`,
        passcode: "123"         
        //! more `key: value` pairs as desired.
    }, config)
        .then(response=> response.json())
        .then((result) => {
            alert(result);
        }, 
        
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

                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="container"> 
                      <Row> 
                        <Col sm={6}>
                        <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId= "Downoad">
                        <Form.Label>Download File</Form.Label>
                        <Form.Control
                            type = "text"
                            name = "Download"
                            required
                            placeholder=" Passcode"
                        />
                        </Form.Group>
                        <Form.Group>
                            <Button variant= "primary" type = "submit"> Download</Button>
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
export default DeleteFile;