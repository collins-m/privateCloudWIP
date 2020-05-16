import React, {Component} from 'react'; 
import {Modal, Button, Row, Col, Form} from 'react-bootstrap'; 
import axios from 'axios';

export class ShareFolder extends Component{
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
        
        await axios.put('/api/file/5ebd4af3258ef512c5890a77/share', { //! Take note of the `data` keyword. This is the request body.
        path: '/textFile.txt',
        user: event.target.Email.value
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
                        Add address
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="container"> 
                      <Row> 
                        <Col sm={6}>
                        <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId= "Email">
                        <Form.Label>"Email"</Form.Label>
                        <Form.Control
                            type = "text"
                            name = "Email"
                            required
                            placeholder="Email"
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
