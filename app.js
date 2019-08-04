var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

var databaseConnection = require('./database');
let _db = undefined;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hello World!")
});

//fetching all users
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM Users';
    _db.manyOrNone(query)
        .then(function (data) {
            // success;
            res.status(200).json(data);
        })
        .catch(function (error) {
            // error;
            // console.log(error);
            res.status(500);
            res.end('Error accessing DB: ' + JSON.stringify(error));
        });
});
app.post('/user/create', (req, res) => {
    let user = req.body;
    console.log("Inserting into the DB");
    _db.one({
        name: 'insert-user',
        text: 'INSERT INTO Users(firstname,lastname,location) values($1,$2,$3) RETURNING *',
        values: [user.firstname, user.lastname, user.location]
    })
        .then(data => {
            res.status(201).json(data);
        })
        .catch(error => {
            res.status(500);
            res.end('Error accessing DB: ' + JSON.stringify(error));
        });
});


const callback = (error, db) => {
    if (error !== null) {
        log('error when fetching the DB connection ' + JSON.stringify(error));
        return;
    }
    _db = db;
}
app.listen(port, function () {
    console.log('Listening on port %d', port);
    databaseConnection.getDB(callback)
});