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
                .attach('file', './backend/test/resources/api/file/testFile.txt', 'testFile.txt')
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);

                    done();
                });
        });
    });
});
