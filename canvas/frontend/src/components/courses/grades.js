import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getgrades} from '../../actions/student/gradeActions';

class Grades extends Component{
    constructor(props){
       
        super(props)

        this.state={
            email:props.cred.email,
            courseId:props.cred.cid,
            courseDepartment:props.cred.courseDepartment,
            announcements:[],
            annOpen:false,
            selectedAnn:0
        };
       
    }
async componentDidMount(){
    let {courseId:cid,courseDepartment,email:uid}=this.state;
    const obj={
        cid,
        courseDepartment,
        uid
    }
this.props.onGetGrades(obj);
}
    render(){
        let redirectVar=null;
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="super-parent">
            <table>
            <thead><tr>
            <td>Name</td>
            <td>Due</td>
            <td>Score</td>
            <td>Out of</td>
            </tr>
            </thead>
            <tbody>
              {this.props.studentgrades.announcements.map((data,index)=>{
                  let date=new Date(data.due);
               return( <tr key={index}>
                <td>{data.header}</td>
                <td>{date.toLocaleString()}</td>
                <td>{data.grades}</td>
                <td>{data.points}</td>
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
    onGetGrades:getgrades
   },dispatch);
  }
  
  export default connect(mapStatetoProps,mapActionToProps)(Grades);
