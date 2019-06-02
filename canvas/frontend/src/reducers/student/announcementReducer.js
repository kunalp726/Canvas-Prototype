import {GET_ANNOUNCEMENTS,MAKE_ANNOUNCEMENTS,CALL_COMPLETE} from '../../actions/student/announcementActions';
export default function announcementReducer(state={announcements:[]},{type,payload}){
    switch(type){
        case GET_ANNOUNCEMENTS:
        return{
            ...state,
            requestMessage:"Getting announcements..."
        }
        case MAKE_ANNOUNCEMENTS:
        return{
            ...state,
            requestMessage:"Making announcements..."
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