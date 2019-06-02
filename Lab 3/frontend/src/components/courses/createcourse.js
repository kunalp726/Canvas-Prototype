import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import cookie from "react-cookies";
import {Redirect} from "react-router";

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createcourse} from '../../actions/createcourseActions';

import { graphql, compose } from 'react-apollo';
import { addCourse } from '../../mutation/mutations';
// import { Link } from 'react-router-dom'
class Createcourse extends Component {
  constructor(props){
    super(props);
    let uid=0;
    if(cookie.load("cookie")){
      uid=cookie.load("cookie").email;
    }
    this.state={
      courseId:"",
      courseName:"",
      courseDepartment:"",
      courseDescription:"",
      courseRoom:"",
      courseCapacity:0,
      waitlistCapacity:0,
      courseTerm:"",
      message:"",
      courseSem:"Spring",
      courseYear:new Date().getFullYear(),
      uid:uid
    }
    this.submit=this.submit.bind(this);
  }
 changeHandler=(property,e)=>{
  this.setState({
    [property]:e.target.value
  })
 }
 async submit(e){
   e.preventDefault();
   let {message,courseSem,courseYear,...rest}=this.state;
   await this.setState({
     courseTerm:courseSem+" "+courseYear
   });
  //  this.props.oncreatecourse(rest)
  let res=await this.props.addCourse({
    variables: {
        ...rest
    },
});
alert("course added successfully!")
this.setState({
  courseId:"",
  courseName:"",
  courseDepartment:"",
  courseDescription:"",
  courseRoom:"",
  courseCapacity:0,
  waitlistCapacity:0,
  courseTerm:"",
  message:"",
  courseSem:"Spring"
})
 }
  render() {

    let redirectVar=null;
    if(!cookie.load("cookie")){
        redirectVar=<Redirect to="/login"/>
    }
    return (
       
       <div className="search-parent">
       <div className="create-parent">
       <h2>Create a Course</h2>
       {redirectVar} 
       <form onSubmit={this.submit}>
         <div> <input required onChange={(e)=>{this.changeHandler("courseId",e)}} type="text" placeholder="Course Id"></input></div>
         <div> <input required onChange={(e)=>{this.changeHandler("courseName",e)}} type="text" placeholder="Course Name"></input></div>
         <div> <input required onChange={(e)=>{this.changeHandler("courseDepartment",e)}} type="text" placeholder="Course Department"></input></div>
         <div> <input required onChange={(e)=>{this.changeHandler("courseDescription",e)}} type="text" placeholder="Course Description"></input></div>
         <div> <input required onChange={(e)=>{this.changeHandler("courseRoom",e)}} type="text" placeholder="Course Room"></input></div>
         <div> <input required onChange={(e)=>{this.changeHandler("courseCapacity",e)}} type="number" placeholder="Course Capacity"></input></div>
         <div> <input required onChange={(e)=>{this.changeHandler("waitlistCapacity",e)}} type="number" placeholder="WaitList Capacity"></input></div>
         {/* <div> <input required onChange={(e)=>{this.changeHandler("courseTerm",e)}} type="text" placeholder="Course Term"></input></div> */}
         <div><select onChange={(e)=>{this.changeHandler("courseSem",e)}}>
           <option value="Spring">Spring</option>
           <option value="Fall">Fall</option>
           </select></div>
           <div><select onChange={(e)=>{this.changeHandler("courseYear",e)}}>
           <option value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</option>
           <option value={(new Date().getFullYear()+1).toString()}>{new Date().getFullYear()+1}</option>
           
           </select></div>
         <input type="submit" value="Create Course"></input>
         </form>
         <div>{this.state.message}</div>
         </div>
       </div>
       
    )
  }
}
const mapStatetoProps=(state,props)=>{
  return{
    ...state,
    ...props
  };
}
const mapActionToProps=(dispatch,props)=>{
 return bindActionCreators({
 oncreatecourse:createcourse
 },dispatch);
}

export default compose(
  graphql(addCourse, { name: "addCourse" })
)(connect(mapStatetoProps,mapActionToProps)(Createcourse));
  