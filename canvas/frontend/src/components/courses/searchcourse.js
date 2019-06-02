import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper"
import cookie from 'react-cookies';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {searchcourse} from '../../actions/searchcourseActions';
// import { Link } from 'react-router-dom'
class Searchcourse extends Component {

  constructor(props){
    super(props);
    this.state={
      courseId:0,
      courseName:"",
      courseTerm:"",
      selectedOption:"courseId",
      filterOption:"=",
      searchResult:[],
      courseList:[],
      courseSem:"Spring",
      addCode:0,
      courseYear:new Date().getFullYear().toString()
    }
    this.search=this.search.bind(this);
    this.addCodeEnroll=this.addCodeEnroll.bind(this);
  }

  changeHandlerRadio=(option)=>{
    this.setState({
      selectedOption:option
    });
  }
  changeHandlerCommon=(property,e)=>{
      this.setState({
        [property]:e.target.value
      });
  }
  changeHandlerSelect=(e)=>{
    this.setState({filterOption:e.target.value});
  }

  async load(){
    try{
      let response=await axios.post(rootUrl+"/courses",cookie.load("cookie"));
      if(response.status===200){
              this.setState({
                  courseList:response.data
              });
      }
  }catch(error){
      throw error;
  }
  }

 componentDidMount(){
  this.load();
}
  async search(){
    if(this.state.selectedOption=="CourseId" || this)

    var data={...this.state}
    try{
      await this.setState({
        courseTerm:this.state.courseSem+" "+this.state.courseYear
      });
    let response=await axios.post(rootUrl+"/courses/search",data);
    console.log(response);
      if(response.status===200){
        this.setState({searchResult:response.data});
      }
  }catch(error){

    }
  }

  async enroll(courseId){
    let email=cookie.load("cookie").email;
    try {
      let response=await axios.post(rootUrl+"/courses/enroll",{email:email,courseId:courseId});
      if(response.status===200){
        // this.setState({courseList:response.data});
        alert(response.data.message);
        this.load();
        this.search();
      }
    } catch (error) {
      
    }
  }

  async drop(courseId){
    let email=cookie.load("cookie").email;
    try {
      let response=await axios.post(rootUrl+"/courses/drop",{email:email,courseId:courseId});
      if(response.status===200){
        alert(response.data.message);
        this.load();
        this.search();
      }
    } catch (error) {
      
    }
  }

  async addCodeEnroll(){
    let email=cookie.load("cookie").email;
    try {
      let response=await axios.post(rootUrl+"/courses/addcodeenroll",{email:email,code:this.state.addCode});
      if(response.status===200){
        alert(response.data.message);
        this.load();
        this.search();
      }
    } catch (error) {
      
    }
  }

  render() {
    let tableVar=null;
    if(this.state.searchResult.length){
tableVar=  <thead><tr>
  <td>CourseId</td>
  <td>Course Name</td>
  <td>Course Term</td>
  <td>Course Capacity</td>
  <td>Current Enrollment</td>
  <td>Waitlist Capacity</td>
  <td>Current Waitlist</td>
  <td>Instructor</td>
  <td>Enroll</td>
</tr>
</thead>
    }
    return (
       
       <div className="ml90 search-parent">
       <h2>Search Courses</h2>
       <div className="search-area">
      <div><input checked={"courseId"===this.state.selectedOption} onChange={()=>{this.changeHandlerRadio("courseId")}} type="radio"></input> <input onChange={(e)=>{this.changeHandlerCommon("courseId",e)}} type="number" placeholder="search by ID"></input>
      <select onChange={this.changeHandlerSelect}>
      <option value="=">Exactly equal</option>
      <option value="<">Less Than</option>
      <option value=">">Greater Than</option>
      </select></div>
      <div> <input checked={"courseName"===this.state.selectedOption} onChange={()=>{this.changeHandlerRadio("courseName")}} type="radio"></input> <input onChange={(e)=>{this.changeHandlerCommon("courseName",e)}}  type="text" placeholder="search by Course Name"></input></div>
      <div>
      <input checked={"courseTerm"===this.state.selectedOption} onChange={()=>{this.changeHandlerRadio("courseTerm")}} type="radio"></input> 
      <select onChange={(e)=>{this.changeHandlerCommon("courseSem",e)}}>
      <option value="Spring">Spring</option>
      <option value="Fall">Fall</option>
      </select>

      <select onChange={(e)=>{this.changeHandlerCommon("courseYear",e)}}>
      <option value={new Date().getFullYear().toString()}>{new Date().getFullYear().toString()}</option>
      <option value={(new Date().getFullYear()+1).toString()}>{(new Date().getFullYear()+1).toString()}</option>
      </select>

      </div>
       <button onClick={this.search}>Search</button>
       </div>

      <div>
        <h3>Enroll with Add Code</h3>
        <input type="number" onChange={(e)=>{this.changeHandlerCommon("addCode",e)}}  placeholder="Enter Add Code"></input>
      <button onClick={this.addCodeEnroll}>Enroll</button>
      </div>
      <hr></hr>
        <h3>Search Results</h3>
        <table>
        {tableVar}
          <tbody>
       {this.state.searchResult.map((data,index)=>{
         return( <tr key={index}>
            <td>{data.courseId}</td>
            <td>{data.courseName}</td>
            <td>{data.courseTerm}</td>
            <td>{data.courseCapacity}</td>
            <td>{data.currEnrollment}</td>
            <td>{data.waitlistCapacity}</td>
            <td>{data.currWaitlist}</td>
            <td>{data.name}</td>
            <td><button onClick={()=>{this.enroll(data.cid)}}>Enroll</button></td>
          </tr>)
       })}
       </tbody>
       </table>
       <hr></hr>
<h3>Enrolled Courses</h3>
       <table>
       <thead><tr>
  <td>CourseId</td>
  <td>Course Name</td>
  <td>Course Term</td>
  <td>Course Capacity</td>
  <td>Status</td>
  <td>Instructor</td>
  <td>Drop</td>
</tr>
</thead>
          <tbody>
       {this.state.courseList.map((data,index)=>{
         return( <tr key={index}>
            <td>{data.courseId}</td>
            <td>{data.courseName}</td>
            <td>{data.courseTerm}</td>
            <td>{data.courseCapacity}</td>
            <td>{data.status}</td>
            <td>{data.name}</td>
            <td><button onClick={()=>{this.drop(data.cid)}}>Drop</button></td>
          </tr>)
       })}
       </tbody>
       </table>



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
 onsearchcourse:searchcourse
 },dispatch);
}

export default connect(mapStatetoProps,mapActionToProps)(Searchcourse);

    