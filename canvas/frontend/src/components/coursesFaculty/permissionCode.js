import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getcodes} from '../../actions/student/permissionActions';

class Permissioncode extends Component{
    constructor(props){
       
        super(props)

        this.state={
            email:props.cred.email,
            courseId:props.cred.cid,
            courseDepartment:props.cred.courseDepartment,
            announcements:[],
        };
       this.generate=this.generate.bind(this);
       this.getCodeList=this.getCodeList.bind(this);
    }

    async getCodeList(){
        let {courseId}=this.state;
      this.props.ongetcodes(courseId);
    }

    componentDidMount(){
        this.getCodeList();
    }

    async generate(){
    try {
        let result=await axios.post(rootUrl+"/courses/addcodes",{cid:this.state.courseId});
        if(result.status===200){
            alert(result.data.message);
            this.getCodeList();
        }
    } catch (error) {
        
    }
}
    render(){
        let redirectVar=null;
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="super-parent">
            <div className="code-header">
           <h2>Permission Codes</h2>
           </div>
           <div className="btn-parent"><button onClick={this.generate}>Generate Permission Code</button></div>
            <table>
            <thead><tr>
            <td>Code</td>
            <td>Used</td>
            {/* <td>User Name</td> */}
            </tr>
            </thead>
            <tbody>
              {this.props.studentpermission.announcements.map((data,index)=>{
               return( <tr key={index}>
                <td>{data.code}</td>
                <td>{data.used==1?"Yes":"No"}</td>
                {/* <td>{data.name}</td> */}
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
    ongetcodes:getcodes
   },dispatch);
  }
  
  export default connect(mapStatetoProps,mapActionToProps)(Permissioncode);
