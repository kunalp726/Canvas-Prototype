var bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
//Set up default mongoose connection
var mongoDB = 'mongodb+srv://canvasUser:189293Kp@canvascluster-wpxt5.mongodb.net/canvas?retryWrites=true';

mongoose.connect(mongoDB, { poolSize:10,useNewUrlParser: true });

var {userModel}=require("../models/models");

async function handle_request_requireauth(jwt_payload, callback){
  try {
    let{email}=jwt_payload; 
    //const result=await query(sql);
    let result=await userModel.findOne({email});
    if(!result){
      callback("Username or password invalid", false);
    }else{
      var user = {email:result.email};
      console.log("User Verified");
      callback(null, user);
     }
    } catch (error) {
         callback("Username or password invalid", false);
    }
}
async function handle_request_signup(msg, callback){
  try {
    let{email,password,name,role}=msg; 
    email=email.toLowerCase();
    console.log(email+" <===email")
        let responseOne=await userModel.findOne({email});
      if(responseOne){
          var body={
                    message:"Signup failed! Email already exists",
                    insertStatus:0
                  };
        //  res.status(200).json(body);
        callback(null,body)
      }else{
          let hash=await bcrypt.hash(password, saltRounds);
          var user=new userModel({email,password:hash,name,role});
          let response=await user.save();
          console.log("user saved");
          console.log(response);
          var body={
            message:"Sign up successfull. Redirecting to Login Page...",
            insertStatus:1
          };
         // res.status(200).json(body);
         callback(null,body)
      } 
  } catch (error) {
    callback(error,null);
  }
}
async function handle_request_signin(msg, callback){
    let req={
        body:msg
    }
        let loginSuccess=0;
        try {
          let{email,password}=req.body; 
          email=email.toLowerCase();
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
                  id:result._id,
                  role:result.role,
                loginSuccess:1,
                message:"Login Successfull!",
                token: 'JWT ' + token
              };
              console.log(result);
              console.log(result._id);
            }else{
              data={
                loginSuccess:0,
                message:"Email or Password Incorrect"
              };
            }
          }
          callback(null,data)
        } catch (error) {
         callback(error,null);
        }
}

module.exports = {
  signin:{handle_request:handle_request_signin},
  requireauth:{handle_request:handle_request_requireauth},
  signup:{handle_request:handle_request_signup}
};