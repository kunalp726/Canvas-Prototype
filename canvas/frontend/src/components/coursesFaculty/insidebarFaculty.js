import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
import AppRoute from "../../AppRoute";
import CourseHomeFaculty from "./courseHomeFaculty";
import Announcements from "./announcements";
import Assignments from "./assignments";
import Grades from "./grades";
import People from "./people";
import Quiz from "./quiz";
import Files from "./files";
import Permissioncode from "./permissionCode";
import Profile from "./profile";

class InsidebarFaculty extends Component{
    constructor(props){
       
      super(props)
      let email=null;
      if(cookie.load("cookie")){
        email=cookie.load("cookie").email;
      }
      const {courseid}=props.match.params;
      // let courseDepartment=courseid.replace(/[0-9]/g,'');
      // let courseId=courseid.replace(/[^0-9]/g,'');

      const dataObj={
        email,
        courseDepartment:"",
        courseId:"",
        cid:courseid
      }

      this.state={
        dataObj
      };
      console.log(JSON.stringify(this.state));
    }

    async componentDidMount(){
      try {
        let result=await axios.get(rootUrl+"/courses/getcourse/"+this.state.dataObj.cid);
        if(result.status===200){
          let {courseDepartment,courseId,courseName,courseTerm}=result.data[0];
          this.setState({
            courseDepartment,
            courseId,
            courseName,
            courseTerm,
            dataObj:{...this.state.dataObj,courseId,courseDepartment,courseName,courseTerm}
          });
        }
      } catch (error) {
          throw error;
      }
    }
    async componentWillReceiveProps(newProps){
    
      try {
       let result=await axios.get(rootUrl+"/courses/getcourse/"+ newProps.match.params.courseid);
       if(result.status===200){
         let {courseDepartment,courseId,courseName,courseTerm}=result.data[0];
         this.setState({
           courseDepartment,
           courseId,
           courseName,
           courseTerm,
           dataObj:{...this.state.dataObj,courseId,courseDepartment,courseName,courseTerm,cid:newProps.match.params.courseid}
         });
       }
     } catch (error) {
         throw error;
     }
     }
    render(){
        let redirectVar=null;
        let pathname=window.location.pathname.split("/").pop();
        if(!isNaN(parseInt(pathname))){
          pathname="home"
        }
        console.log(cookie.load("cookie"));
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="ml90">
            <div className="inside-header">
            <h2>{this.state.courseDepartment} - {this.state.courseId} {this.state.courseName} <span><span>></span> {pathname}</span> </h2>
            </div>
            <ul className="inside-bar">
            <div className="course-term">{this.state.courseTerm}</div>
            <li className={pathname==="home"?"active":""}><Link to={`${this.props.match.url}`}>Home</Link>
              </li>
                <li className={pathname==="announcements"?"active":""}><Link to={`${this.props.match.url}/announcements`}>Announcements</Link>
              </li>
              <li className={pathname==="assignments"?"active":""}>
                <Link to={`${this.props.match.url}/assignments`}>Assignments</Link>
              </li>
              {/* <li>
                <Link to={`${this.props.match.url}/grades`}>Grade</Link>
              </li> */}
              <li className={pathname==="quiz"?"active":""}>
                <Link to={`${this.props.match.url}/quiz`}>Quiz</Link>
              </li>
              <li className={pathname==="people"?"active":""}>  
                <Link to={`${this.props.match.url}/people`}>People</Link>
              </li>
              <li className={pathname==="files"?"active":""}>
                <Link to={`${this.props.match.url}/files`}>Files</Link>
              </li>
              <li className={pathname==="permissioncode"?"active":""}>
                <Link to={`${this.props.match.url}/permissioncode`}>Permission Code</Link>
              </li>
            </ul>
      
            <AppRoute exact path={`${this.props.match.path}`} component={CourseHomeFaculty} />
            <AppRoute path={`${this.props.match.path}/announcements`} renderstyle={1}  cred={this.state.dataObj} component={Announcements} />
            <AppRoute path={`${this.props.match.path}/assignments`} renderstyle={1}  cred={this.state.dataObj} component={Assignments} />
            {/* <AppRoute path={`${this.props.match.path}/grades`} cred={this.state.dataObj} component={Grades} /> */}
            <AppRoute path={`${this.props.match.path}/people`} renderstyle={1}  cred={this.state.dataObj} component={People} />
            <AppRoute path={`${this.props.match.path}/quiz`} renderstyle={1}  cred={this.state.dataObj} component={Quiz} />
            <AppRoute path={`${this.props.match.path}/files`} renderstyle={1}  cred={this.state.dataObj} component={Files} />
            <AppRoute path={`${this.props.match.path}/permissioncode`}  renderstyle={1} cred={this.state.dataObj} component={Permissioncode} />
            <AppRoute path={`${this.props.match.path}/profile/:uid`}  renderstyle={1} cred={this.state.dataObj} component={Profile} />
            {/* <AppRoute
              exact
              path={match.path}
              render={() => <h3>Please select a topic.</h3>}
            /> */}
          </div>
        )
    }
}

export default InsidebarFaculty;