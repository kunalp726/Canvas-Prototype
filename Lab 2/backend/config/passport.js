'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var mongoose = require('mongoose');
var kafka = require('../kafka/client');
mongoose.Promise=global.Promise;
//Set up default mongoose connection
var mongoDB = 'mongodb+srv://canvasUser:189293Kp@canvascluster-wpxt5.mongodb.net/canvas?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var {userModel}=require("../models/models");
// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: "There is no substitute for hardwork"
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {
        kafka.make_request('requireauth',jwt_payload, function(err,result){
            console.log('in result');
            console.log(result);
            if (err){
                return callback("Username or password invalid", false);
            }else{
                var user = {email:result.email};
                callback(null, user);
                } 
        });
  
        
        console.log("requiring auth");
        console.log(jwt_payload);
      
    }));
};
