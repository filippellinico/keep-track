const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const router = require("../routes/books-route");
const sqlite3 = require('sqlite3').verbose();
const assert = require('assert');
const db = new sqlite3.Database(':memory:');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

const book = {
    title: 'first book',
    author: 'me',
    pubDate: 'today',
    rating: 1
};

describe('Books POST /create', function() {
    it('creates book', function(done) {
        request(app)
            .post("/create")
            .send(book)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                assert.strictEqual(response.body.message,"Book 'first book' by me created.");
                done();
            })
            .catch(err => done(err));
    });
});

describe('Books GET /all', function() {
    it('responds 200 with json', function(done) {
        request(app)
            .get('/all')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                assert.deepStrictEqual(response.body,[{...book, id:1}]);
                done();
            })
            .catch(err => done(err));
    });
});

