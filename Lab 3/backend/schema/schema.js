const graphql = require('graphql');
const _ = require('lodash');
var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const cidMutator = function (result) {
    let copy = JSON.parse(JSON.stringify(result));
    copy.cid = result._id;
    return copy;
}

mongoose.Promise = global.Promise;
//Set up default mongoose connection
var mongoDB = 'mongodb+srv://canvasUser:189293Kp@canvascluster-wpxt5.mongodb.net/canvas?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var { userModel, courseModel } = require("../models/models");
//get all mongoDB Data
let users = [];
let courses = [];
(async () => {
    users = await userModel.find({})
        .populate({ path: 'waitlistcourses', populate: { path: "uid", select: ["firstName", "lastName"] } })
        .populate({ path: 'courses', populate: { path: "uid", select: ["firstName", "lastName"] } })
        .exec();
    courses = courseModel.find({}).populate({ path: "uid", select: "name" }).exec();
})(users, courses);

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
        _id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        email: { type: GraphQLString },
        lastName: { type: GraphQLString },
        password: { type: GraphQLString },
        gender: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        city: { type: GraphQLString },
        country: { type: GraphQLString },
        school: { type: GraphQLString },
        aboutMe: { type: GraphQLString },
        hometown: { type: GraphQLString },
        languages: { type: GraphQLString },
        role: { type: GraphQLString }
    })
});
const courseType = new GraphQLObjectType({
    name: 'course',
    fields: () => ({
        _id: { type: GraphQLID },
        courseId: { type: GraphQLInt },
        courseTerm: { type: GraphQLString },
        courseDepartment: { type: GraphQLString },
        courseName: { type: GraphQLString },
        courseDescription: { type: GraphQLString },
        courseRoom: { type: GraphQLString },
        courseCapacity: { type: GraphQLString },
        waitlistCapacity: { type: GraphQLString },
        currEnrollment: { type: GraphQLString },
        currWaitlist: { type: GraphQLString },
        cid: { type: GraphQLString },
        uid: { type: UserType }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args, context) {
                let result = _.find(users, { email: args.email });
                try {
                    let { req, res } = context;
                    let { email, password } = args;
                    let data = null;
                    // console.log(args);
                    if (!result) {
                        data = {
                            loginSuccess: 0,
                            message: "Email or Password Incorrect"
                        };
                    } else {
                        const match = await bcrypt.compare(password, result.password);
                        if (match) {
                            var userOne = {
                                email: result.email
                            };
                            var token = jwt.sign(userOne, "There is no substitute for hardwork", {
                                expiresIn: 10080 // in seconds
                            });
                            data = {
                                loginSuccess: 1,
                                message: "Login Successfull!",
                                token: 'JWT ' + token
                            };
                            context.res.cookie('cookie', JSON.stringify({ email: result._id, role: result.role, token: 'JWT ' + token }), { maxAge: 900000000, httpOnly: false, path: '/' });
                        } else {

                            data = { loginSuccess: 0, message: "Email or Password Incorrect" };
                        }
                    }
                    console.log(res);
                    return result;
                } catch (error) {
                    console.log(error);
                }
            }
        },
        dashboardCourses: {
            type: new GraphQLList(courseType),
            args: {
                id: { type: GraphQLString },
            },
            resolve(parent, args) {
                console.log(args.id);
                let obj = _.find(users, { id: args.id });
                console.log("users");
                console.log(JSON.stringify(obj));
                let courseArray = [...obj.courses, ...obj.waitlistcourses];
                courseArray = courseArray.map((data) => {
                    let obj = cidMutator(data);
                    obj.status = "Enrolled";
                    obj.name = obj.uid.name;
                    return obj;
                })
                return courseArray;
            }
        },

    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                role: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let { email, password, firstName, lastName, role } = args;
                try {
                    let responseOne = _.find(users, { email });
                    if (responseOne) {
                        var body = {
                            message: "Signup failed! Email already exists",
                            insertStatus: 0
                        };
                        console.log("here");
                        return false;

                    } else {
                        let hash = await bcrypt.hash(password, saltRounds);
                        var user = new userModel({ email, password: hash, firstName, lastName, role });
                        let response = await user.save();
                        console.log("user saved");
                        console.log(response);
                        var body = {
                            message: "Sign up successfull. Redirecting to Login Page...",
                            insertStatus: 1
                        };
                        console.log(user);
                        console.log(response);
                        return response;
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
        profileUpdate: {
            type: UserType,
            args: {
                uid: { type: GraphQLString },
                lastName: { type: GraphQLString },
                firstName: { type: GraphQLString },
                aboutMe: { type: GraphQLString },
                hometown: { type: GraphQLString },
                city: { type: GraphQLString },
                country: { type: GraphQLString },
                school: { type: GraphQLString },
                languages: { type: GraphQLString },
                gender: { type: GraphQLString },
                phoneNumber: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let { uid, firstName, lastName, phoneNumber, aboutMe, city, country, school, hometown, languages, gender } = args;
                try {
                    var post = { firstName, lastName, phoneNumber, aboutMe, city, country, school, hometown, languages, gender };
                    console.log(post);
                    let result = await userModel.findOneAndUpdate({ _id: uid }, { $set: { ...post } });
                    console.log(result);
                    return result;
                } catch (error) {
                    console.log(error);
                }

            }
        },
        addCourse: {
            type: courseType,
            args: {
                uid: { type: GraphQLString },
                courseId: { type: GraphQLString },
                courseName: { type: GraphQLString },
                courseDepartment: { type: GraphQLString },
                courseDescription: { type: GraphQLString },
                courseRoom: { type: GraphQLString },
                courseTerm: { type: GraphQLString },
                courseCapacity: { type: GraphQLString },
                waitlistCapacity: { type: GraphQLString },
            },
            async resolve(parent, args) {

                try {
                    console.log(args);
                    console.log("here");
                    let { courseId, courseName, courseDepartment, courseDescription, courseRoom, courseCapacity, waitlistCapacity, courseTerm, uid } = args;
                    let result = await courseModel.findOne({ courseId: courseId });
                    if (result) {
                        return false;
                    } else {
                        let newcourse = new courseModel({
                            courseId, courseName, courseDepartment, courseDescription, courseRoom, courseCapacity, waitlistCapacity, courseTerm, uid,
                            currEnrollment: 0,
                            currWaitlist: 0
                        });
                        let result2 = await newcourse.save();
                        let { _id: courseid } = result2;
                        let result3 = await userModel.update(
                            { _id: uid },
                            { $push: { courses: courseid } }
                        );
                        return result2;
                    }
                } catch (error) {
                    console.log(error);
                }


            }
        }

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});