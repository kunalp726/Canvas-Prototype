import {GET_PEOPLE,CALL_COMPLETE} from '../../actions/student/peopleActions';
export default function peopleReducer(state={announcements:[]},{type,payload}){
    switch(type){
        case GET_PEOPLE:
        return{
            ...state,
            requestMessage:"Getting people enrolled..."
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