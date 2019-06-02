import {GET_CODES,CALL_COMPLETE} from '../../actions/student/permissionActions';
export default function permissionReducer(state={announcements:[],files:[]},{type,payload}){
    switch(type){
        case GET_CODES:
        return{
            ...state,
            requestMessage:"Getting codes..."
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