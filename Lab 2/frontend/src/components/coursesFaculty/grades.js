import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';


class Grades extends Component{
    constructor(props){
       
        super(props)

        this.state={
            email:props.cred.email,
            courseId:props.cred.courseId,
            courseDepartment:props.cred.courseDepartment,
            announcements:[],
            annOpen:false,
            selectedAnn:0
        };
       
    }
async componentDidMount(){
    try{
        let {courseId,courseDepartment,email}=this.state;
        const obj={
            courseId,
            courseDepartment,
            email
        }
        let response=await axios.post(rootUrl+"/courses/grades",obj);
        if(response.status===200){
                this.setState({
                    announcements:response.data
                });
        }
    }catch(error){
        throw error;
    }
}
    render(){
        let redirectVar=null;
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="ml90">
            <table>
            <thead><tr>
            <td>Name</td>
            <td>Due</td>
            <td>Status</td>
            <td>Score</td>
            <td>Out of</td>
            </tr>
            </thead>
            <tbody>
              {this.state.announcements.map((data,index)=>{
               return( <tr key={index}>
                <td>{data.header}</td>
                <td>{data.due}</td>
                <td>{data.status}</td>
                <td>{data.score}</td>
                <td>{data.points}</td>
              </tr>)
            })}
             </tbody>
            </table>
            </div>
        )
    }
}

export default Grades;