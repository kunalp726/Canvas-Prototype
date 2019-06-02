import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getannouncements} from '../../actions/student/announcementActions';

class Announcements extends Component{
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
    
    let {courseId,courseDepartment,email}=this.state;
    const obj={
        courseId,
        courseDepartment,
        email
    }
    this.props.onGetAnnouncements(obj);

}
goBack=()=>{
    this.setState({
        annOpen:0
    });
  }
selectAnnouncement=(index)=>{
this.setState({
    selectedAnn:index,
    annOpen:true
});
}
    render(){
        let redirectVar=null;
        let listVar=null;
        let oneAnn=null;
        if(!this.state.annOpen){
            listVar= <div>
                <div className="btn-parent-ann clearfix">
                     {/* <button onClick={this.makeAnn}>+ Announcement</button> */}
                     </div>
            {this.props.studentannouncement.announcements.map((data,index)=>{
                  let date=new Date(data.posted);
                return(<div onClick={()=>{this.selectAnnouncement(index)}} key={index} key={index} className="announcement-parent clearfix">
                    <h4>{data.header}</h4>
                    {/* <p>{data.author}</p> */}
                    <p>{data.plainText}</p>
                    <div className="posted-parent">
                        <div className="posted">Posted on :</div>
                        <div className="posted-time">{`${date.toUTCString()}`}</div>
                        </div>
                </div>)
            })}
            </div>
        }else{
           oneAnn= <div className="announcement-parent-single">
            <div onClick={this.goBack}>Back</div>
            <div className="grey-space"></div>
            <div className="content">
                    <h4>{this.props.studentannouncement.announcements[this.state.selectedAnn].header}</h4>
                    <p>{this.props.studentannouncement.announcements[this.state.selectedAnn].author}</p>
                    <p dangerouslySetInnerHTML={{__html: this.props.studentannouncement.announcements[this.state.selectedAnn].bodyText}}></p>
                </div>
                <div className="grey-space"></div>
                </div>
        }
        console.log(cookie.load("cookie"));
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="announcement-super-parent">
             {listVar}
             {oneAnn}
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
    onGetAnnouncements:getannouncements
   },dispatch);
  }
  
  export default connect(mapStatetoProps,mapActionToProps)(Announcements);
