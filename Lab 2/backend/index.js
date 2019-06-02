var express = require('express');
var app =express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var router=require("./routes/routes");
var course=require("./routes/courses");
var mysql = require('mysql');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const util = require('util');
const saltRounds = 10;
//passport auth
var morgan = require('morgan');
var passport = require('passport');
var jwt = require('jsonwebtoken');

var kafka = require('./kafka/client');

var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
//Set up default mongoose connection
var mongoDB = 'mongodb+srv://canvasUser:189293Kp@canvascluster-wpxt5.mongodb.net/canvas?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true });

var {userModel}=require("./models/models");

require('./config/passport')(passport);
app.use(fileUpload());


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_canvas',
    resave              : true, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

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

app.use("/courses",course);

//login implemented using async await 

 app.post('/login',function(req,res){

  kafka.make_request('login',req.body, function(err,results){
    console.log('in result');
    console.log(results);
    if (err){
        console.log("Inside err");
        res.json({
            status:"error",
            message:"System Error, Try Again."
        });
        res.end();
    }else{
        console.log("Inside else");
        if(results.id){
        res.cookie('cookie',JSON.stringify({email:results.id,role:results.role,token: results.token}),{maxAge: 900000000, httpOnly: false, path : '/'});
        req.session.user = results.id;
        }
        res.status(200).json(results);
        } 
});
  
});

app.post('/signup',function(req,res){

    kafka.make_request('signup',req.body, function(err,results){
      console.log('in result');
      console.log(results);
      if (err){
          console.log("Inside err");
          res.json({
              status:"error",
              msg:"System Error, Try Again."
          });
          res.end();
      }else{
          console.log("Inside else");
          res.status(200).json(results);
          } 
    });
});
module.exports = app;
app.listen(3001,function(){
console.log("Server Listening on port 3001");
});