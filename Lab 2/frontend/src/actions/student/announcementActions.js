import axios from 'axios';
import cookie from 'react-cookies'
import {rootUrl} from "../../components/helpers/urlhelper";
export const GET_ANNOUNCEMENTS="getannouncements";
export const MAKE_ANNOUNCEMENTS="makeannouncements";
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
export function getannouncements(obj){
    return (dispatch)=>{
            (async()=>{
                try{
                        dispatch(requestMade(GET_ANNOUNCEMENTS));
                    let response=await axios.post(rootUrl+"/courses/announcements",obj);
                    if(response.status===200){
                        dispatch(callcomplete({announcements:response.data}));
                    }
                }catch(error){
                    throw error;
                }
            })();

       
    }
}
export function makeannouncements(obj){
    return (dispatch)=>{
            (async()=>{
                try{
                        dispatch(requestMade(MAKE_ANNOUNCEMENTS));
                        let response=await axios.post(rootUrl+"/courses/createannouncements",obj);
                        if(response.status===200){
                            alert("Announcement created successfully!");
                            dispatch(callcomplete({
                                announcements:response.data
                            }));
                        }
                }catch(error){
                   console.log(error);
                }
            })();

       
    }
}