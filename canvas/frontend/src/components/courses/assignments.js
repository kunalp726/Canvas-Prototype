import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import _ from 'lodash';
import SVG from 'react-inlinesvg';
import assignmentSvg from "../images/assignments.svg";

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getassignments,getsubmission,handleUpload} from '../../actions/student/assignmentActions';

class Assignments extends Component{
    constructor(props){
       
        super(props)

        this.state={
            email:props.cred.email,
            courseId:props.cred.cid,
            courseDepartment:props.cred.courseDepartment,
            announcements:[],
            annOpen:false,
            selectedAnn:0,
            message:"",
            fileno:1,
            files:[],
            submission:0,
            submissionFiles:[],
            submittedFiles:[]
        };
       this.handleUpload=this.handleUpload.bind(this);
    }
async componentDidMount(){
    let {courseId,courseDepartment,email}=this.state;
    const obj={
        courseId,
        courseDepartment,
        email
    } 
    this.props.onGetAssignments(obj);
  
}
selectAnnouncement=(index)=>{
  ( async()=>{
      await this.setState({
        selectedAnn:index,
        annOpen:true,
        file:""
    });
    this.getSubmission();
}
    )();
    
    // (async()=>{
    //     try {
    //         let {}
    //         let response=axios.post(rootUrl+"/getSubmission");
    //     } catch (error) {
    //         throw error;
    //     }
    // })();

}
handleFile=(e,index)=>{
    let files=this.state.files;
    files[index]=e.target.files[0];
   
    this.setState({
        message:"",
        file:files
    })
}
getSubmission=()=>{
    let obj={
        aid:this.props.studentassignment.announcements[this.state.selectedAnn].aid,
        uid:this.state.email
    }
    this.props.onGetSubmission(obj);
}
pdfDownload=(e,i)=>{
    e.preventDefault();
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    let{file,filename}=this.props.studentassignment.submittedFiles[i];
    var blob=new Blob([new Uint8Array(file.data)],{type : 'application/pdf'});
    var url=URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click(); 
}
async handleUpload(){
    const data = new FormData()
    this.state.files.forEach((ele,ind)=>{
        data.append('file'+ind, ele, ele.name)
    });
   data.set('aid',this.props.studentassignment.announcements[this.state.selectedAnn].aid);
   data.set('uid',this.state.email);
    this.props.onHandleUpload(data);
   this.setState({file:[],fileno:1}); 
  }

  addFile=()=>{
      let {fileno}=this.state;
      this.setState({fileno:fileno+=1});
  }
  goBack=()=>{
    this.setState({
        annOpen:0
    });
  }
    render(){
        let redirectVar=null;
        let listVar=null;
        let oneAnn=null;
        let subOption=null;
        if(!this.state.annOpen){
            listVar= <div className="assignment-box">
           <div className="box-heading"> <h4>Upcoming Assignments</h4></div>
           <div className="inner-box">
            {this.props.studentassignment.announcements.map((data,index)=>{
                return(<div onClick={()=>{this.selectAnnouncement(index)}} key={index} className="announcement-parent clearfix">
                   <div className="left-side">
                   <SVG src={assignmentSvg}></SVG>
                   </div>
                   <div className="right-side">
                    <h4 >{data.header}</h4>
                    <span>Available : {new Date(data.available).toDateString()}</span><span> Due : {new Date(data.due).toLocaleString()} </span><span> -/{data.points} pts</span>
                    </div>
                </div>)
            })}
            </div>
            </div>
        }else{
           oneAnn= <div className="announcement-parent-single assignment-parent-single">
                    <div onClick={this.goBack}>Back</div>
                    <h1>{this.props.studentassignment.announcements[this.state.selectedAnn].header}</h1>
                    <hr></hr>
                   
                    <div>
                    <span>Due: </span>{new Date(this.props.studentassignment.announcements[this.state.selectedAnn].due).toLocaleString()}
                    <span>Points : </span> {this.props.studentassignment.announcements[this.state.selectedAnn].points}
                    </div>
                    <p><span>Available: </span>{new Date(this.props.studentassignment.announcements[this.state.selectedAnn].available).toLocaleString()}</p>
                    <span>Description </span>
                    <hr></hr>
                    <p dangerouslySetInnerHTML={{__html: this.props.studentassignment.announcements[this.state.selectedAnn].bodyText}}></p>
                    <hr></hr>
                    <div className="submission-files">
                        <h3>Your submissions details</h3>
                {this.props.studentassignment.submittedFiles.map((data,index)=>{
                  return  <div className="files-submitted"><a onClick={(e)=>{this.pdfDownload(e,index)}}>{data.filename}</a></div>
                })}
            </div>
            <hr></hr>
                </div>
        }
        if(this.state.annOpen && this.props.studentassignment.announcements[this.state.selectedAnn].due>new Date().toJSON()){
            subOption= <div>
              {_.times(this.state.fileno,(index)=>{
                  return (
                   <div key={index} className="choose-files"> <input  onChange={(e)=>{this.handleFile(e,index)}} type="file"></input></div>
                  )
              })}

            <span className="add-another" onClick={this.addFile}>+ Add Another File</span>        
             <div> <button onClick={this.handleUpload}>Submit Assignment</button></div>
           
              <div>{this.state.message}</div>
             
            </div>
        }
        console.log(cookie.load("cookie"));
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="super-parent assignment-parent">
           
             {listVar}
             {oneAnn}
             {subOption}
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
    onGetAssignments:getassignments,
    onGetSubmission:getsubmission,
    onHandleUpload:handleUpload
   },dispatch);
  }
  
  export default connect(mapStatetoProps,mapActionToProps)(Assignments);
