import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getgrades} from '../../actions/student/gradeActions';
import 'react-table/react-table.css'
import ReactTable from "react-table";

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
 componentDidMount(){
    let {courseId:cid,courseDepartment,email:uid}=this.state;
    const obj={
        cid,
        courseDepartment,
        uid:cookie.load("cookie").email
    }
this.props.onGetGrades(obj);
}
    render(){
        let redirectVar=null;
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        const columns = [{
            Header: 'Name',
            accessor: 'header'
            // String-based value accessors!
          },{
            Header: 'Due',
            accessor: 'due',
            Cell: (props) => {
                let date=new Date(props.value);
          return(  <span>{date.toLocaleString()}</span>)
          } // String-based value accessors!
          }, {
            Header: 'Grades',
            accessor: 'grades',
          },{
            Header: 'Out Of',
            accessor: 'points',
          }]

        return(
            <div className="super-parent">
              <ReactTable
                data={this.props.studentgrades.announcements}
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
    onGetGrades:getgrades
   },dispatch);
  }
  
  export default connect(mapStatetoProps,mapActionToProps)(Grades);
