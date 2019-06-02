var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
//Set up default mongoose connection
var mongoDB = '';
mongoose.connect(mongoDB, { useNewUrlParser: true });
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: "",
  secretAccessKey: ""
});
var {userModel,courseModel}=require("../models/models");

var mutators=require("../services/mutators");
let {cidMutator,allidMutator,idMutator}=mutators;

async function handle_request_getallcourses(msg, callback){
  try {
        let {role,email:_id}=msg;
        let result=await userModel.findOne({_id}).populate({path:'courses',populate:{path:"uid",select:"name"}}).exec();
        let courses=result.courses.map((data)=>{
          let obj= cidMutator(data);
          obj.status="Enrolled";
          obj.name=obj.uid.name;
          return obj;
        })
        let resultwaitlist=await userModel.findOne({_id}).populate({path:'waitlistcourses',populate:{path:"uid",select:"name"}}).exec();
        let waitlistcourses=resultwaitlist.waitlistcourses.map((data)=>{
            let obj= cidMutator(data);
          obj.status="Waitlisted";
          obj.name=obj.uid.name;
          return obj;
        })
        courses=courses.concat(waitlistcourses);
      callback(null,courses);
  } catch (error) {
        callback(error,null);
}
}


module.exports = {
  getallcourses:{handle_request:handle_request_getallcourses}
};