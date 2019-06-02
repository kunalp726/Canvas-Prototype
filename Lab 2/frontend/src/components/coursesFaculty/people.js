import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import{Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getpeople} from '../../actions/student/peopleActions';
import 'react-table/react-table.css'
import ReactTable from "react-table";
class People extends Component{
    constructor(props){
       
        super(props)

        this.state={
            email:props.cred.email,
            courseId:props.cred.cid,
            courseDepartment:props.cred.courseDepartment,
            announcements:[]
        };
       this.removeStudent=this.removeStudent.bind(this);
       this.getPeople=this.getPeople.bind(this);
    }

    async getPeople(){
        let {courseId,courseDepartment,email}=this.state;
        const obj={
            courseId,
            courseDepartment,
            email
        }
      this.props.onGetPeople(obj);
    }
    componentDidMount(){
      this.getPeople();
    }

    async removeStudent(index){
        let data=this.props.studentpeople.announcements[index];

        try {
            let response=await axios.post(rootUrl+"/courses/removestudent",{uid:data.uid,cid:this.props.studentinsidebar.dataObj.cid});
            if(response.status===200){
              alert(response.data.message);
              this.getPeople();
            }
        } catch (error) {
            
        }
    }
    render(){
        let redirectVar=null;
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        let array=this.props.match.url.split("/")
        array.pop();
        let url=array.join("/");
        url=url+"/profile/";
        let currObj=this.props.studentinsidebar;
        const columns = [{
          Header: 'Name',
          accessor: 'name',
          Cell: (props) => {
        return(  <Link to={url+props.original.uid}>{props.value}</Link>)
        } // String-based value accessors!
        },{
          Header: 'Section',
          accessor: 'uid',
          Cell: (props) => {
        return(  <span>{`${currObj.courseTerm}:${currObj.courseDepartment}-${currObj.courseId}`}</span>)
        } // String-based value accessors!
        }, {
          Header: 'Role',
          accessor: 'role',
        },{
          Header: 'Remove',
          accessor: 'uid',
          Cell: (props) => {
            if(props.original.role=="student"){
              return(<button className="primary-btn" onClick={()=>{this.removeStudent(props.index)}}>Remove</button> )
            }else{
              return(<span></span>);
            }
        return(  <span>{`${currObj.courseTerm}:${currObj.courseDepartment}-${currObj.courseId}`}</span>)
        } // String-based value accessors!
        }]

        return(
            <div className="super-parent">
            <ReactTable
                data={this.props.studentpeople.announcements}
                columns={columns}
                showPagination= {true}
                showPaginationTop= {false}
                showPaginationBottom={ true}
                showPageSizeOptions= {true}
                pageSizeOptions={ [1,5, 10, 20, 25, 50, 100]}
                defaultPageSize={ 5}
              />
            {/* <table>
            <thead><tr>
            <td>Name</td>
            <td>Section</td>
            <td>Role</td>
            <td></td>
            </tr>
            </thead>
            <tbody>
              {this.props.studentpeople.announcements.map((data,index)=>{
               return data.role=='student'? ( <tr key={index}>
                <td><Link to={url+data.uid}>{data.name}</Link></td>
                <td>{`${this.props.studentinsidebar.courseTerm}:${this.props.studentinsidebar.courseDepartment}-${this.props.studentinsidebar.courseId}`}</td>
                <td>{data.role}</td>
                <td className="remove-btn"><button onClick={()=>{this.removeStudent(index)}}>Remove</button> </td>
              </tr>) : ( <tr key={index}>
                <td><Link to={url+data.uid}>{data.name}</Link></td>
                <td>{`${this.props.studentinsidebar.courseTerm}:${this.props.studentinsidebar.courseDepartment}-${this.props.studentinsidebar.courseId}`}</td>
                <td>{data.role}</td>
                <td></td>
              </tr>)
            })}
             </tbody>
            </table> */}
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