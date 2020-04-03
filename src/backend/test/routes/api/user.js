const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const User = require('../../../main/models/user');
const server = require('../../../../index');

chai.use(chaiHttp);

describe('Users', () => {
    // cleanup
    beforeEach((done) => {
        User.deleteMany({}, () => {
            done();
        });
    });
    afterEach((done) => {
        User.deleteMany({}, () => {
            done();
        });
    });

    context('user registration use cases', () => {
        it('should create a new user successfully', (done) => {
            // build request body
            const user = {
                "firstname": "John",
                "surname": "Doe",
                "email": "johndoe@mail.com",
                "password": "password"
            }
            // send request
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
        
        it('should fail to create duplicate', (done) => {
            // build request body
            const user = {
                "firstname": "John",
                "surname": "Doe",
                "email": "johndoe@mail.com",
                "password": "password"
            }
            // send first request
            chai.request(server)
                .post('/api/user/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);

                    // send second request
                    chai.request(server)
                    .post('/api/user/register')
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(false);
                        done();
                    });
                });
        });

        it('should fail to create a user with missing parameters', (done) => {
            // build request body
            const user = {
                "firstname": "John",
                "surname": "Doe",
                "email": "johndoe@mail.com"
            }
            // send request
            chai.request(server)
                .post('/api/user/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
    });

    context('user authentication use cases', () => {
        it('should authenticate user successfully', (done) => {
            // build first request body
            const body = {
                "firstname": "John",
                "surname": "Doe",
                "email": "johndoe@mail.com",
                "password": "password"
            }
            // register user
            chai.request(server)
                .post('/api/user/register')
                .send(body)
                .end((err) => {
                    // build second request body
                    const body2 = {
                        "email": "johndoe@mail.com",
                        "password": "password"
                    }
                    // authenticate user
                    chai.request(server)
                        .post('/api/user/authenticate')
                        .send(body2)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('token');
                            done();
                        });
                });
        });

        it('should fail to authenticate user due to wrong password', (done) => {
           // build first request body
           const body = {
                "firstname": "John",
                "surname": "Doe",
                "email": "johndoe@mail.com",
                "password": "password"
            }
            // register user
            chai.request(server)
                .post('/api/user/register')
                .send(body)
                .end((err) => {
                    // build second request body
                    const body2 = {
                        "email": "johndoe@mail.com",
                        "password": "password2"
                    }
                    // authenticate user
                    chai.request(server)
                        .post('/api/user/authenticate')
                        .send(body2)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(false);
                            res.body.should.not.have.property('token');
                            done();
                        });
                });
        });

        it('should fail to authenticate user due to wrong user', (done) => {
            // build first request body
            const body = {
                 "firstname": "John",
                 "surname": "Doe",
                 "email": "johndoe@mail.com",
                 "password": "password"
             }
             // register user
             chai.request(server)
                 .post('/api/user/register')
                 .send(body)
                 .end((err) => {
                     // build second request body
                     const body2 = {
                         "email": "not-johndoe@mail.com",
                         "password": "password"
                     }
                     // authenticate user
                     chai.request(server)
                         .post('/api/user/authenticate')
                         .send(body2)
                         .end((err, res) => {
                             res.should.have.status(404);
                             res.body.should.be.a('object');
                             res.body.should.have.property('success').eql(false);
                             res.body.should.not.have.property('token');
                             done();
                         });
                 });
         });
    });

    context('user account use cases', () => {
        it('should get user account successfully', (done) => {
            // build first request body
            const body = {
                "firstname": "John",
                "surname": "Doe",
                "email": "johndoe@mail.com",
                "password": "password"
            }
            // register user
            chai.request(server)
                .post('/api/user/register')
                .send(body)
                .end((err) => {
                    // build second request body
                    const body2 = {
                        "email": "johndoe@mail.com",
                        "password": "password"
                    }
                    // authenticate user
                    chai.request(server)
                        .post('/api/user/authenticate')
                        .send(body2)
                        .end((err, res) => {
                            //initialise variables
                            const reqId = res.body.id;
                            const token = res.body.token;

                            // get user user account
                            chai.request(server)
                                .get('/api/user/{id}')
                                .query({'id': reqId})
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    done();
                                });
                        });
                });
        });

        it('should fail to get user account due to incorrect authorization', (done) => {
            // build first request body
            const body = {
                "firstname": "John",
                "surname": "Doe",
                "email": "johndoe@mail.com",
                "password": "password"
            }
            // register user
            chai.request(server)
                .post('/api/user/register')
                .send(body)
                .end((err) => {
                    // build second request body
                    const body2 = {
                        "email": "johndoe@mail.com",
                        "password": "password"
                    }
                    // authenticate user
                    chai.request(server)
                        .post('/api/user/authenticate')
                        .send(body2)
                        .end((err, res) => {
                            //initialise variables
                            const reqId = res.body.id;
                            const token = 'this is incorrect';

                            // get user user account
                            chai.request(server)
                                .get('/api/user/{id}')
                                .query({'id': reqId})
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.should.have.status(401);
                                    done();
                                });
                        });
                });
        });

        it('should delete user account successfully', (done) => {
            // build first request body
            const body = {
                "firstname": "John",
                "surname": "Doe",
                "email": "johndoe@mail.com",
                "password": "password"
            }
            // register user
            chai.request(server)
                .post('/api/user/register')
                .send(body)
                .end((err) => {
                    // build second request body
                    const body2 = {
                        "email": "johndoe@mail.com",
                        "password": "password"
                    }
                    // authenticate user
                    chai.request(server)
                        .post('/api/user/authenticate')
                        .send(body2)
                        .end((err, res) => {
                            //initialise variables
                            const reqId = res.body.id;
                            const token = res.body.token;

                            // delete user user account
                            chai.request(server)
                                .delete('/api/user/{id}')
                                .query({'id': reqId})
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('success').eql(true);
                                    done();
                                });
                        });
                });
        });

        it('should fail to delete user account due to incorrect authorization', (done) => {
            // build first request body
            const body = {
                "firstname": "John",
                "surname": "Doe",
                "email": "johndoe@mail.com",
                "password": "password"
            }
            // register user
            chai.request(server)
                .post('/api/user/register')
                .send(body)
                .end((err) => {
                    // build second request body
                    const body2 = {
                        "email": "johndoe@mail.com",
                        "password": "password"
                    }
                    // authenticate user
                    chai.request(server)
                        .post('/api/user/authenticate')
                        .send(body2)
                        .end((err, res) => {
                            //initialise variables
                            const reqId = res.body.id;
                            const token = 'this is incorrect';

                            // delete user user account
                            chai.request(server)
                                .delete('/api/user/{id}')
                                .query({'id': reqId})
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.should.have.status(401);
                                    done();
                                });
                        });
                });
        });
    });
});