var express = require('express');
var app = express(); // create an app

/******************************************************************/ 
/* Configurations */
/******************************************************************/ 
// enable CORS (For testing purposes only)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Rquested-With, Content-Type, Accept");
    next();
});

//  Configure body parser to read request payload.

var bparser = require('body-parser');
app.use(bparser.json());

//render html using ejs

var ejs= require('ejs');
app.set('views', __dirname + '/public')
app.engine('html', ejs.renderFile)
app.set('view engine', ejs)

//to server static files (css, js, images etc...)
app.use(express.static(__dirname + '/public'))

/******************************************************************/ 
/* Web Server Endpoints */
/******************************************************************/ 

app.get('/', (req, res) => {
    res.render("index.html"); //Can add index.html files and so on
});

app.get('/admin', (req, res) => { 
    res.render("admin.html")
});

app.get('/about', (req, res) => { 
    res.render("about.html")
});

app.get('/contact', (req, res) => { 
    res.render("contact.html")
});




/******************************************************************/ 
/* Rest API Endpoints */
/******************************************************************/ 

var db = [];
var lastId = 1;


app.post('/api/items', (req, res) => {
    var item = req.body;
    // asign a unique ID
    item.id = lastId;
    lastId += 1;
    // save item
    db.push(item);

    res.status(201); // 201 Created
    res.json(item);

});

app.get('/api/items', (req, res) => {
    console.log('Client wants the DB');
    res.json(db);
});

//  run the server
// localhost => 127.0.0.1
// CORS => Cross Origin Resource Sharing
app.listen(8080, function(){
    console.log('Server running on http://localhost:8080');
});