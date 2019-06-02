import loginReducer from './loginReducer';
import homeReducer from './homeReducer';
import inboxReducer from './inboxReducer';
import createcourseReducer from './createcourseReducer';
import searchcourseReducer from './searchcourseReducer';
import profileReducer from './profileReducer';
import signupReducer from './signupReducer';
import navbarReducer from './navbarReducer';
import announcementReducer from './student/announcementReducer';
import assignmentReducer from './student/assignmentReducer';
import gradeReducer from './student/gradeReducer';
import quizReducer from './student/quizReducer';
import peopleReducer from './student/peopleReducer';
import permissionReducer from './student/permissionReducer';
import fileReducer from './student/fileReducer';
import insidebarReducer from './student/insidebarReducer';
import {combineReducers} from 'redux';
import {LOGOUT_USER} from "../actions/loginActions";
const rootReducers=combineReducers({
    login:loginReducer,
    signup:signupReducer,
    profile:profileReducer,
    home:homeReducer,
    navbar:navbarReducer,
    studentannouncement:announcementReducer,
    studentassignment:assignmentReducer,
    studentinsidebar:insidebarReducer,
    studentgrades:gradeReducer,
    studentquizes:quizReducer,
    studentpeople:peopleReducer,
    studentfiles:fileReducer,
    studentpermission:permissionReducer,
    createcourse:createcourseReducer,
    searchcourse:searchcourseReducer,
    studentinbox:inboxReducer
});

const allReducers = (state, action) => {
    if (action.type === LOGOUT_USER) {
      state = undefined
    } 
  
    return rootReducers(state, action);
}

export default allReducers;