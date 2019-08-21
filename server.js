var http = require('http');
var express = require('express'); //require express
var app = express(); //create express app

/****************************************/
/************Configuration***************/
/*****************************************/

//enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//read req body as object

var bparser = require("body-parser");
app.use(bparser.json());

//To server HTML, CSS, JS from this server
app.use(express.static(__dirname + '/views'));
var ejs = require('ejs');
app.set('views', __dirname + '/views'); //where are the html files?
app.engine('html', ejs.renderFile);
app.set('view engine', ejs);

//MONGO & Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', {});
//DB Connection
var db = mongoose.connection;
//DB object constructor
var ItemDB;

/*********************************************/
/*         Storage options                   */
/*********************************************/
var items = [];
var nextId = 0;

app.get('/', (req, res) => {
    res.send("This is root page");
});

app.get('/admin', (req, res) => {
    res.render('admin.html');
});


app.get('/contact', (req, res) => {
    res.send("This is the contact page");
});

app.get('/about', (req, res) => {
    res.render('about.html');
});

app.get('/api/products', (req, res) => {
    ItemDB.find({}, function(error, data){
        if(error){
            console.log("Error reading data", error);
            res.status(500);
            res.send(error);
        };
        res.json(data);
    });
});
/**
 * **
 * Endpoints for REST functionality
 * REST stands for Representational state transfer
 */
app.get('/api/products/:user', (req, res) => {
    ItemDB.find({user: req.params.user}, function (error, data){
        if (error){
            console.log("Error reading data", error);
            res.status(500);
            res.send(error);
        };
        res.json(data);
    });
});

app.post('/api/products', (req, res) => {

    console.log("Client wants to save items");
    //get the object and assign an id
    var item = new ItemDB(req.body);

    //store the object on DB
    item.save(function (error, savedItem) {
        if (error) {
            console.log("Error, item was not saved on Mongo", error);
            res.status(500);
            res.send(error);
        };
        console.log("item saved correctly!!");
        //send the object back as a json
        res.status = 201;
        res.json(savedItem);
    });
});

app.get('/about', (req, res) => {
    res.render('about.html');
});
app.listen(8080, () => {
    console.log('server running at http://localhost:8080');
});

//Listen to DB connection events
db.on('error', function (error) {
    console.log("Error connection to Mongo server", error);
});
db.on('open', function () {
    console.log("Yay DB is alive!");
    var itemSchema = mongoose.Schema({
        title: String,
        description: String,
        price: Number,
        image: String,
        catagory: String,
        user: String
    });
    ItemDB = mongoose.model("itemsCh4", itemSchema);
});