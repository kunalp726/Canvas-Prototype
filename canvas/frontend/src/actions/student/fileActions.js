import axios from 'axios';
import {rootUrl} from "../../components/helpers/urlhelper";
export const GET_FILES="getfiles";
export const CALL_COMPLETE="callcompletefiles";

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
export function getfiles(courseId){
    return (dispatch)=>{
       (async()=>{ try {
            let response= await axios.get(rootUrl+"/courses/lecfiles/"+courseId);
            if(response.status==200){
             console.log(response.data);
             dispatch(callcomplete({files:response.data}))
            }
        } catch (error) {
            console.log(error);
        }  })();
    }
}
