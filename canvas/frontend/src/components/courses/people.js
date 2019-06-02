import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getpeople} from '../../actions/student/peopleActions';

class People extends Component{
    constructor(props){
       
        super(props)

        this.state={
            email:props.cred.email,
            courseId:props.cred.cid,
            courseDepartment:props.cred.courseDepartment,
            announcements:[]
        };
       
    }
async componentDidMount(){
    let {courseId,courseDepartment,email}=this.state;
    const obj={
        courseId,
        courseDepartment,
        email
    }
  this.props.onGetPeople(obj);
}
    render(props){
        let redirectVar=null;
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        } 
        let array=this.props.match.url.split("/")
        array.pop();
        let url=array.join("/");
        url=url+"/profile/"

        return(
            <div className="super-parent">
            <table>
            <thead><tr>
            <td>Name</td>
            <td>Section</td>
            <td>Role</td>
            </tr>
            </thead>
            <tbody>
              {   this.props.studentpeople.announcements.map((data,index)=>{
                 
               return( <tr key={index}>
                <td><Link to={url+data.uid}>{data.name}</Link></td>
                <td>{`${data.courseTerm}:${data.courseDepartment}-${data.courseId}`}</td>
                <td>{data.role}</td>
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
    onGetPeople:getpeople
   },dispatch);
  }
  
  export default connect(mapStatetoProps,mapActionToProps)(People);
