import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getannouncements,makeannouncements} from '../../actions/student/announcementActions';
//faculty announcement page


class Announcements extends Component{
    constructor(props){
       
        super(props)

        this.state={
            email:props.cred.email,
            courseId:props.cred.cid,
            courseDepartment:props.cred.courseDepartment,
            announcements:[],
            annOpen:false,
            selectedAnn:0,
            editing:false,
            headerText:"",
            bodyText:"",
            plainText:""
        };
        this.submit=this.submit.bind(this);
        this.handleChange=this.handleChange.bind(this);
       
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
  goBackEdit=()=>{
    this.setState({
        editing:0
    });
  }
// changeHandlerBody=(e)=>{
   
//     this.setState({bodyText:e.target.value})
// }
changeHandlerHeader=(e)=>{
    
    this.setState({headerText:e.target.value})
}

selectAnnouncement=(index)=>{
this.setState({
    selectedAnn:index,
    annOpen:true
});
}
makeAnn=()=>{
    this.setState({
        editing:true
    });
}
async submit(e){
    e.preventDefault();
    let obj={...this.state};
   
    this.props.onMakeAnnouncement(obj);
    setTimeout(()=>{
        this.setState({
            editing:false
        });
    },1500);
   
}
handleChange(content, delta, source, editor) {
    const text = editor.getText(content);
    this.setState({ bodyText: content ,
    plainText:text})
  }
    render(){
        let redirectVar=null;
        let listVar=null;
        let oneAnn=null;
        let editVar=null;
        const toolbarOptions = [
            ['bold', 'italic', 'underline'],        // toggled buttons

            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'video'],

            ['clean']                                         // remove formatting button
        ];
        if(!this.state.editing){
            if(!this.state.annOpen){
                listVar= <div>
                    <div className="btn-parent-ann clearfix">
                     <button onClick={this.makeAnn}>+ Announcement</button>
                     </div>
                {this.props.studentannouncement.announcements.map((data,index)=>{
                    let date=new Date(data.posted);
                    return(<div onClick={()=>{this.selectAnnouncement(index)}} key={index} className="announcement-parent clearfix">
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
        }else{
            editVar=<div>
                  <div onClick={this.goBackEdit}>Back</div>
                <form onSubmit={this.submit}>
                <input type="text" required onChange={this.changeHandlerHeader} placeholder="header"></input>
                {/* <textarea rows="4" required onChange={this.changeHandlerBody} cols="50"></textarea> */}
                <ReactQuill 
                modules={{toolbar:toolbarOptions}}
                  onChange={this.handleChange} />
                <input type="submit" value="Submit"></input>
                </form>
            </div>
        }
        console.log(cookie.load("cookie"));
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="announcement-super-parent">
           
             {editVar}
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
    onGetAnnouncements:getannouncements,
    onMakeAnnouncement:makeannouncements
   },dispatch);
  }
  
  export default connect(mapStatetoProps,mapActionToProps)(Announcements);
