import axios from 'axios';
import {rootUrl} from "../../components/helpers/urlhelper";
export const GET_PEOPLE="getpeople";
export const CALL_COMPLETE="callcompletepeople";

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
export function getpeople(obj){
    return (dispatch)=>{
            (async()=>{
                try{
                    let response=await axios.post(rootUrl+"/courses/people",obj);
                    if(response.status===200){
                        console.log(response.data);
                        dispatch(callcomplete({announcements:response.data}));
                    }
                }catch(error){
                    throw error;
                }
            })();   
    }
}
