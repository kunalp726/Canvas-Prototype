import axios from 'axios';
import {rootUrl} from "../components/helpers/urlhelper";
export const SEARCH_COURSES="createcourse";
export const CALL_COMPLETE="callcompletesearchcourse";

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
export function searchcourse(data){
    return (dispatch)=>{

        (async()=>{
           
        })();
       
    }
}