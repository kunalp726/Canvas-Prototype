import axios from 'axios';
import {rootUrl} from "../components/helpers/urlhelper";
export const GET_CHATS="getchatsinbox";
export const GET_USERS="getusers";
export const CALL_COMPLETE="callcompleteinbox";


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

export function getChats(data){
    return (dispatch)=>{

        (async()=>{
            try{
                dispatch(requestMade(GET_USERS));
                let response=await axios.post(rootUrl+"/courses/getchats",data);
                if(response.status===200){ 
                        dispatch(callcomplete({chatList:response.data}));
                }
            }catch(error){
                throw error;
            }
        })();
       
    }
}
export function getAllUsers(){
    return (dispatch)=>{

        (async()=>{
            try{
                dispatch(requestMade(GET_CHATS));
                let response=await axios.get(rootUrl+"/courses/getallusers");
                if(response.status===200){ 
                        dispatch(callcomplete({userList:response.data}));
                        
                }
            }catch(error){
                throw error;
            }
        })();
       
    }
}
export function postmessage(obj){
    return (dispatch)=>{

        (async()=>{
            try{
                dispatch(requestMade(GET_CHATS));
                let response=await axios.post(rootUrl+"/courses/message",obj);
                if(response.status===200){ 
                        dispatch(callcomplete({message:"Message posted successfully!"}));
                        // alert("message sent");
                        dispatch(getChats({uid:obj.uid}));
                }
            }catch(error){
                throw error;
            }
        })();
       
    }
}