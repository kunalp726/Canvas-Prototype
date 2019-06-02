import axios from 'axios';
import {rootUrl} from "../components/helpers/urlhelper";
export const GET_COURSES="getcourseshome";
export const CALL_COMPLETE="callcompletehome";

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
export function getcourses(data){
    return (dispatch)=>{

        (async()=>{
            try{
                dispatch(requestMade(GET_COURSES));
                let response=await axios.post(rootUrl+"/courses",data);
                if(response.status===200){
                        // this.setState({
                        //     courseList:response.data
                        // });
                        dispatch(callcomplete({courseList:response.data}));
                }
            }catch(error){
                throw error;
            }
        })();
       
    }
}