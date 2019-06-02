
import { gql } from 'apollo-boost';

const loginMutation=gql`
mutation Login($email: String, $password: String){
    login(email: $email, password: $password){
      _id,
role,
email
    }
}
`
const signupMutation=gql`
    mutation Signup($email: String, $password: String,$firstName:String,$lastName:String,$role:String){
        signup(email: $email, password: $password,firstName:$firstName,lastName:$lastName,role:$role){
        _id,
        role,
        email
        }
    }
`
const addCourse=gql`
    mutation AdCcourse($uid:String,$courseId: String, $courseName: String,$courseTerm:String,$courseDepartment:String,$courseDescription:String,$courseRoom:String,
        $courseCapacity:String,$waitlistCapacity:String){
        addCourse(uid:$uid,courseId: $courseId,courseTerm:$courseTerm, courseName: $courseName,courseDepartment:$courseDepartment,courseDescription:$courseDescription,
            courseRoom:$courseRoom,courseCapacity:$courseCapacity,waitlistCapacity:$waitlistCapacity){
       _id
        }
    }
`
const updateProfileMutation=gql`
    mutation ProfileUpdate($uid:String,$firstName:String,
        $lastName:String,$gender:String,$phoneNumber:String,$aboutMe:String,$hometown:String,$languages:String,$city:String,$country:String,$school:String){
        profileUpdate(uid:$uid,firstName:$firstName,lastName:$lastName,gender:$gender,phoneNumber:$phoneNumber,aboutMe:$aboutMe, 
            hometown:$hometown,languages:$languages,city:$city,country:$country,school:$school){
        _id,
        role,
        email,
        firstName,
        lastName,
        aboutMe,
        phoneNumber,
        languages,
        hometown,
        gender,
        city,
        country,
        school
        }
    }
`
const dashboardCourses=gql`
mutation DashboardCourses($id: String){
    dashboardCourses(id: $id){
    _id,
    courseName,
    cid,
    courseId,
  courseTerm,
  courseDepartment,
  courseName,
  courseDescription,
  courseRoom,
  courseCapacity,
  waitlistCapacity,
  currEnrollment,
  currWaitlist,
  uid{
      firstName,
      lastName
  }
    }
}
`

export {addCourse,dashboardCourses,loginMutation,signupMutation,updateProfileMutation};