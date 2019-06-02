import {CREATE_COURSES,CALL_COMPLETE} from '../actions/createcourseActions';
export default function createcourseReducer(state={courseList:[]},{type,payload}){
    switch(type){
        case CREATE_COURSES:
        return{
            ...state,
            requestMessage:"Creating the course..."
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