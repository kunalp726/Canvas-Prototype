import {GET_GRADES,CALL_COMPLETE} from '../../actions/student/gradeActions';
export default function gradeReducer(state={announcements:[]},{type,payload}){
    switch(type){
        case GET_GRADES:
        return{
            ...state,
            requestMessage:"Getting grades..."
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