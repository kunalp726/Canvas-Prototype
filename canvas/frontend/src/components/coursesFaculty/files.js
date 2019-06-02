import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import { Document } from 'react-pdf/dist/entry.webpack';
import { Page } from 'react-pdf';
import pdfjs from 'pdfjs-dist';
import SVG from 'react-inlinesvg';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getfiles} from '../../actions/student/fileActions';
import {getcourse} from '../../actions/student/insidebarActions';
import fileSvg from "../images/files.svg"
import pdfSvg from "../images/pdf.svg"
// import profileSVG from "../images/dashboard.svg"




class Files extends Component{
    constructor(props){
       
        super(props)

        this.state={
            email:props.cred.email,
            courseId:props.cred.cid,
            courseDepartment:props.cred.courseDepartment,
            courseName:props.cred.courseName,
            courseTerm:props.cred.courseTerm,
            courseactualId:props.cred.courseId,
            announcements:[],
            message:"",
            files:[],
            fileOpened:0,
            pdfLink:"",
            pageNumber:1,
            pdfFileName:"",
            numpages:0
        };
       this.handleUpload=this.handleUpload.bind(this);
       this.getFiles=this.getFiles.bind(this);
    }

    handleFile=(e)=>{
        this.setState({
            message:"",
            file:e.target.files[0]
        })
    }
    async handleUpload(){
        let file=this.state.file;
        if(file){
        const data = new FormData()
    data.append('file', this.state.file, this.state.file.name);
    data.set('cid', this.state.courseId.toString());
   // data.append('cid', JSON.stringify({cid:this.state.cid}))
    try {
        let obj={data:data,cid:this.state.courseId};
        let response= await axios.post(rootUrl+"/courses/lecfiles",data);
        if(response.status==200){
          alert(response.data.message);
          this.getFiles();
        }
    } catch (error) {
        
    }     
}else{
    alert("Please choose a file!");
}
      }
      fileClicked=(index)=>{
        let file=this.props.studentfiles.files[index].file.data;
        let filename=this.props.studentfiles.files[index].filename;
        console.log(file);
        console.log(typeof(file));
        var blob=new Blob([new Uint8Array(file)],{type : 'application/pdf'});
        var url=URL.createObjectURL(blob);
        console.log(url);
        this.setState({fileOpened:1,pdfLink:url,pdfFileName:filename,pageNumber:1});
      }
async getFiles(){
    let {courseId}=this.state;
    this.props.onGetFiles(courseId);
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
    this.setState({fileOpened:0});
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
 componentDidMount(){
    this.getFiles();

    this.props.onGetCourse({cid:this.state.courseId});
}
    render(){
        let redirectVar=null;
        let pdfViewer=null;
        if(this.state.fileOpened){
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
                </div>
            <Document
              file={this.state.pdfLink}
              onLoadSuccess={this.onDocumentLoadSuccess}
            >
              <Page pageNumber={this.state.pageNumber} />
            </Document>
          
           
           
          </div>
        }
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="super-parent">
            <h2>Lecture Files</h2>
            <div className="file-upload-parent clearfix">
            <div className="floater">
            <input onChange={this.handleFile} type="file"></input>
            <button onClick={this.handleUpload}>+ Upload File</button>
            </div>
            </div><div className="parent-container clearfix">
            <div className="left-container clearfix">
             <span><SVG src={fileSvg}></SVG></span>   <span>{`${this.props.studentinsidebar.courseDepartment} ${this.props.studentinsidebar.courseactualId} - ${this.props.studentinsidebar.courseName}`}</span>
            </div>
            <div className="right-container clearfix">
            <table>
            <thead><tr>
            <td>Name</td>
            <td>Posted</td>
            <td>Size</td>
            </tr>
            </thead>
            <tbody>
              {this.props.studentfiles.files.map((data,index)=>{
                  let date=new Date(data.posted)
               return( <tr key={index}>
                <td className="file-name" onClick={()=>{this.fileClicked(index)}}><SVG src={pdfSvg}></SVG>{data.filename}</td>
                <td>{date.toLocaleString()}</td>
                <td>{`${(data.file.data.length/1024).toFixed(1)} KB`}</td>
              </tr>)
            })}
             </tbody>
            </table>
            </div>
           
            {pdfViewer}
            </div>
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
    onGetFiles:getfiles,
    onGetCourse:getcourse
   },dispatch);
  }
  
  export default connect(mapStatetoProps,mapActionToProps)(Files);