import {SEARCH_COURSES,CALL_COMPLETE} from '../actions/searchcourseActions';
export default function searchcourseReducer(state={courseList:[]},{type,payload}){
    switch(type){
        case SEARCH_COURSES:
        return{
            ...state,
            requestMessage:"Searching the courses..."
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