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

//DB connection with mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var mongoDB = mongoose.connection;
var itemDB; //constructor for db obj
var orderDB; // constructor for order db

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


var lastId = 1;


app.post('/api/items', (req, res) => {


    //create db obj
    var itemForMongo = itemDB(req.body);

    //enforece rules and validation here. if doesnt meet the requirments send back error
    //save obj
    itemForMongo.save(function(error, savedItem){

        if(error){
            console.log('error daving item: '+ error);
            res.status(500); //means internal error server
            res.send(error);
        }

        //no error
        res.status(201); //201 means created
        res.json(savedItem);
    });
    //wait for response



});

app.get('/api/items', (req, res) => {
    itemDB.find({}, function(error, data){
        if(error){
            res.status(500)
            res.send(error);
        }

        //no error
        res.json(data);
    });
});

app.get('/api/items/:user', (req,res)=>{
    let name= req.params.user;
    
    itemDB.find({ user:name }, function(error, data){
        if(error){
            res.status(500)
            res.send(error);
        }

        //no error
        res.json(data);
    });

});

app.get('/api/items/search/:text', (req, res) => {
    var text = req.params.text;
    itemDB.find(
        {
            $or: [
                { title: { "$regex": text, "$options": "i" } },
                { description: text }
            ]
        }
        , function (error, data) {
            if (error) {
                res.status(500);
                res.send(error);
            }

            // no error
            res.json(data);
        });
}); 

mongoDB.on('error', function(error){
    console.log('db connection error: '+ error)
});

mongoDB.on('open', function(){
    console.log('yeah, db connection open');

    //define schema for db collection
    /* The allowed SchemaTypes are:
      String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array
    */ 
    var itemSchema= mongoose.Schema({
        code: String,
        title: String,
        price: Number,
        description: String,
        category: String,
        image: String,
        user: String
    });

    //define order shema
    var orderSchema= mongoose.Schema({
        user:String,
        total:Number,
        status:Number,
        items:Array
    });

    itemDB = mongoose.model("catCohort8", itemSchema);
    orderDB = mongoose.model('ordersCohort8', orderSchema)

});

//  run the server
// localhost => 127.0.0.1
// CORS => Cross Origin Resource Sharing
app.listen(8080, function(){
    console.log('Server running on http://localhost:8080');
});

