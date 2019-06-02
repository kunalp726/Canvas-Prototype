import { gql } from 'apollo-boost';

const loginQuery=gql`
query Login($email: String, $password: String){
    login(email: $email, password: $password){
      _id,
role,
email
    }
}
`
const dashboardCoursesQuery=gql`
query DashboardCourses($id: String){
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

export { loginQuery,dashboardCoursesQuery };