import axios from 'axios';
import {rootUrl} from "../../components/helpers/urlhelper";
export const GET_GRADES="getgrades";
export const CALL_COMPLETE="callcompletegrades";


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
export function getgrades(obj){
    return (dispatch)=>{
            (async()=>{
                try{
                    let response=await axios.post(rootUrl+"/courses/grades",obj);
                    if(response.status===200){
                        dispatch(requestMade(GET_GRADES));
                        let data=[...response.data];
                      //  let result=await axios.post(rootUrl+"/courses/getquizscore",{uid:obj.uid,qid:0,cid:obj.cid});
                      //  if(result.status===200){
                      //      data=[...data,...result.data];
                           
                            dispatch(callcomplete({announcements:data}));
                     //   }
                    }
                }catch(error){
                    throw error;
                }
            })();   
    }
}
