import {GET_QUIZES,GET_QUIZDETAIL,POST_QUIZ,CALL_COMPLETE} from '../../actions/student/quizActions';
export default function quizReducer(state={quizes:[],quizData:[{}]},{type,payload}){
    switch(type){
        case GET_QUIZES:
        return{
            ...state,
            requestMessage:"Getting quizes..."
        }
        case GET_QUIZDETAIL:
        return{
            ...state,
            requestMessage:"Getting quiz details..."
        }
        case POST_QUIZ:
        return{
            ...state,
            requestMessage:"Posting quizes..."
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