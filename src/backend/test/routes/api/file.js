const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const rimraf = require('rimraf');

const User = require('../../../main/models/user');
const File = require('../../../main/models/file');
const Folder = require('../../../main/models/folder');
const server = require('../../../../index');

let token;

chai.use(chaiHttp);

describe('Files', () => {
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
            Folder.deleteMany({}, () => {
                User.deleteMany({}, () => {
                    done();
                });
            });
        });
    });

    context('file upload use cases', () => {
        it('should upload a file successfully', (done) => {
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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
                .field('path', '/testFile.txt')
                .attach('file', './backend/test/resources/api/file/testFile.txt', 'testFile.txt')
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);

                    done();
                });
        });

        it('should fail to upload file with missing "path" field', (done) => {
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
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
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

    context('move file use cases', () => {
        it('should move a file successfully', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                                "oldPath": "/testFile.txt",
                                "newPath": "/testFolder/testFile.txt"
                            }
                            // attempt to move file
                            chai.request(server)
                            .put('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(204);

                                // get file array
                                chai.request(server)
                                .get('/api/file')
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('success').eql(true);
                                    res.body.should.have.property('files').with.lengthOf(1);
                                    res.body.files[0].should.have.property('path').eql('/testFolder/testFile.txt');

                                    done();
                                });
                            });
                        });
                });
        });

        it('should fail to move file with missing "oldPath" parameter', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                                "newPath": "/testFolder/testFile.txt"
                            }
                            // attempt to move file
                            chai.request(server)
                            .put('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(400);

                                done();
                            });
                        });
                });
        });

        it('should fail to move file that does not exist', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                                "oldPath": "/wrongPath/testFile.txt",
                                "newPath": "/testFolder/testFile.txt"
                            }
                            // attempt to move file
                            chai.request(server)
                            .put('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(404);

                                done();
                            });
                        });
                });
        });
    });

    context('rename file use cases', () => {
        it('should rename a file successfully', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                                "oldPath": "/testFile.txt",
                                "newName": "testFileRenamed.txt"
                            }
                            // attempt to move file
                            chai.request(server)
                            .put('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(204);

                                // get file array
                                chai.request(server)
                                .get('/api/file')
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('success').eql(true);
                                    res.body.should.have.property('files').with.lengthOf(1);
                                    res.body.files[0].should.have.property('filename').eql('testFileRenamed.txt');

                                    done();
                                });
                            });
                        });
                });
        });

        it('should fail to rename file with missing "oldPath" parameter', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                                "newName": "testFileRenamed.txt"
                            }
                            // attempt to move file
                            chai.request(server)
                            .put('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(400);

                                done();
                            });
                        });
                });
        });

        it('should fail to rename file that does not exist', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                                "oldPath": "/wrongPath/testFile.txt",
                                "newName": "testFileRenamed.txt"
                            }
                            // attempt to move file
                            chai.request(server)
                            .put('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(404);

                                done();
                            });
                        });
                });
        });
    });

    context('favourite file use cases', () => {
        it('should favourite a file successfully', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                                "oldPath": "/testFile.txt",
                                "favourite": true
                            }
                            // attempt to favourite file
                            chai.request(server)
                            .put('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(204);

                                // get file array
                                chai.request(server)
                                .get('/api/file')
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('success').eql(true);
                                    res.body.should.have.property('files').with.lengthOf(1);
                                    res.body.files[0].should.have.property('favourite').eql(true);

                                    done();
                                });
                            });
                        });
                });
        });

        it('should fail to favourite file with missing "oldPath" parameter', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                                "favourite": true
                            }
                            // attempt to favourite file
                            chai.request(server)
                            .put('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(400);

                                done();
                            });
                        });
                });
        });

        it('should fail to favourite file that does not exist', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                                "oldPath": "/wrongPath/testFile.txt",
                                "favourite": true
                            }
                            // attempt to favourite file
                            chai.request(server)
                            .put('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(404);

                                done();
                            });
                        });
                });
        });
    });

    context('delete file use cases', () => {
        it('should delete a file successfully', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                                "path": "/testFile.txt"
                            }
                            // attempt to delete file
                            chai.request(server)
                            .delete('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(200);

                                // get file array
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
        });

        it('should fail to delete file with missing "path" parameter', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                            }
                            // attempt to delete file
                            chai.request(server)
                            .delete('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(400);

                                done();
                            });
                        });
                });
        });

        it('should fail to delete file that does not exist', (done) => {
            // upload file
            chai.request(server)
                .post('/api/file/upload')
                .field('passcode', 'passcode')
                .field('path', '/testFile.txt')
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

                            // construct body
                            const body = {
                                "path": "/wrongPath/testFile.txt"
                            }
                            // attempt to delete file
                            chai.request(server)
                            .delete('/api/file/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(404);

                                done();
                            });
                        });
                });
        });
    });
});
