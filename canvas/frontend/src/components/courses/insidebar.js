import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
import AppRoute from "../../AppRoute";
import CourseHome from "./coursehome";
import Announcements from "./announcements";
import Assignments from "./assignments";
import Grades from "./grades";
import People from "./people";
import Quiz from "./quiz";
import Files from "./files";
import Profile from "./profile";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getcourse} from '../../actions/student/insidebarActions';

class Insidebar extends Component{
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
      let dataObj=this.state.dataObj;
      this.props.onGetCourse(dataObj);
    }
    static getDerivedStateFromProps(nextProps, prevState){
    //   if(nextProps.someValue!==prevState.someValue){
    //     return { someState: nextProps.someValue};
    //  } let dataObj=this.state.dataObj;
    // let dataObj=this.state.dataObj;
    //   this.props.onGetCourse(dataObj);
    if(nextProps.match.params.courseid!==prevState.dataObj.cid){
    let dataObj={cid:nextProps.match.params.courseid}
     nextProps.onGetCourse(dataObj);
     console.log(nextProps);
     return {
        dataObj
    }
    }else{
      return null;
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
            <h2>{this.props.studentinsidebar.courseDepartment} - {this.props.studentinsidebar.courseId} {this.props.studentinsidebar.courseName} <span><span>></span> {pathname}</span> </h2>

            </div>
            <ul className="inside-bar">
            <div className="course-term">{this.props.studentinsidebar.courseTerm}</div>
            <li className={pathname==="home"?"active":""}><Link to={`${this.props.match.url}`}>Home</Link>
              </li>
                <li className={pathname==="announcements"?"active":""}><Link to={`${this.props.match.url}/announcements`}>Announcements</Link>
              </li>
              <li className={pathname==="assignments"?"active":""}>
                <Link to={`${this.props.match.url}/assignments`}>Assignments</Link>
              </li>
              <li className={pathname==="grades"?"active":""}>
                <Link to={`${this.props.match.url}/grades`}>Grade</Link>
              </li>
              <li className={pathname==="quiz"?"active":""}>
                <Link to={`${this.props.match.url}/quiz`}>Quiz</Link>
              </li>
              <li className={pathname==="people"?"active":""}>  
                <Link to={`${this.props.match.url}/people`}>People</Link>
              </li>
              <li className={pathname==="files"?"active":""}>
                <Link to={`${this.props.match.url}/files`}>Files</Link>
              </li>
          </ul>
      
            <AppRoute exact path={`${this.props.match.path}`} component={CourseHome} />
            <AppRoute path={`${this.props.match.path}/announcements`} renderstyle={1} cred={this.state.dataObj} component={Announcements} />
            <AppRoute path={`${this.props.match.path}/assignments`} renderstyle={1} cred={this.state.dataObj} component={Assignments} />
            <AppRoute path={`${this.props.match.path}/grades`}  renderstyle={1} cred={this.state.dataObj} component={Grades} />
            <AppRoute path={`${this.props.match.path}/people`}  renderstyle={1} cred={this.state.dataObj} component={People} />
            <AppRoute path={`${this.props.match.path}/quiz`}  renderstyle={1} cred={this.state.dataObj} component={Quiz} />
            <AppRoute path={`${this.props.match.path}/files`} renderstyle={1}  cred={this.state.dataObj} component={Files} />
            <AppRoute path={`${this.props.match.path}/profile/:uid`} renderstyle={1}  cred={this.state.dataObj} component={Profile} />
            {/* <AppRoute
              exact
              path={match.path}
              render={() => <h3>Please select a topic.</h3>}
            /> */}
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
  onGetCourse:getcourse
 },dispatch);
}

export default connect(mapStatetoProps,mapActionToProps)(Insidebar);
