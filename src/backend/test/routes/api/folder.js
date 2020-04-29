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
            const query = {
                "email": "testUser@mail.com"
            }
            User.deleteOne(query, () => {
                done();
            });
        });
    });
    // after class
    after((done) => {
        rimraf('./public/johndoe@mail.com', () => {
            rimraf('./public/testUser@mail.com', () => {
                Folder.deleteMany({}, () => {
                    User.deleteMany({}, () => {
                        done();
                    });
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

    context('get user folders use cases', () => {
        it('should return an array of user\'s folders', (done) => {
            // create body
            const body = {
                "folderName": "testFolder",
                "path": "/testfolder"
            }
            // upload folder
            chai.request(server)
                .post('/api/folder/create')
                .set('Authorization', token)
                .send(body)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            done();
                        });
                });
        });

        it('should return an empty array', (done) => {
            // attempt to get folder array
            chai.request(server)
                .get('/api/folder')
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('folders').with.lengthOf(0);

                    done();
                });
        });
    });

    context('move folder use cases', () => {
        it('should move a folder successfully', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "oldPath": "/testFolder",
                                "newPath": "/newFolder/testFolder"
                            }
                            // attempt to move folder
                            chai.request(server)
                            .put('/api/folder/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(204);

                                // get folder array
                                chai.request(server)
                                .get('/api/folder')
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('success').eql(true);
                                    res.body.should.have.property('folders').with.lengthOf(1);
                                    res.body.folders[0].should.have.property('path').eql('/newFolder/testFolder');

                                    done();
                                });
                            });
                        });
                });
        });

        it('should fail to move folder with missing "oldPath" parameter', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "newPath": "/newFolder/testFolder"
                            }
                            // attempt to move folder
                            chai.request(server)
                            .put('/api/folder/{id}')
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

        it('should fail to move folder that does not exist', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "oldPath": "/wrongFolder/testFolder",
                                "newPath": "/newFolder/testFolder"
                            }
                            // attempt to move folder
                            chai.request(server)
                            .put('/api/folder/{id}')
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

    context('move folder use cases', () => {
        it('should rename a folder successfully', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "oldPath": "/testFolder",
                                "newName": "testFolderRenamed"
                            }
                            // attempt to rename folder
                            chai.request(server)
                            .put('/api/folder/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(204);

                                // get folder array
                                chai.request(server)
                                .get('/api/folder')
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('success').eql(true);
                                    res.body.should.have.property('folders').with.lengthOf(1);
                                    res.body.folders[0].should.have.property('path').eql('/testFolderRenamed');
                                    res.body.folders[0].should.have.property('folderName').eql('testFolderRenamed');

                                    done();
                                });
                            });
                        });
                });
        });

        it('should fail to rename folder with missing "oldPath" parameter', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "newName": "testFolderRenamed"
                            }
                            // attempt to rename folder
                            chai.request(server)
                            .put('/api/folder/{id}')
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

        it('should fail to rename folder that does not exist', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "oldPath": "/wrongFolder/testFolder",
                                "newName": "testFolderRenamed"
                            }
                            // attempt to rename folder
                            chai.request(server)
                            .put('/api/folder/{id}')
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

    context('favourite folder use cases', () => {
        it('should favourite a folder successfully', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "oldPath": "/testFolder",
                                "favourite": true
                            }
                            // attempt to favourite folder
                            chai.request(server)
                            .put('/api/folder/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(204);

                                // get file array
                                chai.request(server)
                                .get('/api/folder')
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('success').eql(true);
                                    res.body.should.have.property('folders').with.lengthOf(1);
                                    res.body.folders[0].should.have.property('favourite').eql(true);

                                    done();
                                });
                            });
                        });
                });
        });

        it('should fail to favourite folder with missing "oldPath" parameter', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "favourite": true
                            }
                            // attempt to favourtite file
                            chai.request(server)
                            .put('/api/folder/{id}')
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

        it('should fail to favourite folder that does not exist', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "oldPath": "/wrongFolder/testFolder",
                                "favourite": true
                            }
                            // attempt to favourite file
                            chai.request(server)
                            .put('/api/folder/{id}')
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

    context('delete folder use cases', () => {
        it('should delete a folder successfully', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "path": "/testFolder"
                            }
                            // attempt to delete folder
                            chai.request(server)
                            .delete('/api/folder/{id}')
                            .query('id', res.body.id)
                            .set('Authorization', token)
                            .send(body)
                            .end((err, res) => {
                                res.should.have.status(200);

                                // get folder array
                                chai.request(server)
                                .get('/api/folder')
                                .set('Authorization', token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('success').eql(true);
                                    res.body.should.have.property('folders').with.lengthOf(0);

                                    done();
                                });
                            });
                        });
                });
        });

        it('should fail to delete folder with missing "path" parameter', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                            }
                            // attempt to delete file
                            chai.request(server)
                            .delete('/api/folder/{id}')
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

        it('should fail to delete folder that does not exist', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "path": "/wrongFolder/testFolder"
                            }
                            // attempt to delete file
                            chai.request(server)
                            .delete('/api/folder/{id}')
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

    context('share folder use cases', () => {
        it('should share a folder successfully', (done) => {
            // create user
            const user = {
                "firstname": "John",
                "surname": "Doe",
                "email": "testUser@mail.com",
                "password": "password"
            }
            chai.request(server)
                .post('/api/user/register')
                .send(user)
                .end((err, res) => {
                    const authBody = {
                        "email": "testUser@mail.com",
                        "password": "password"
                    }
                    // authenticate user
                    chai.request(server)
                        .post('/api/user/authenticate')
                        .send(authBody)
                        .end((err, res) => {
                            const secondAuth = res.body.token;

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
                                    
                                    // get folder array
                                    chai.request(server)
                                        .get('/api/folder')
                                        .set('Authorization', token)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body.should.be.a('object');
                                            res.body.should.have.property('success').eql(true);
                                            res.body.should.have.property('folders').with.lengthOf(1);

                                            // construct body
                                            const body = {
                                                "path": "/testFolder",
                                                "user": "testUser@mail.com"
                                            }
                                            // attempt to share folder
                                            chai.request(server)
                                            .put('/api/folder/{id}/share')
                                            .query('id', res.body.id)
                                            .set('Authorization', token)
                                            .send(body)
                                            .end((err, res) => {
                                                res.should.have.status(204);

                                                // get folder array as second user
                                                chai.request(server)
                                                .get('/api/folder')
                                                .set('Authorization', secondAuth)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    res.body.should.be.a('object');
                                                    res.body.should.have.property('success').eql(true);
                                                    res.body.should.have.property('sharedFolders').with.lengthOf(1);

                                                    done();
                                                });
                                            });
                                        });
                                });
                        });
                });
        });

        it('should fail to share a folder with missing "path" param', (done) => {
            // create user
            const user = {
                "firstname": "John",
                "surname": "Doe",
                "email": "testUser@mail.com",
                "password": "password"
            }
            chai.request(server)
                .post('/api/user/register')
                .send(user)
                .end((err, res) => {
                    const authBody = {
                        "email": "testUser@mail.com",
                        "password": "password"
                    }
                    // authenticate user
                    chai.request(server)
                        .post('/api/user/authenticate')
                        .send(authBody)
                        .end((err, res) => {
                            const secondAuth = res.body.token;

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
                                    
                                    // get folder array
                                    chai.request(server)
                                        .get('/api/folder')
                                        .set('Authorization', token)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body.should.be.a('object');
                                            res.body.should.have.property('success').eql(true);
                                            res.body.should.have.property('folders').with.lengthOf(1);

                                            // construct body
                                            const body = {
                                                "user": "testUser@mail.com"
                                            }
                                            // attempt to share folder
                                            chai.request(server)
                                            .put('/api/folder/{id}/share')
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
                });
        });

        it('should fail to share a folder with missing "user" param', (done) => {
            // create user
            const user = {
                "firstname": "John",
                "surname": "Doe",
                "email": "testUser@mail.com",
                "password": "password"
            }
            chai.request(server)
                .post('/api/user/register')
                .send(user)
                .end((err, res) => {
                    const authBody = {
                        "email": "testUser@mail.com",
                        "password": "password"
                    }
                    // authenticate user
                    chai.request(server)
                        .post('/api/user/authenticate')
                        .send(authBody)
                        .end((err, res) => {
                            const secondAuth = res.body.token;

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
                                    
                                    // get folder array
                                    chai.request(server)
                                        .get('/api/folder')
                                        .set('Authorization', token)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body.should.be.a('object');
                                            res.body.should.have.property('success').eql(true);
                                            res.body.should.have.property('folders').with.lengthOf(1);

                                            // construct body
                                            const body = {
                                                "path": "/testFolder"
                                            }
                                            // attempt to share folder
                                            chai.request(server)
                                            .put('/api/folder/{id}/share')
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
                });
        });

        it('should fail to share a folder with an invalid user', (done) => {
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
                    
                    // get folder array
                    chai.request(server)
                        .get('/api/folder')
                        .set('Authorization', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.should.have.property('folders').with.lengthOf(1);

                            // construct body
                            const body = {
                                "path": "/testFolder",
                                "user": "testUser@mail.com"
                            }
                            // attempt to share folder
                            chai.request(server)
                            .put('/api/folder/{id}/share')
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