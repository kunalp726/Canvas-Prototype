import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Document } from 'react-pdf/dist/entry.webpack';
import { Page } from 'react-pdf';
import SVG from 'react-inlinesvg';
import assignmentSvg from "../images/assignments.svg";
// import AppRoute from "../../AppRoute";
// import CourseHomeFaculty from "./courseHomeFaculty";
// import { Link } from 'react-router-dom'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getassignments,submitgrade,getsubmission,submissionbyid,handleUpload,selectassignment,createassignment} from '../../actions/student/assignmentActions';

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
            editing:false,
            headerText:"",
            bodyText:"",
            plainText:"",
            due:"",
            available:"",
            points:"",
            people:[],
            submissionOpen:false,
            submissionFiles:[],
            fileOpen:0,
            openFileindex:0,
            pdfLink:"",
            pageNumber:1,
            pdfFileName:"",
            numpages:0,
            grades:0
        };
    //    this.handleUpload=this.handleUpload.bind(this);
    this.submit=this.submit.bind(this);
       this.handleChange=this.handleChange.bind(this);
       this.getAssignments=this.getAssignments.bind(this);
    }
async getAssignments(){
    let {courseId,courseDepartment,email}=this.state;
    const obj={
        courseId,
        courseDepartment,
        email
    } 
    this.props.onGetAssignments(obj);
}
    componentDidMount(){
   this.getAssignments();
    }
selectAnnouncement=(index)=>{

    (async()=>{
        await this.setState({
            selectedAnn:index,
            annOpen:true,
            file:""
        });
        let obj={
            aid:this.props.studentassignment.announcements[this.state.selectedAnn].aid
        };
       this.props.onselectassignment(obj);
    })();
}

changeHandlerHeader=(e)=>{
    
    this.setState({headerText:e.target.value})
}
changeHandlerCommon=(property,e)=>{
    this.setState({
      [property]:e.target.value
    })
}
makeAnn=()=>{
    this.setState({
        editing:true
    });
}
async submit(e){
    e.preventDefault();
    let obj={...this.state};
    this.props.oncreateassignment(obj);
    setTimeout(()=>{
        this.setState({
            editing:false
        });
        this.getAssignments();
    },1000);
}
getSubmissionbyid=(uid,aid)=>{
    (async()=>{
        let obj={uid,aid};
     this.setState({
         currUid:uid
     })
        this.props.onsubmissionbyid(obj);
        setTimeout(()=>{
            this.setState({
                submissionOpen:true
            });
        },500);

        
    })();
}

submitGrade=()=>{
    (async()=>{
        let {sid}=this.props.studentassignment.submissionFiles[0];
        let aid=this.props.studentassignment.announcements[this.state.selectedAnn].aid;
        let uid=this.state.currUid;
        let obj={sid,grades:this.state.grades,uid,aid}
      this.props.onsubmitgrade(obj);
    })();
}
/////pdf view functions
fileClicked=(index)=>{
    (async()=>{

        try{
        let file=this.props.studentassignment.submissionFiles[index].file;
        let filename=this.props.studentassignment.submissionFiles[index].filename;
        let grades=this.props.studentassignment.grades;

        axios.post(rootUrl+"/courses/getawsfile", {url:file})
            .then(response => {
                
        var blob=new Blob([new Uint8Array(response.data.Body.data)],{type : 'application/pdf'});
        var url = window.URL.createObjectURL(blob)
        this.setState({grades,fileOpen:1,pdfLink:url,pdfFileName:filename,pageNumber:1});
    })
       // console.log(file);
       // console.log(typeof(file));
        // var blob=new Blob([new Uint8Array(response.data)],{type : 'application/pdf'});
        // var url=URL.createObjectURL(blob);
        // console.log(url);
     
        }catch(error){
            console.log(error);
        }
    })()
    
  }
