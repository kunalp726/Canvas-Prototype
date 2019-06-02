import {GET_FILES,CALL_COMPLETE} from '../../actions/student/fileActions';
export default function fileReducer(state={announcements:[],files:[]},{type,payload}){
    switch(type){
        case GET_FILES:
        return{
            ...state,
            requestMessage:"Getting files..."
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