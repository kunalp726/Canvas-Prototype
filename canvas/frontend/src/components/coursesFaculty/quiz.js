import React, { Component } from 'react';
import axios from "axios";
import {rootUrl} from "../helpers/urlhelper";
import {Redirect} from "react-router";
import cookie from 'react-cookies';
import ReactQuill from 'react-quill';
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
            announcements:[],
            bodyText:"",
            plainText:"",
            addquestion:0,
            questionlist:[],
            detailsClicked:1,
            header:"",
            assignto:0,
            quizList:[]
        };
        this.handleChange=this.handleChange.bind(this);
        this.changeHandlerCommon=this.changeHandlerCommon.bind(this);
        this.startupFunc=this.startupFunc.bind(this);
       
    }
    addquestionshow=()=>{
        this.setState({addquestion:1});
    }
    addquestion=()=>{
        let {question,correctanswer,option4,option2,option3,questionlist}=this.state;
        let obj={
            question,correctanswer,option2,option3,option4
        };
        questionlist.push(obj);
        this.setState({
            questionlist,
            addquestion:0,
            question:"",
            correctanswer:"",
            option2:"",
            option3:"",
            option4:""
        });
        console.log(questionlist);
    }
startupFunc(){
    (async()=>{try{
        let {email:uid}=this.state;
        const obj={
           uid
        }
        let result=await axios.post(rootUrl+"/courses",cookie.load("cookie"));
        if(result.status===200){

            let response=await axios.post(rootUrl+"/courses/getquizes",{cid:this.state.courseId});
            if(response.status===200){
                this.setState({
                    quizList:response.data,
                    announcements:result.data,
                    assignto:result.data[0].cid
                });
            }
        }


       

      //  console.log(result.data);
    }catch(error){
        throw error;
    }
    })();
}
 componentDidMount(){
    this.startupFunc();
}
changeHandlerCommon(property,e){
    this.setState({
      [property]:e.target.value
    })
}
changeDisplay=(option)=>{
    if(option==="details"){
        this.setState({detailsClicked:1});
    }else{
        this.setState({detailsClicked:0});
    }
   
   
}
publishQuiz=(qid)=>{
    (async()=>{
        let result=await axios.post(rootUrl+"/courses/publishquiz",{qid});
        if(result.status===200){
            alert("Quiz published!");
            this.startupFunc();
        }
    })();
}
createquiz=()=>{
    let obj={...this.state};
    (async()=>{
        let result=await axios.post(rootUrl+"/courses/createquiz",obj);
        if(result.status===200){
            alert("Quiz created!");
           
        }
    })();
}
handleChange(content, delta, source, editor) {
    const text = editor.getText(content);
    this.setState({ bodyText: content ,
    plainText:text})
  }
    render(){
        let redirectVar=null;
        let addquestion=null;
        let details=null;
        let questionClicked=null;
        if(this.state.detailsClicked){
            details= <div>
          
            <form onSubmit={this.submit}>
            <div><input required placeholder="header" value={this.state.header} type="text" required onChange={(e)=>{this.changeHandlerCommon("header",e)}}></input></div>
            <ReactQuill value={this.state.bodyText} onChange={this.handleChange} />
            <div><span>Time Limit : </span><input value={this.state.timelimit} type="number" required onChange={(e)=>{this.changeHandlerCommon("timelimit",e)}}></input><span>Minutes</span></div>
            {/* <div><span>Time Limit : </span><input type="number" onChange={(e)=>{"timelimit",e}}></input><span>Minutes</span></div> */}
            <div><span>Assign to : </span><select value={this.state.assignto} required onChange={(e)=>{this.changeHandlerCommon("assignto",e)}}>
            {this.state.announcements.map((data,index)=>{
              return  <option key={index} value={data.cid}>
                {data.courseDepartment} {data.courseId}-{data.courseName}-{data.courseTerm}
                </option>
            })}
            </select>
         <div><label>Due : </label><input value={this.state.due} required type="datetime-local" onChange={(e)=>{this.changeHandlerCommon("due",e)}} placeholder="Due"></input> </div>
         <div><label>Available From: </label><input value={this.state.availablefrom} required type="datetime-local" onChange={(e)=>{this.changeHandlerCommon("availablefrom",e)}} placeholder="Available"></input> </div>
         <div><label>Available To: </label><input value={this.state.availableto} required type="datetime-local" onChange={(e)=>{this.changeHandlerCommon("availableto",e)}} placeholder="Available"></input> </div>
            </div>
            </form>

        </div>
        }
        if(this.state.addquestion){
            addquestion=<div>
                <form onSubmit={this.addquestion}>
                <div><span>Question</span><input required type="text" onChange={(e)=>{this.changeHandlerCommon("question",e)}}></input></div>
                <div><span>Correct Answer</span><input required type="text" onChange={(e)=>{this.changeHandlerCommon("correctanswer",e)}}></input></div>
                <div><span>Possible Answer</span><input required type="text" onChange={(e)=>{this.changeHandlerCommon("option2",e)}}></input></div>
                <div><span>Possible Answer</span><input required type="text" onChange={(e)=>{this.changeHandlerCommon("option3",e)}}></input></div>
                <div><span>Possible Answer</span><input required  type="text" onChange={(e)=>{this.changeHandlerCommon("option4",e)}}></input></div>
                <div><input type="submit" value="Add a question"></input></div>
                </form>
            </div>
        }
        if(!this.state.detailsClicked){
            questionClicked=    <div>
            <div className="add-question" onClick={this.addquestionshow}>+ Add a question</div>
            {addquestion}
        </div>
        }
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="super-parent search-parent quiz-page">
            <h3>Created Quizes</h3>
                 <table>
                     <thead>
                      <tr>
                       <td>Quiz Name </td>
                       <td>Published</td>
                       <td></td>
                       </tr>
                       </thead>
                 <tbody>
            {
                this.state.quizList.map((data,index)=>{
                   return (<tr>
                       <td>{data.heading}</td>
                       <td>{data.published}</td>
                       <td><button onClick={()=>{this.publishQuiz(data.qid)}}>Publish</button></td>
                   </tr>)
                })
            }
            </tbody>
            </table>
    <hr></hr>
    <div className="quiz-menu">
        <span className={this.state.detailsClicked==1?"active":""} onClick={()=>{this.changeDisplay("details")}}>Details</span>
             <span className={this.state.detailsClicked==0?"active":""} onClick={()=>{this.changeDisplay("questions")}}>
                Questions
            </span>
            </div>
            {details}
            {questionClicked}
            <button onClick={this.createquiz}>Create Quiz</button>
            {/* <table>
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
    onGetQuizes:getquizes,
    onGetQuizDetail:getquizdetail,
    onPostAnswers:postanswers
   },dispatch);
  }
  
  export default connect(mapStatetoProps,mapActionToProps)(Quiz);