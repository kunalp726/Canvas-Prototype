import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import SVG from 'react-inlinesvg';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getChats,getAllUsers,postmessage} from '../../actions/inboxActions';
import arrayMove from 'array-move';
import stockimg from "../images/stockuser.png";
class Inbox extends Component{
    constructor(props){
        super(props)
        this.state={
          chatopen:0,
          selectindex:0
        };
    }
async componentDidMount(){
   let data=cookie.load("cookie");
    this.props.ongetAllUsers();
   this.props.ongetChats({uid:data.email});
}
changeHandler=(property,e)=>{
    this.setState({
      [property]:e.target.value
    })
   }

   submit=(e)=>{
       e.preventDefault();
       let {userid:receiverid,messagetext}=this.state;
       if(!receiverid){
        receiverid=this.props.studentinbox.userList[0]._id;
       }
       let uid=this.props.navbar.uid;
        this.props.onpostmessage({receiverid,messagetext,uid});
        this.setState({
            messagetext:""
        })
   }
   chatOpened=(index)=>{
    this.setState({
        chatopen:1,
        selectindex:index
    })
   }
   goBack=()=>{
       this.setState({
           chatopen:0,
           selectindex:0
       })
   }
   postmassageInv=(receiverid)=>{
    let {messagetext}=this.state;
    let uid=this.props.navbar.uid;
     this.props.onpostmessage({receiverid,messagetext,uid});
     this.setState({
         messagetext:""
     })
   }
   compose=()=>{
       this.setState({
           composeOpen:1
       })
   }
   closeCompose=()=>{
       this.setState({
           composeOpen:0
       })
   }
    render(){
        let redirectVar=null;
        console.log(cookie.load("cookie"));
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        let displayVar=null;
        if(!this.state.chatopen){
            displayVar=<div>
                {this.props.studentinbox.chatList.map((data,index)=>{
                    return(<div className="clearfix chatlist-parent" onClick={()=>{this.chatOpened(index)}}>
                    <div className="image-parent"><img src={data.uid.profileImage?data.uid.profileImage:stockimg}></img></div>
                      <div>  <h3>{data.uid.name}</h3>
                        <p>{data.messages[data.messages.length-1].messagetext}</p>
                        </div>
                    </div>);
                })}
            </div>
        }else if(this.props.studentinbox.chatList[this.state.selectindex]){
            displayVar=<div>
                <button className="primary-btn" onClick={this.goBack}>Back</button>
                <div className="chat-container">
                <div className="clearfix img-super-parent">
                <div className="image-parent"><img src={this.props.studentinbox.chatList[this.state.selectindex].uid.profileImage?this.props.studentinbox.chatList[this.state.selectindex].uid.profileImage:stockimg}></img></div>
               
               <h2>{this.props.studentinbox.chatList[this.state.selectindex].uid.name}</h2>
               </div>
                {this.props.studentinbox.chatList[this.state.selectindex].messages.map((data)=>{
                  return ( <div className="clearfix"><span className={data.action=="sent"?"float-right":"float-left"}>{data.messagetext}</span></div>)
                })}
                 <div><textarea value={this.state.messagetext} onChange={(e)=>{this.changeHandler("messagetext",e)}}></textarea></div>
               <button className="primary-btn" onClick={()=>{this.postmassageInv(this.props.studentinbox.chatList[this.state.selectindex].uid._id)}} >Send</button>
            </div>
            </div>
        }
        return(
            <div className="inbox-parent ml90">
                <div>{redirectVar}</div>
               
               <h2>Inbox</h2>
               <hr></hr>
             <div className="button-parent clearfix"> <button className="primary-btn" onClick={this.compose}>Compose</button></div>
                <div className={`message-form ${this.state.composeOpen==1?"active":""}`}>
                <div className="inside-container">
                <div className="clearfix"><span onClick={this.closeCompose}>X</span></div>
                <div className="recepient">
                <form onSubmit={this.submit}>
                <select onChange={(e)=>{this.changeHandler("userid",e)}}>
                    {this.props.studentinbox.userList.map((data)=>{
                        return(<option value={data._id}>{`${data.email} - ${data.name}`}</option>)
                    })}
                </select>
               <div><textarea required value={this.state.messagetext} onChange={(e)=>{this.changeHandler("messagetext",e)}}></textarea></div>
               <input className="primary-btn" type="submit" value="Send Message"></input>
               </form>
                </div>
                </div>
                </div>

                        {displayVar}
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
    ongetChats:getChats,
    ongetAllUsers:getAllUsers,
    onpostmessage:postmessage
   },dispatch);
  }
  
export default connect(mapStatetoProps,mapActionToProps)(Inbox);
