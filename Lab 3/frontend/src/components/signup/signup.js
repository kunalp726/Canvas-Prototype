import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from "react-cookies";
import img from "../images/sjsuhead.png";
import img2 from "../images/sjsuheader.png";
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {signupuser,signupreset} from '../../actions/signupActions';
import { graphql, compose } from 'react-apollo';
import { signupMutation } from '../../mutation/mutations';
import _ from 'lodash';
class Signup extends Component {

  constructor(props){
    super(props)

    this.state={
      firstName:"",
      lastName:"",
      email:"",
      password:"",
      signupSuccess:0,
      message:"",
      role:"student"
    }

    this.signup=this.signup.bind(this);
  }
  changeHandlerFirstName=(e)=>{
    this.setState({
      firstName:e.target.value
    });
  }
  changeHandlerLastName=(e)=>{
    this.setState({
      lastName:e.target.value
    });
  }

  changeHandlerEmail=(e)=>{
    this.setState({
      email:e.target.value
    });
  }

  changeHandlerPassword=(e)=>{
    this.setState({
      password:e.target.value
    });
  }
  changeHandlerRadio=(e)=>{
    this.setState({
      role:e.target.value
    });
  }

  async signup(e){

    e.preventDefault();

    let {firstName,lastName,email,password,role}=this.state;
    var data={
     firstName,
     lastName,
     email,
     password,
     role
    }

    let res=await this.props.signupMutation({
      variables: {
          email,
          password,
          firstName,
          lastName,
          role
      },
  });
  if(_.has(res,"data.signup.email")){
    if(res.data.signup.email){
    alert("sign up successfull! redirecting to login page!")
    this.setState({
      signupSuccess:1
    })
  }else{
    alert("sign up failed! Email already exists")
    this.setState({
      signupSuccess:0
    })
  }
  }else{
    alert("sign up failed! Please try again !")

    this.setState({
      signupSuccess:0
    })
  }
    

  }

  render() {
    let redirectVar = null;
    if(this.state.signupSuccess){
        redirectVar = <Redirect to= "/login"/>
    }
    if(cookie.load("cookie")){
      redirectVar=<Redirect to="/home"/>
  }
      return(<div>
          <header className="login-header"><span>Connecting to</span><span><img src={img}></img></span>
        <p>Sign-in with your San Jose State University account to access SJSU Single Sign-on</p>
        </header>
        <div>{redirectVar}</div>
        <form className="login-form" onSubmit={this.signup}>
        <div className="img-parent"><img src={img2}></img></div>
        <p>Sign Up</p>
        <div className="input-parent">
       <div> <input required onChange={this.changeHandlerFirstName} type="text" placeholder="FirstName"></input></div>
       <div> <input required onChange={this.changeHandlerLastName} type="text" placeholder="LastName"></input></div>
       <div className="radio-parent"><input type="radio" onChange={this.changeHandlerRadio} checked={this.state.role==="student"} name="role"  value="student"></input><label>Student</label></div>
       <div className="radio-parent"><input type="radio" onChange={this.changeHandlerRadio} checked={this.state.role==="faculty"} name="role" value="faculty"></input><label>Faculty</label></div>
       <div> <input required onChange={this.changeHandlerEmail} type="text" placeholder="Email"></input></div>
       <div><input required onChange={this.changeHandlerPassword} type="password" placeholder="Password"></input></div>
        <input className="btn" type="submit" value="Sign Up"></input>
        </div>
        <div className="sign-up"><span>Already registered ? </span><Link to="/login">Sign In</Link></div>
        </form>
        <div>{this.state.message}</div>
      </div>)
  }
}

export default compose(
  graphql(signupMutation, { name: "signupMutation" })
)(Signup);

