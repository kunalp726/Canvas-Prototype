import {GET_COURSE,CALL_COMPLETE} from '../../actions/student/insidebarActions';
export default function insidebarReducer(state={dataObj:{}},{type,payload}){
    switch(type){
        case GET_COURSE:
        return{
            ...state,
            requestMessage:"Getting course..."
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