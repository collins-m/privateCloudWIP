import React, {Component} from 'react'; 
import {Modal, Button, Row, Col, Form} from 'react-bootstrap'; 
import axios from 'axios';


 class DeleteFile extends Component{
    constructor(props){
        super(props);
        
        this.handleSubmit = this.handleSubmit.bind(this)
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

     handleSubmit(event){
        event.preventDefault();

         const token = localStorage.usertoken; 
  
        let config = { 
          headers: {
              Authorization: token
          },
          data: { //! Take note of the `data` keyword. This is the request body.
              path: this.props.path
               //! more `key: value` pairs as desired.
          } 
        }
        axios.delete(`/api/file/${this.props.id}`, config)
        .then((result) => {
            alert("Successful! Your file has been deleted. Please exit!");
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
               Are you sure?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container"> 
              <Row> 
                <Col sm={6}>
                <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId= "Path">
                <Form.Label>Warning: This will not be reversed!</Form.Label>
                <Form.Control
                    type = "text"
                    name = "Path"
                    required
                    placeholder=" Yes/No"
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
              <Button varient="danger" onClick={this.props.onHide}>Exit</Button>
            </Modal.Footer>
          </Modal>

        )
    }
    }
export default DeleteFile;