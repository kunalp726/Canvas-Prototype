import {GET_ASSIGNMENTS,UPLOAD_FILE,GET_SUBMISSION_LIST,GET_SUBMISSION,CALL_COMPLETE} from '../../actions/student/assignmentActions';
export default function assignmentReducer(state={announcements:[],submissionFiles:[],submittedFiles:[],people:[]},{type,payload}){
    switch(type){
        case GET_ASSIGNMENTS:
        return{
            ...state,
            requestMessage:"Getting assignments..."
        }
        case GET_SUBMISSION:
        return{
            ...state,
            requestMessage:"Getting submissions..."
        }
        case GET_SUBMISSION_LIST:
        return{
            ...state,
            requestMessage:"Getting submission list..."
        }
        case UPLOAD_FILE:
        return{
            ...state,
            requestMessage:"Uploading Files..."
        }
        case CALL_COMPLETE:
        return{
            ...state,
            ...payload
        }
        default:
        return state;
    }
}