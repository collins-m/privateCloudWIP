const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const rimraf = require('rimraf');
const User = require('../../../main/models/user');
const File = require('../../../main/models/file');
const server = require('../../../../index');

let token;

chai.use(chaiHttp);

describe('Files', () => {
    // before class
    before((done) => {
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
    // cleanup
    beforeEach((done) => {
        File.deleteMany({}, () => {
            done();
        });
    });
    afterEach((done) => {
        File.deleteMany({}, () => {
            done();
        });
    });
    // after class
    after((done) => {
        rimraf('./public/johndoe@mail.com', () => {
            User.deleteMany({}, () => {
                done();
            });
        });
    });

    context('file upload use cases', () => {
        it('should upload a file successfully', (done) => {
            chai.request(server)
                .post('/api/file/upload')
                .field('owner', 'johndoe@mail.com')
                .field('passcode', 'passcode')
                .attach('file', './backend/test/resources/api/file/testFile.txt', 'testFile.txt')
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);

                    done();
                });
        });

        it('should fail to upload a missing file', (done) => {
            chai.request(server)
                .post('/api/file/upload')
                .field('owner', 'johndoe@mail.com')
                .field('passcode', 'passcode')
                .attach('file')
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);

                    done();
                });
        });

        it('should fail to upload file with missing "passcode" field', (done) => {
            chai.request(server)
                .post('/api/file/upload')
                .field('owner', 'johndoe@mail.com')
                .attach('file', './backend/test/resources/api/file/testFile.txt', 'testFile.txt')
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);

                    done();
                });
        });
    });

    context('get user files use cases', () => {
        it('should return an array of user\'s files', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('owner', 'johndoe@mail.com')
                .field('passcode', 'passcode')
                .attach('file', './backend/test/resources/api/file/testFile.txt', 'testFile.txt')
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    
                    // get file array
                    chai.request(server)
                        .get('/api/file')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('files').with.lengthOf(1);

                            done();
                        });
                });
        });

        it('should return an empty array', (done) => {
            // attempt to get file array
            chai.request(server)
                .get('/api/file')
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('files').with.lengthOf(0);

                    done();
                });
        });
    });
});
