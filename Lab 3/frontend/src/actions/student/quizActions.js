import axios from 'axios';
import {rootUrl} from "../../components/helpers/urlhelper";
export const GET_QUIZES="getquizes";
export const POST_QUIZ="postquizes";
export const GET_QUIZDETAIL="getquizdetails";
export const CALL_COMPLETE="callcompletequizes";


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
export function getquizes(obj){
    return (dispatch)=>{
            (async()=>{
                try{
                    dispatch(requestMade(GET_QUIZES))
                    let response=await axios.post(rootUrl+"/courses/getquizestudent",obj);
                    if(response.status===200){
                            dispatch(callcomplete({ quizes:response.data}))
                    }
                }catch(error){
                    console.log(error);
                }
            })();   
    }
}
export function getquizdetail(obj){
    return (dispatch)=>{
            (async()=>{
                try {
                        dispatch(requestMade(GET_QUIZDETAIL))
                        let result=await axios.post(rootUrl+"/courses/getquizbyid",{qid:obj.qid});
                        if(result.status===200){
                            let response=await axios.post(rootUrl+"/courses/getquizscore",obj)
                            if(response.status==200){
                                dispatch(callcomplete({
                                    quizData:result.data,
                                    quizscore:response.data
                                }))
                        }
                        }
                } catch (error) {
                    console.log(error);
                }
            })();   
    }
}
export function postanswers(quizanswers,quesMap){
    return (dispatch)=>{
            (async()=>{
                try {
                    dispatch(requestMade(POST_QUIZ));
                    let result=await axios.post(rootUrl+"/courses/quizsubmission",{quizanswers,quesMap});
                    if(result.status===200){
                        alert("Quiz submitted successfully!");
                        dispatch(callcomplete({quizSubmission:1,quizSubMessage:"Quiz submitted successfully!"}))
                       
                    }      
                } catch (error) {
                    console.log(error);
                }
            })();   
    }
}
