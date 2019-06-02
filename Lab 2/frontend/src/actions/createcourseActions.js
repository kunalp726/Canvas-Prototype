import axios from 'axios';
import {rootUrl} from "../components/helpers/urlhelper";
export const CREATE_COURSES="createcourse";
export const CALL_COMPLETE="callcompletecreatecourse";

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
export function createcourse(data){
    return (dispatch)=>{

        (async()=>{
            try{
                let response=await axios.post(rootUrl+"/courses/create",data)
                if(response.status===200){
                dispatch(callcomplete({createstatus:response.data.createstatus,message:response.data.message}));
                alert(response.data.message);
                }
              }catch(error){
                throw error;
              }
        })();
       
    }
}