//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: false }));

//use express session to maintain session data
// app.use(session({
//     secret              : 'cmpe273_kafka_passport_mongo',
//     resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
//     saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
//     duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
//     activeDuration      :  5 * 60 * 1000
// }));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));


//Allow Access Control
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.header('Cache-Control', 'no-cache');
    next();
  });
  app.use(bodyParser.json());

app.post("/add",function(req,res){
    let {num1,num2}=req.body;
    let result =num1+num2;
    console.log(`The result of ${num1} + ${num2} = ${result}`);
    res.status=200;
   res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({result}));
});
app.post("/subtract",function(req,res){
    let {num1,num2}=req.body;
    let result =num1-num2;
    console.log(`The result of ${num1} - ${num2} = ${result}`);
    res.status=200;
   res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({result}));
});
app.post("/multiply",function(req,res){
    let {num1,num2}=req.body;
    let result =num1*num2;
    console.log(`The result of ${num1} * ${num2} = ${result}`);
    res.status=200;
   res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({result}));
});
app.post("/divide",function(req,res){
    let {num1,num2}=req.body;
    let result =num1/num2;
    console.log(`The result of ${num1} / ${num2} = ${result}`);
    res.status=200;
   res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({result}));
});

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");