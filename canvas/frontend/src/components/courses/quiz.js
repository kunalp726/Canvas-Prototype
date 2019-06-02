import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getquizes,getquizdetail,postanswers} from '../../actions/student/quizActions';

class Quiz extends Component{
    constructor(props){
       
        super(props)

        this.state={
            email:props.cred.email,
            courseId:props.cred.cid,
            courseDepartment:props.cred.courseDepartment,
            quizes:[],
            quizlistopened:1,
            quizdescriptionopened:0,
            quizstarted:0,
            questionIndex:0,
            quizData:[],
            quizanswers:[],
            queArray:[],
            quizscore:[]
        };
       
    }
async componentDidMount(){
    let {courseId:cid,courseDepartment,email:uid}=this.state;
    const obj={
        cid,
        courseDepartment,
        uid
    }
   this.props.onGetQuizes(obj);
}
startquiz=()=>{
    let obj={};
    let quesArray=[];
    this.props.studentquizes.quizData.forEach((data)=>{
      
        if(!obj[data.quesid]){
            obj[data.quesid]=[];
            obj[data.quesid].push(data)
        }else{
            obj[data.quesid].push(data);
        }
       
    });
    for(let x in obj){
        quesArray.push(x);
    }
    this.setState({
        quizdescriptionopened:0,
        startquiz:1,
        quesMap:obj,
        queArray:quesArray
    });
}
quizOpened=(qid)=>{
    let obj={qid,uid:this.state.email};

    this.props.onGetQuizDetail(obj);
    setTimeout(()=>{
        this.setState({
            quizdescriptionopened:1,
            quizlistopened:0,
        });
    },0);
      
}
    nextQuestion=(e)=>{
        e.preventDefault();
     let {questionIndex,quizanswers,queArray}=this.state;
     let quesIndex=this.state.queArray[this.state.questionIndex];
     let obj=[
        quesIndex,
        this.state.option,
        this.props.studentquizes.quizData[0].qid,
        this.state.email
     ]
     quizanswers.push(obj);
     if(questionIndex<queArray.length-1){
        this.setState({
            questionIndex:questionIndex+=1,
            quizanswers,
            option:""
        });
     }else{
         setTimeout(()=>{
            this.setState({
                startquiz:0,
                quizlistopened:1
            });
         },1500);
      
         let {quizanswers,quesMap}=this.state;
         this.props.onPostAnswers(quizanswers,quesMap);
     }
    
    }

    changeHandlerRadio=(e)=>{
        this.setState({
        option:e.target.value
        });
    }
    render(){
        let redirectVar=null;
        let quizlist=null;
        let quizdescription=null;
        let startquiz=null;
        let buttonDiv=null;
        let startquizbtn=null;
        if(this.state.questionIndex==this.state.queArray.length-1){
            buttonDiv= <input type="submit" value="Submit Quiz"></input>
        }else{
            buttonDiv= <input type="submit" value="Next Question"></input>
        }
        if(this.state.startquiz){
            let obj=this.state.quesMap[this.state.queArray[this.state.questionIndex]];
            startquiz=<div className="actual-quiz">
                <div>Question {this.state.questionIndex+1} of {this.state.queArray.length}</div>
                <hr></hr>
                <div><span>Question : </span><span>{obj[0].question}</span></div>
                <hr></hr>
                {/* <div><input type="radio" onChange={this.changeHandlerRadio}  name="option"  value={obj.optionText}></input><label>Student</label></div> */}
                <form onSubmit={this.nextQuestion}>
                {   
                 
                    obj.map((data)=>{
                        return <div><input required type="radio" checked={data.optionText===this.state.option} onChange={this.changeHandlerRadio}  name="option" value={data.optionText}></input><label>{data.optionText}</label></div>
                    })
              
                }
                {buttonDiv}
                  </form>
                
            </div>
        }
        if(this.state.quizlistopened){
            quizlist=   <table>
            <thead><tr>
            <td>Quiz Name</td>
            <td>Posted</td>
            <td>Due</td>
            <td>Available From</td>
            <td>Available Until</td>
            </tr>
            </thead>
            <tbody>
              {this.props.studentquizes.quizes.map((data,index)=>{
                   let date1=new Date(data.posted);
                   let date2=new Date(data.due);
                   let date3=new Date(data.availablefrom);
                   let date4=new Date(data.availableto);
               return( <tr onClick={()=>{this.quizOpened(data.qid)}} key={index}>
              
                <td>{data.heading}</td>
                <td>{date1.toLocaleString()}</td>
                <td>{date2.toLocaleString()}</td>
                <td>{date3.toLocaleString()}</td>
                <td>{date4.toLocaleString()}</td>
                
              </tr>)
            })}
             </tbody>
            </table>
        }
        if(this.state.quizscore.length==0){
            startquizbtn=  <button onClick={this.startquiz}>Start Quiz</button>;
        }
        if(this.state.quizdescriptionopened){
            quizdescription=<div className="quiz-description">
                <div>{this.props.studentquizes.quizData[0].heading}</div>
                <p dangerouslySetInnerHTML={{__html: this.props.studentquizes.quizData[0].description}}></p>
                <p><span>Time Limit : </span>{this.props.studentquizes.quizData[0].timelimit}</p>
              {startquizbtn}
            </div>
        }
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="super-parent quiz-parent">
           <h2>Quizes</h2>
            {redirectVar}
            {quizlist}
            {quizdescription}
            {startquiz}
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
    onGetQuizes:getquizes,
    onGetQuizDetail:getquizdetail,
    onPostAnswers:postanswers
   },dispatch);
  }
  
  export default connect(mapStatetoProps,mapActionToProps)(Quiz);