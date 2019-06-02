import axios from 'axios';
import cookie from 'react-cookies'
import {rootUrl} from "../../components/helpers/urlhelper";
export const GET_COURSE="getcourse";
export const CALL_COMPLETE="callcompleteannouncement";


export function callcomplete(obj){
    return {
        type:CALL_COMPLETE,
        payload:obj
    }
}
export function requestMade(data){
    return {
        type:data,
        payload:""
    }
}
export function getcourse(dataObj){
    return (dispatch)=>{
            (async()=>{
                try {
                    dispatch(requestMade(GET_COURSE));
                    let result=await axios.get(rootUrl+"/courses/getcourse/"+dataObj.cid);
                    if(result.status===200){
                      let {courseDepartment,courseId,courseName,courseTerm}=result.data[0];
                      dispatch(callcomplete({
                        courseDepartment,
                        courseId,
                        courseName,
                        courseTerm,
                        dataObj:{...dataObj,courseId,courseDepartment,courseName,courseTerm,cid:dataObj.cid}
                      }));
                    }
                  } catch (error) {
                      console.log(error);
                  }
            })();

       
    }
}