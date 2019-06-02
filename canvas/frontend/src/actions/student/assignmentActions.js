import axios from 'axios';
import {rootUrl} from "../../components/helpers/urlhelper";
export const GET_ASSIGNMENTS="getassignments";
export const CREATE_ASSIGNMENT="createassignment";
export const GET_SUBMISSION="getsubmission";
export const GET_SUBMISSION_LIST="getsubmissionlist";
export const UPLOAD_FILE="uploadfile";
export const SUBMISSION_BY_ID="submissionbyid";
export const SUBMIT_GRADE="submitgrade";
export const CALL_COMPLETE="callcompleteassignments";


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
export function getassignments(obj){
    return (dispatch)=>{
            (async()=>{
                try{
                    dispatch(requestMade(GET_ASSIGNMENTS));
                    let response=await axios.post(rootUrl+"/courses/assignments",obj);
                    if(response.status===200){
                            dispatch(callcomplete({
                                announcements:response.data
                            }));
                    }
                }catch(error){
                    throw error;
                }
            })();

       
    }
}
export function getsubmission(obj){
    return (dispatch)=>{
            (async()=>{
                try {
                    dispatch(requestMade(GET_SUBMISSION));
                    let response=await axios.post(rootUrl+'/courses/getsubmissionfiles',obj);
                    if(response.status==200){
                        dispatch(callcomplete({submittedFiles:response.data}));
                        console.log(response.data);
                    }
                } catch (error) {
                    console.log(error);
                }
            })();

       
    }
}
export function handleUpload(data){
    return (dispatch)=>{
            (async()=>{
                try {
                    dispatch(requestMade(UPLOAD_FILE));
                    let response= await axios.post(rootUrl+"/courses/upload", data);
                    if(response.status==200){
                        
                     alert("File Uploaded Successfully!");
                     dispatch(callcomplete({fileUploadMessage:"File Uploaded Successfully",file:""}));
                     let obj={
                         aid:data.get("aid"),
                         uid:data.get("uid")
                     }
                     dispatch(getsubmission(obj));
                    }
                   
                } catch (error) {
                    throw error;
                } 
            })();

       
    }
}
export function selectassignment(obj){
    return (dispatch)=>{
            (async()=>{
                try {
                    dispatch(requestMade(GET_SUBMISSION_LIST));
                    let response=await axios.post(rootUrl+"/courses/assignSubmitted",obj);
                    if(response.status==200){
                        dispatch(callcomplete({
                            people:response.data
                        }));
                    }
        
                } catch (error) {
                    console.log(error);
                }
            })();

       
    }
}
export function submissionbyid(obj){
    return (dispatch)=>{
            (async()=>{
                try {
                    dispatch(requestMade(SUBMISSION_BY_ID));
                    let response=await axios.post(rootUrl+"/courses/getsubmissionbyid",obj);
                    if(response.status===200){
                        dispatch(callcomplete({
                            submissionFiles:response.data,
                            grades:response.data[0].grades!=null?response.data[0].grades:0  
                        }));
                    }
                    
                } catch (error) {
                    console.log(error);
                }
            })();  
    }
}
export function createassignment(obj){
    return (dispatch)=>{
            (async()=>{
                try {
                    dispatch(requestMade(CREATE_ASSIGNMENT));
                    let response=await axios.post(rootUrl+"/courses/createassignments",obj);
                    if(response.status===200){
                       alert("Assignment created successfully!")
                    }
                   
                } catch (error) {
                    console.log(error);
                }
            })();  
    }
}
export function submitgrade(obj){
    return (dispatch)=>{
            (async()=>{
                try {
                    dispatch(requestMade(SUBMIT_GRADE));
                    let response=await axios.post(rootUrl+"/courses/submitgrade",obj);
                    if(response.status===200){
                        alert("Grade posted successfully");
                        dispatch(submissionbyid(obj.uid,obj.onLoadSuccessaid));
                    }
                } catch (error) {
                    console.log(error);
                }
            })();  
    }
}