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
const graphqlHTTP = require('express-graphql');

const schema = require('./schema/schema');


var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
//Set up default mongoose connection
var mongoDB = 'mongodb+srv://canvasUser:189293Kp@canvascluster-wpxt5.mongodb.net/canvas?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true });

var {userModel}=require("./models/models");
// var requireAuth = passport.authenticate('jwt', {session: false});
// app.use(upload.single()); 
// const formData = require("express-form-data");
// const os = require("os");

// const options = {
//   uploadDir: os.tmpdir(),
//   autoClean: true
// };
// app.use(formData.parse(options));

require('./config/passport')(passport);
app.use(fileUpload());

//mysql connection settings 
// var con = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     password: "admin",
//     database:"canvasdata"
//   });
  
  // con.connect(function(err) {
  //   if (err) throw err;
  //   console.log("MySQl Connected!");
  // });
  

//   var pool  = mysql.createPool({
//     connectionLimit:101,
//     port     :"3306",
//     host     : 'localhost',
//     user     : 'root',
//     password : 'admin',
//     database : 'canvasdata'
// });
//promisifying the sql connection queries using util.promisify

// const query = util.promisify(con.query).bind(con);


// self implementation of promisifying sql queries 

//with connection pooling
// const query=function(que){
//   return new Promise((resolve,reject)=>{

//     pool.query(que,(err,res)=>{
//           if(err){
//             reject(err);
//           }else{
//             resolve(res);
//           }
//         });
//   });
// }
//without connection pooling 
// const query=function(que){
//   return new Promise((resolve,reject)=>{
//         con.query(que,(err,res)=>{
//           if(err){
//             reject(err);
//           }else{
//             resolve(res);
//           }
//         });
//   });
// }
  

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_canvas',
    resave              : true, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
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

app.use("/graphql",(req, res) => {
  return graphqlHTTP({
    schema,
    graphiql: true, 
    context: { req, res },
  })(req, res);
});



 app.post('/login',function(req,res){
    (async function(){

      let loginSuccess=0;
      // var sql=`SELECT * FROM Users WHERE email=${mysql.escape(req.body.email)}`;
     // console.log(sql);
      try {
        let{email,password}=req.body; 
        //const result=await query(sql);
        let result=await userModel.findOne({email});
        let data=null;
        if(!result){
          data={
            loginSuccess:0,
            message:"Email or Password Incorrect"
          };
        }else{
          const match = await bcrypt.compare(password, result.password);
          if(match){
            var user = {
              email: result.email
          };
          var token = jwt.sign(user, "There is no substitute for hardwork", {
            expiresIn: 10080 // in seconds
        });
            data={
              loginSuccess:1,
              message:"Login Successfull!",
              token: 'JWT ' + token
            };
            console.log(result);
            console.log(result._id);
            res.cookie('cookie',JSON.stringify({email:result._id,role:result.role,token: 'JWT ' + token}),{maxAge: 900000000, httpOnly: false, path : '/'});
            req.session.user = result._id;
          }else{
            data={
              loginSuccess:0,
              message:"Email or Password Incorrect"
            };
          }
        }
       res.status(200).json(data);
      } catch (error) {
        res.writeHead(400,{
          'Content-Type':'text/plain'
       });
       console.log(error);
       res.end(error.toString());
      }
    })();
   

   

    
});

app.post('/signup',function(req,res){
  let{email,password,firstName,lastName,role}=req.body; 
  (async()=>{
    try {
          let responseOne=await userModel.findOne({email});
        if(responseOne){
            var body={
                      message:"Signup failed! Email already exists",
                      insertStatus:0
                    };
            res.status(200).json(body);
        }else{
            let hash=await bcrypt.hash(password, saltRounds);
            var user=new userModel({email,password:hash,firstName,lastName,role});
            let response=await user.save();
            console.log("user saved");
            console.log(response);
            var body={
              message:"Sign up successfull. Redirecting to Login Page...",
              insertStatus:1
            };
            res.status(200).json(body);
        } 
    } catch (error) {
      res.writeHead(400,{
        'Content-Type':'text/plain'
     });
     res.end(err.toString());
      console.log(error);
    }
  })();
});
module.exports = app;
app.listen(3001,function(){
console.log("Server Listening on port 3001");
});