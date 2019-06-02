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
import {getcourses,changeListOrder} from '../../actions/homeActions';
import arrayMove from 'array-move';


import announcementSVG from "../images/announcements.svg"
// import profileSVG from "../images/dashboard.svg"
import assignmentSVG from "../images/assignments.svg"
import filesSVG from "../images/files.svg"

const SortableItem = SortableElement(({data,index}) => {
 let colors=["#0b9be3","#324a4d","#d41e00","#06A3B7","#009606"]
 let style={backgroundColor:data.color,
  height:"130px",width:"100%"};
  let fontstyle={
      color:data.color
  }
    let courseTerm=data.courseTerm.toLowerCase().indexOf("spring")>-1?"SP":"FALL";
      let year=data.courseTerm.split(" ")[1].substr(-2);
      let link="/courses/"+data.cid;
      let assignLink=`/courses/${data.cid}/assignments`;
      let annLink=`/courses/${data.cid}/announcements`;
      let filesLink=`/courses/${data.cid}/files`;
    return (<div className="dashboard-card"><Link to={link} key={data.link} >
      <div className="card-upper" style={style}></div>
      <div className="desc-parent">
      <div style={fontstyle} className="card-desc"><span>{courseTerm+year} : </span><span>{data.courseDepartment} </span><span>{data.courseId} - </span><span>{data.courseName}</span></div>
      <div className="card-desc-two"><span>{courseTerm+year} : </span><span>{data.courseDepartment} </span><span>{data.courseId} - </span><span>{data.courseName}</span></div>
      <div className="courseterm">{data.courseTerm}</div>
      </div>
      </Link>
      <div className="actions-parent">
      <div><span><Link to={annLink}><SVG src={announcementSVG}></SVG></Link></span><span>
      <Link to={assignLink}><SVG src={assignmentSVG}></SVG></Link></span><span>
      <Link to={filesLink}><SVG src={filesSVG}></SVG></Link></span></div>
   </div>
    </div>)

});

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem  key={`item-${index}`} index={index} data={value} />
      ))}
    </ul>
  );
});

class Home extends Component{
    constructor(props){
        super(props)
        this.state={
            courseList:[],
            colors:["#0b9be3","#324a4d","#d41e00","#06A3B7","#009606"]
        };
    }
async componentDidMount(){
   let data=cookie.load("cookie");
   this.props.onGetCourses(data);
}
onSortEnd = ({oldIndex, newIndex}) => {
  // this.setState(({items}) => ({
  //   items: arrayMove(items, oldIndex, newIndex),
  // }));
  var items=this.props.home.courseList;
  let newOrder=arrayMove(items,oldIndex,newIndex);
  this.props.onchangeListOrder(newOrder);
  console.log(oldIndex);
  console.log(newIndex);

};

    render(){
        let redirectVar=null;
        console.log(cookie.load("cookie"));
        if(!cookie.load("cookie")){
            redirectVar=<Redirect to="/login"/>
        }
        return(
            <div className="home-dashboard">
                <div>{redirectVar}</div>
               
               <h2>Dashboard</h2>
               <div>
                  <SortableList axis={"xy"} pressDelay={100} items={this.props.home.courseList} onSortEnd={this.onSortEnd} />
              {this.props.home.courseList.map((data,index)=>{
                 })}
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
    onGetCourses:getcourses,
    onchangeListOrder:changeListOrder
   },dispatch);
  }
  
export default connect(mapStatetoProps,mapActionToProps)(Home);