prevClicked=()=>{
    let {pageNumber:page}=this.state;
    if(page>1){
        page-=1;
        this.setState({pageNumber:page});
    }
}
nextClicked=()=>{
    let {pageNumber:page,numpages}=this.state;
    if(page<numpages){
        page+=1;
        this.setState({pageNumber:page});
    }
}
pdfClose=()=>{
    this.setState({fileOpen:0});
}
pdfDownload=()=>{
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = this.state.pdfLink;
    a.download = this.state.pdfFileName;
    a.click();
}
onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numpages:numPages });
  };

/////////////
backtolist=()=>{
    this.setState({submissionOpen:0,fileOpen:0});
}

handleChange(content, delta, source, editor) {
    const text = editor.getText(content);
    this.setState({ bodyText: content ,
    plainText:text})
  }
  goBack=()=>{
    this.setState({
        annOpen:0,submissionOpen:0,fileOpen:0
    });
}
    render(){
        let redirectVar=null;
        let listVar=null;
        let oneAnn=null;
        let editVar=null;
        let subVar=null;
        let pdfViewer=null;
        if(this.state.fileOpen){
    //         pdfViewer= <div>
    //         <div><span onClick={this.pdfClose}>X</span></div>
    //         <div>Current Score: <span>{this.state.submissionFiles[0].grades}/{this.state.announcements[this.state.selectedAnn].points}</span></div>
    //     <Document
    //       file={this.state.pdfLink}
    //       onLoadSuccess={this.onDocumentLoadSuccess}
    //     >
    //       <Page pageNumber={this.state.pageNumber} />
    //     </Document>
    //     <p>Page {this.state.pageNumber} of {this.state.numpages}</p>
    //     <div><button onClick={this.prevClicked}>Previous</button><button onClick={this.nextClicked}>Next</button></div>
    //     <div><input type="number" value={this.state.grades} onChange={(e)=>{this.changeHandlerCommon("grades",e)}} placeholder="Grade"></input><button onClick={this.submitGrade}>Submit Grade</button></div>
    //     <div><button onClick={this.pdfDownload}>Click to Download</button></div>
    //   </div>
    pdfViewer=  <div className="pdf-viewer">
    <div  className="pdf-header">
        <span>{this.state.pdfFileName}</span>
        <span onClick={this.pdfClose}>X Close</span>
        <button onClick={this.pdfDownload}>Download</button>
        
    </div>
    <div className="pdf-navigation">
        <button onClick={this.prevClicked}>Previous</button>
        <p>Page {this.state.pageNumber} of {this.state.numpages}</p>
        <button onClick={this.nextClicked}>Next</button>
        <input type="number" value={this.state.grades} onChange={(e)=>{this.changeHandlerCommon("grades",e)}} placeholder="Grade"></input><button onClick={this.submitGrade}>Submit Grade</button>
    </div>
<Document
  file={this.state.pdfLink}
  onLoadSuccess={this.onDocumentLoadSuccess}
>
  <Page pageNumber={this.state.pageNumber} />
</Document>



</div>
        }
        if(this.state.submissionOpen){
            subVar=<div><span className="back-button" onClick={this.backtolist}>back</span>
            <h3>Files</h3>
            {
                this.props.studentassignment.submissionFiles.map((data,index)=>{
                    return <div className="file-names" onClick={()=>{this.fileClicked(index)}} key={index}>{data.filename}</div>
                })
            }</div>
        }else{
            subVar=<div className="current-submissions">
            <h3>Current Submissions</h3>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        {/* <td>Points</td> */}
                    </tr>
                </thead>
           <tbody>
                 {
                            this.props.studentassignment.people.map((data,index)=>{
                                return <tr key={index} onClick={()=>{this.getSubmissionbyid(data.uid,data.aid)}}><td className="sub-name">{data.name}   </td>
                                {/* <td>{data.grades}</td> */}
                                </tr>
                            })
                        }
                        </tbody>
                         </table>
            </div>
        }
        if(!this.state.editing){
            if(!this.state.annOpen){
                // listVar= <div>
                //     <button onClick={this.makeAnn}>Create Assignment</button>
                // {this.state.announcements.map((data,index)=>{
                //     return(<div key={index} className="announcement-parent">
                //         <h4 onClick={()=>{this.selectAnnouncement(index)}}>{data.header}</h4>
                //         <span>Available : {data.available}</span><span> Due : {data.due} </span><span> Points : {data.points}</span>
                //     </div>)
                // })}
                // </div>
                listVar= 
                <div className="faculty-assignment">
                    <div className="clearfix">
                    <h2>Assignments</h2>
                     <button className="create-button" onClick={this.makeAnn}>Create Assignment</button>
                     </div>
                <div className="assignment-box">
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
                 </div>
            }else{
            // oneAnn= <div className="announcement-parent-single">
            //             <h4>{this.state.announcements[this.state.selectedAnn].header}</h4>
            //             <p>Available: {this.state.announcements[this.state.selectedAnn].available}</p>
            //             <p>Due: {this.state.announcements[this.state.selectedAnn].due}</p>
            //             <p>Points : {this.state.announcements[this.state.selectedAnn].points}</p>
            //             <p dangerouslySetInnerHTML={{__html: this.state.announcements[this.state.selectedAnn].bodyText}}></p>
            //             {/* <p dangerouslySetInnerHTML={{__html: this.state.announcements[this.state.selectedAnn].body}}>}</p> */}
            //             {/* <input onChange={this.handleFile} type="file"></input>
            //             <button onClick={this.handleUpload}>Submit Assignment</button> */}
            //             <div>{this.state.message}</div>
            //             {subVar}
            //         </div>
            oneAnn= <div className="announcement-parent-single assignment-parent-single">
             <div onClick={this.goBack}>Back</div>
            <h1>{this.props.studentassignment.announcements[this.state.selectedAnn].header}</h1>
            <hr></hr>
           
            <div>
            <span>Due: </span>{new Date(this.props.studentassignment.announcements[this.state.selectedAnn].due).toLocaleString()}
            <span>Points : </span> {this.props.studentassignment.announcements[this.state.selectedAnn].points}
            </div>
            <p><span>Available: </span>{new Date(this.props.studentassignment.announcements[this.state.selectedAnn].available).toLocaleString()}</p>
            <hr></hr>
            <span>Description </span>
         
            <p dangerouslySetInnerHTML={{__html: this.props.studentassignment.announcements[this.state.selectedAnn].bodyText}}></p>
            {/* <hr></hr>
            <div className="submission-files">
                <h3>Your submissions details</h3>
        {this.state.submittedFiles.map((data,index)=>{
          return  <div className="files-submitted"><a onClick={(e)=>{this.pdfDownload(e,index)}}>{data.filename}</a></div>
        })}
    </div> */}
    <hr></hr>
    {subVar}
        </div>
            }
        }else{
            editVar=<div>
                
            <form onSubmit={this.submit}>
            <input type="text" required onChange={this.changeHandlerHeader} placeholder="header"></input>
            {/* <textarea rows="4" required onChange={this.changeHandlerBody} cols="50"></textarea> */}
            <ReactQuill 
              onChange={this.handleChange} />
             <div><label>Due : </label><input type="datetime-local" onChange={(e)=>{this.changeHandlerCommon("due",e)}} placeholder="Due"></input> </div>
             <div><label>Available : </label><input type="datetime-local" onChange={(e)=>{this.changeHandlerCommon("available",e)}} placeholder="Available"></input> </div>
             <div><label>Points : </label><input type="number" onChange={(e)=>{this.changeHandlerCommon("points",e)}} placeholder="Points"></input> </div>
             <div><input type="submit" value="Submit"></input></div>
            </form>
        </div>
        }
        console.log(cookie.load("cookie"));
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="super-parent assignment-parent-fac search-parent">
             
             {editVar}
             {listVar}
             {oneAnn}
             {pdfViewer}
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
    onHandleUpload:handleUpload,
    onselectassignment:selectassignment,
    onsubmissionbyid:submissionbyid,
    oncreateassignment:createassignment,
    onsubmitgrade:submitgrade
   },dispatch);
  }
  
  export default connect(mapStatetoProps,mapActionToProps)(Assignments);
