const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should;

const User = require('../../../main/models/user');
const server = require('../../../../index');

chai.use(chaiHttp);

// cleanup
describe('Users', () => {
    beforeEach((done) => {
        User.remove({}, (err) => { 
           done();           
        });        
    })
});

describe('/POST User', () => {
    it('it should create a new user', (done) => {
        // build request body
        const user = {
            "firstname": "John",
            "surname": "Doe",
            "email": "johndoe@mail.com",
            "password": "password"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                done();
            });
    });
});