const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const rimraf = require('rimraf');

const User = require('../../../main/models/user');
const Folder = require('../../../main/models/folder');
const server = require('../../../../index');

let token;

chai.use(chaiHttp);

describe('Folders', () => {
    // before class
    before((done) => {
        Folder.deleteMany({}, () => {
            User.deleteMany({}, () => {
                // create user
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
                        // authenticate user
                        const authBody = {
                            "email": "johndoe@mail.com",
                            "password": "password"
                        }
                        // authenticate user
                        chai.request(server)
                            .post('/api/user/authenticate')
                            .send(authBody)
                            .end((err, res) => {
                                token = res.body.token;
                                done();
                            });
                    });
            });
        });    
    });
    // cleanup
    beforeEach((done) => {
        Folder.deleteMany({}, () => {
            done();
        });
    });
    afterEach((done) => {
        Folder.deleteMany({}, () => {
            done();
        });
    });
    // after class
    after((done) => {
        rimraf('./public/johndoe@mail.com', () => {
            Folder.deleteMany({}, () => {
                User.deleteMany({}, () => {
                    done();
                });
            });
        });
    });

    context('folder creation use cases', () => {
        it('should create a folder successfully', (done) => {
            // build request body
            const body = {
                "folderName": "testFolder",
                "path": "/testFolder"
            }
            chai.request(server)
                .post('/api/folder/create')
                .set('Authorization', token)
                .send(body)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);

                    done();
                });
        });

        it('should fail to create a folder with missing parameters', (done) => {
            // build request body
            const body = {
                "folderName": "testFolder"
            }
            chai.request(server)
                .post('/api/folder/create')
                .set('Authorization', token)
                .send(body)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);

                    done();
                });
        });

        it('should fail to create duplicate folder', (done) => {
            // build request body
            const body = {
                "folderName": "testFolder",
                "path": "/testFolder"
            }
            // send initail request
            chai.request(server)
                .post('/api/folder/create')
                .set('Authorization', token)
                .send(body)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);

                    // should fail
                chai.request(server)
                    .post('/api/folder/create')
                    .set('Authorization', token)
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(false);

                        done();
                    });
                });
            
        });
    });
});