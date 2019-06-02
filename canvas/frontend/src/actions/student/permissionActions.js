import axios from 'axios';
import {rootUrl} from "../../components/helpers/urlhelper";
export const GET_CODES="getcodes";
export const CALL_COMPLETE="callcompletepermissioncodes";

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
export function getcodes(courseId){
    return (dispatch)=>{
       (async()=>{
        try{
            dispatch(requestMade(GET_CODES));
            let response=await axios.get(rootUrl+"/courses/addcodes/"+courseId);
            if(response.status===200){
                    dispatch(callcomplete({
                        announcements:response.data
                    }));
            }
            }catch(error){
             throw error;
            }
     }
        )();
    }
}
