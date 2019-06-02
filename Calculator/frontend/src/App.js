import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";

class App extends Component {

  constructor(props){
    super(props);

    this.state={
      num1:0,
      num2:0,
      result:""
    };

  }
  calculate=(operation)=>{

    if(operation=="divide"){
      if (this.state.num2==0){
        alert("The divisor cannot be zero");
        return;
      }
    }
    let url="http://localhost:3001/"+operation;
   (async()=>{
    let {num1,num2}=this.state;
    try {
      let result=await axios.post(url,{num1,num2});
      if(result.status==200){
        this.setState({
          result:result.data.result
        });
      }
    } catch (error) {
      
    }
   })();
  }
  changeHandlerCommon=(property,e)=>{

    let value=0;
    if(e.target.value==""){
      value=0;
    }else{ 
        value=(Number)(e.target.value);
    }
    this.setState({
      [property]:value,
      result:""
    });
  }
  render() {
    let resultVar=null;
    if(this.state.result!=""){
      resultVar=<div>The result is: {this.state.result}</div>
    }
    return (
      <div className="App">
     <header>Calculator</header>
     <div className="action-parent">
     <div><span>Enter First Number</span><input onChange={(e)=>{this.changeHandlerCommon("num1",e)}} required type="number" placeholder="Number 1"></input></div>
     <div><span>Enter Second Number</span><input onChange={(e)=>{this.changeHandlerCommon("num2",e)}} required type="number" placeholder="Number 2"></input></div>
     {resultVar}
     <div className="btn-parent"><button onClick={()=>{this.calculate("add")}}>Add</button><button onClick={()=>{this.calculate("multiply")}}>Multiply</button></div>
     <div className="btn-parent"><button onClick={()=>{this.calculate("subtract")}}>Subtract</button><button onClick={()=>{this.calculate("divide")}}>Divide</button></div>
     </div>
      </div>
    );
  }
}

export default App;
