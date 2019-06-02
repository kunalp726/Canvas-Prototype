import {GET_CHATS,CALL_COMPLETE} from '../actions/inboxActions';
export default function inboxReducer(state={chatList:[],userList:[]},{type,payload}){
    switch(type){
        case GET_CHATS:
        return{
            ...state,
            requestMessage:"Getting the chats..."
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