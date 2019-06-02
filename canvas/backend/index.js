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

// app.use(upload.single()); 
// const formData = require("express-form-data");
// const os = require("os");

// const options = {
//   uploadDir: os.tmpdir(),
//   autoClean: true
// };
// app.use(formData.parse(options));


app.use(fileUpload());

//mysql connection settings 
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "admin",
    database:"canvasdata"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("MySQl Connected!");
  });
  

  var pool  = mysql.createPool({
    connectionLimit:101,
    port     :"3306",
    host     : 'localhost',
    user     : 'root',
    password : 'admin',
    database : 'canvasdata'
});
//promisifying the sql connection queries using util.promisify

// const query = util.promisify(con.query).bind(con);


// self implementation of promisifying sql queries 

//with connection pooling
const query=function(que){
  return new Promise((resolve,reject)=>{

    pool.query(que,(err,res)=>{
          if(err){
            reject(err);
          }else{
            resolve(res);
          }
        });
  });
}
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

//login implemented using async await 

 app.post('/login',function(req,res){
    (async function(){

      let loginSuccess=0;
      var sql=`SELECT * FROM Users WHERE email=${mysql.escape(req.body.email)}`;
     // console.log(sql);
      try {
        const result=await query(sql);
        let data=null;
       // console.log(result);
        if(result.length==0){
          data={
            loginSuccess:0,
            message:"Email or Password Incorrect"
          };
        }else{
          const match = await bcrypt.compare(req.body.password, result[0].password);
          if(match){
            data={
              loginSuccess:1,
              message:"Login Successfull!"
            };
            res.cookie('cookie',JSON.stringify({email:result[0].uid,role:result[0].role}),{maxAge: 900000000, httpOnly: false, path : '/'});
            req.session.user = result.uid;
          }else{
            data={
              loginSuccess:0,
              message:"Email or Password Incorrect"
            };
          }
        }
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(data));

      } catch (error) {
        res.writeHead(400,{
          'Content-Type':'text/plain'
       });
       console.log(error);
       res.end(error.toString());
      }
      

    })();
   

   

    
});

//signup implemented using callback functions

app.post('/signup',function(req,res){
    
   let contains=0;
   let sql=`SELECT * FROM Users WHERE email=${mysql.escape(req.body.email)}`;
   con.query(sql,(err,result)=>{
     if(err){
       res.writeHead(400,{
          'Content-Type':'text/plain'
       });
       res.end(err.sqlMessage.toString());
     }else{
     
      let{email,password,name,role}=req.body;
      console.log("outside"+typeof(result)); 
      console.log("outside=>"+JSON.stringify(result)); 
      if(result.length!=0){
        var body={
          message:"Signup failed! Email already exists",
          insertStatus:0
        };
      res.status=200;
       res.setHeader("Content-Type", "application/json");
       res.send(JSON.stringify(body));
      }else{
       console.log("inside"+result);
        //insert into the table 
        bcrypt.hash(password, saltRounds, (err, hash)=> {
          // Store hash in your password DB.
          let sqlInsert=`INSERT INTO Users(name,email,password,role) VALUES (${mysql.escape(name)},${mysql.escape(email)},${mysql.escape(hash)},'${role}')`;
          console.log(sqlInsert);
          con.query(sqlInsert,(err,result)=>{
            if(err){
             
              res.writeHead(400,{
                'Content-Type':'text/plain'
             });
             res.end(err.sqlMessage.toString());
            }else{
              var body={
                message:"Sign up successfull. Redirecting to Login Page...",
                insertStatus:1
              };
              res.status=200;
              res.setHeader("Content-Type", "application/json");
              res.send(JSON.stringify(body));
            }
          });


        });


       

       }
       
     }
   })
  //  users.forEach((data)=>{
  //    if(data.email==req.body.email){
  //      contains=1;
  //    }
  //  });

  //  console.log(req.body.email);

   //replace above code with sql insert query

  

  //  if(!contains){
  //    users.push(req.body);
  //  body.message="Sign up successfull. Redirecting to Login Page...";
  //  body.insertStatus=1;
  //  }else{
  //   body.message="Signup failed! Email already exists";
  //  }
  //  console.log(JSON.stringify(body));
  //  console.log(JSON.stringify(users));
  


    

});
module.exports = app;
app.listen(3001,function(){
console.log("Server Listening on port 3001");
});