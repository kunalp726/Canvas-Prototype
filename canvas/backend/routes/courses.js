var express=require("express");
var courses=express.Router();
var mysql = require('mysql');
var multer = require('multer');
var fs=require("fs");
// var upload = multer();
var Blob = require('blob');

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "admin",
    database:"canvasdata"
  });
  
  con.connect(function(err) {
    if (err) throw err;
 //   console.log("MySQl Connected!");
  });

const query=function(que,obj){
    return new Promise((resolve,reject)=>{
        if(obj){
         con.query(que,obj,(err,res)=>{
            if(err){
            reject(err);
            }else{
            resolve(res);
            }
          });
    }else{
        con.query(que,(err,res)=>{
            if(err){
              reject(err);
            }else{
              resolve(res);
            }
          });
    }


    });
  }
    
const errorFunc=(error,res)=>{
    console.log(error);
    res.writeHead(400,{
        'Content-Type':'text/plain'
     });
     console.log(error);
     res.end(error.toString());
}

function checkSession(req,res,next){
    if(req.session.user){
        next();    
     } else {
        res.send("Not Authorised");
     }
}

let courseList=[
    {courseId:"273",courseName:"Enterprise Distributed System",courseDepartment:"CMPE",courseDescription:"Very nice course",courseRoom:"Engg 189",courseCapacity:100,waitlistCapacity:10,courseTerm:"Spring 2019",courseFaculty:"Mesut Ozil"},
    {courseId:"281",courseName:"Cloud Technologies",courseDepartment:"CMPE",courseDescription:"good course",courseRoom:"BBC 202",courseCapacity:80,waitlistCapacity:15,courseTerm:"Spring 2019",courseFaculty:"Mesut Ozil"},
    {courseId:"283",courseName:"Virtualization Technologies",courseDepartment:"CMPE",courseDescription:"best course",courseRoom:"Clark Hall 222",courseCapacity:90,waitlistCapacity:10,courseTerm:"Spring 2019",courseFaculty:"Mesut Ozil"}
];

let announcements=[
    {header:"Github Access",
    plaintext:"Hello All,GitHub invitations have been sent for people who have signed up. Let me know if you face any difficulties.People who haven't signed up, provide your details as soon as possible.Regards,Arivoli.",
    body:"<p>Hello All,</p><p>GitHub invitations have been sent for people who have signed up.&nbsp;</p><p>Let me know if you face any difficulties.</p><p>People who haven't signed up, provide your details as soon as possible.</p><p>&nbsp;</p><p>Regards,</p><p>Arivoli.</p>",author:"Arivoli"},
    {header:"Short Announcement",
    plaintext:"Hello All,GitHub invitations have been sent for people who have signed up. Let me know if you face any difficulties.People who haven't signed up, provide your details as soon as possible.Regards,Arivoli.",
    body:"<p>Hello All,</p><p>GitHub invitations have been sent for people who have signed up.&nbsp;</p><p>Let me know if you face any difficulties.</p><p>People who haven't signed up, provide your details as soon as possible.</p><p>&nbsp;</p><p>Regards,</p><p>Arivoli.</p>",author:"Arivoli"}
];
let assignments=[
    {header:"Lab #1 : Canvas" , 
    plaintext:"Hello All,GitHub invitations have been sent for people who have signed up. Let me know if you face any difficulties.People who haven't signed up, provide your details as soon as possible.Regards,Arivoli.",

    body:"<p>Hello All,</p><p>GitHub invitations have been sent for people who have signed up.&nbsp;</p><p>Let me know if you face any difficulties.</p><p>People who haven't signed up, provide your details as soon as possible.</p><p>&nbsp;</p><p>Regards,</p><p>Arivoli.</p>",
     due:"26 Feb by 23:00",points:5 , available:"27 Feb at 23:00"},
    {header:"Lab #2 : Canvas with kafka" , 
    plaintext:"Hello All,GitHub invitations have been sent for people who have signed up. Let me know if you face any difficulties.People who haven't signed up, provide your details as soon as possible.Regards,Arivoli.",
    body:"<p>Hello All,</p><p>GitHub invitations have been sent for people who have signed up.&nbsp;</p><p>Let me know if you face any difficulties.</p><p>People who haven't signed up, provide your details as soon as possible.</p><p>&nbsp;</p><p>Regards,</p><p>Arivoli.</p>",
     due:"26 Feb by 23:00",points:5 , available:"27 Feb at 23:00"}
];
let grades=[
    {header:"Lab #1 : Canvas" , body:"Objectives: This lab assignment is designed to enable students to gain some hands-on experience on Amazon’s EC2. Each student is required to work on this laboratory assignment individually and submit your deliverables into Canvas.",
    due:"26 Feb by 23:00",status:"submitted",score:4,points:5 , available:"27 Feb at 23:00"},
   {header:"Lab #2 : Canvas with kafka" , body:"Objectives: This lab assignment is designed to enable students to gain some hands-on experience on Amazon’s EC2. Each student is required to work on this laboratory assignment individually and submit your deliverables into Canvas.",
    due:"26 Feb by 23:00",status:"submitted",score:3,points:5 , available:"27 Feb at 23:00"}
];

let people=[
    {name:"aaron",courseTerm:"Spring 2019",courseDepartment:"CMPE",courseId:"281",role:"student"},
    {name:"mesut",courseTerm:"Spring 2019",courseDepartment:"CMPE",courseId:"281",role:"student"},
    {name:"Alex",courseTerm:"Spring 2019",courseDepartment:"CMPE",courseId:"281",role:"student"},
    {name:"Lacazette",courseTerm:"Spring 2019",courseDepartment:"CMPE",courseId:"281",role:"Teacher"},
    {name:"Aubameyang",courseTerm:"Spring 2019",courseDepartment:"CMPE",courseId:"281",role:"student"}
];

courses.post("/removestudent",(req,res)=>{
   try {
       let {uid,cid}=req.body;
       console.log("uid"+uid);
       console.log("cid"+cid);
        (async()=>{
            let sql=`DELETE FROM Enrollment WHERE uid=${uid} AND cid=${cid}`
            await query(sql);
            res.status=200;
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({message:"Student was dropped from the course !"}));
        })(); 
    }catch(error){
        this.errorFunc(error,res);
    }
});
courses.post("/createquiz",(req,res)=>{
    let {header,bodyText,timelimit,due,availablefrom,availableto,assignto,questionlist}=req.body;
    console.log(header);
    console.log(bodyText);
    console.log(timelimit);
    console.log(due);
    console.log(assignto);
    console.log(availablefrom);
    console.log(availableto);
    console.log(questionlist);
    (async()=>{
        try {
            let sql=`INSERT INTO Quiz SET ?`;
           // console.log("cid"+cid);
            let result=await query(sql,{
               heading:header,
               description:bodyText,
               posted:new Date().toJSON(),
               cid:assignto,
               due,
               availablefrom,
               availableto,
               timelimit,
               published:0,
               points:questionlist.length
            });
            //console.log(result);
            let qid=result.insertId;
            questionlistobj=questionlist.map((data)=>{
                let obj=[data.question,data.correctanswer,qid];
                return obj;
            });

            sql=`INSERT INTO Question (question,answer,qid) VALUES ?`;
             result=await query(sql,[questionlistobj]);
            console.log("Almost done");
            console.log(result);
            let quesid=result.insertId;

            let optionslistobj=[];
            questionlist.forEach((data)=>{
                optionslistobj.push([data.correctanswer,quesid]);
                optionslistobj.push([data.option2,quesid]);
                optionslistobj.push([data.option3,quesid]);
                optionslistobj.push([data.option4,quesid]);
                quesid++;
            });

            sql=`INSERT INTO Options (optionText,quesid) VALUES ?`;
            result=await query(sql,[optionslistobj]);
            console.log(result);
            res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({message:"Questions inserted!"}));
        } catch (error) {
            // this.errorFunc(error);
            console.log("In Error")
            console.log(error);
        }
    })();
    
});
courses.post("/getquizes",(req,res)=>{
    let {cid}=req.body;
    (async()=>{
        try {
            let sql=`SELECT * FROM Quiz WHERE cid=${cid}`;
        let result=await query(sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result));
        } catch (error) {
            console.log(error);
        }
    })();
});

courses.post("/getquizestudent",(req,res)=>{
    let {cid}=req.body;
    (async()=>{
        try {
        let sql=`SELECT * FROM Quiz WHERE cid=${cid} AND published=${1}`;
        let result=await query(sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result));
        } catch (error) {
            console.log(error);
        }
    })();
});
courses.post("/getquizscore",(req,res)=>{
    let {qid,uid}=req.body;
    (async()=>{
        try {
        let sql=``;
        if(qid==0){
            sql=`SELECT q.heading AS header,q.*,g.* FROM Quiz AS q,Quizgrades AS g WHERE q.qid=g.qid AND g.uid=${uid}`;
        }else{
        sql=`SELECT * FROM Quiz AS q,Quizgrades AS g WHERE q.qid=g.qid AND g.qid=${qid} AND g.uid=${uid}`;
        }
        let result=await query(sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result));
        } catch (error) {
            console.log(error);
        }
    })();
});

courses.post("/getquizbyid",(req,res)=>{
    let {qid}=req.body;
    (async()=>{
        try {
        let sql=`SELECT * FROM Quiz AS q,Question AS s,Options AS o WHERE q.qid=s.qid AND s.quesid=o.quesid AND q.qid=${qid}`;
        let result=await query(sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result));
        } catch (error) {
            console.log(error);
        }
    })();
});

courses.post("/updateprofile",(req,res)=>{
    let {uid,name,phoneNumber,profileImage,aboutMe,city,country,school,hometown,languages,gender}=req.body;
    console.log("body is :");
    console.log(req.body);
  //  console.log(uid);
    console.log("files is :");
    console.log(req.files.file);

    (async()=>{
       try{ 
           var post  = {profileImage: req.files.file.data,name,phoneNumber,aboutMe,city,country,school,hometown,languages,gender};
    //    let sql=`UPDATE Users SET name=${name}, profileImage=${req.files.file.data} WHERE uid=${uid}`;
    //    console.log(sql);
    let sql=`UPDATE Users SET ? WHERE uid=${uid}`;
       await query(sql,post);
       res.status=200;
       res.setHeader("Content-Type", "application/json");
       res.send(JSON.stringify({message:"Profile Updated !"}));
    }catch(error){
        console.log(error);
    }
       })();

});

courses.get("/getprofilebyid/:id",(req,res)=>{
    let {id}=req.params;
    console.log(id);
    (async()=>{
        try {
        let sql=`SELECT uid,name,phoneNumber,profileImage,aboutMe,city,country,school,hometown,languages,gender FROM Users WHERE uid=${id}`;
     
        let result=await query(sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result));
        } catch (error) {
            console.log(error);
        }
    })();
});

courses.post("/quizsubmission",(req,res)=>{
    let {quizanswers,quesMap}=req.body;
    let qid=quizanswers[0][2];
    let uid=quizanswers[0][3];
    //console.log(quesMap);
    (async()=>{
        try {
            let score=0;
            quizanswers.forEach((data)=>{

                console.log(data[1]);
                console.log(quesMap[data[0]][0].answer);
                if(data[1]==quesMap[data[0]][0].answer){
                    score++;
                }
            });
            console.log(score);
           let sql=`INSERT INTO Quizsubmission (quesid,answer,qid,uid) VALUES ?`;
            result=await query(sql,[quizanswers]);

            sql=`INSERT INTO Quizgrades (qid,uid,grades) VALUES (${qid},${uid},${score})`;
            await query(sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({message:"Quiz submitted successfully!"}));
        } catch (error) {
            console.log(error);
        }
    })();
});

courses.post("/createannouncements",(req,res)=>{
   try{ 
    let{email:uid,courseId:cid,bodyText,plainText,headerText:header}=req.body;
    (async()=>{
        let sql=`INSERT INTO Announcement SET ?`;
        console.log("cid"+cid);
        await con.query(sql,{
           header,
           bodyText,
           plainText,
           posted:new Date().toJSON(),
           cid,
           uid 
        });
        let sqlafter=`SELECT * FROM Announcement WHERE cid=${cid}`;
        let result=await query(sqlafter);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result));
    })();
}catch(error){
    this.errorFunc(error,res);
}
   
});

courses.post("/createassignments",(req,res)=>{
    let{courseId:cid,bodyText,plainText,headerText:header,due,available,points}=req.body;
    let obj={
        header,
        bodyText,
        due,
        available,
        points,
        plainText,
        posted:new Date().toJSON(),
        cid
    }
    try {
   (async()=>{ 
            let sql=`INSERT INTO Assignments SET ?`;
            await con.query(sql,obj);
            res.status=200;
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({message:"Assignment posted successfully !"}));
        })();
         } catch (error) {
            this.errorFunc(error,res);
    }
  
});

courses.post("/people",(req,res)=>{
   try{
        let {email:uid,courseId:cid,courseDepartment}=req.body;
    (async ()=>{
        let sql=`SELECT E.*,U.*,C.courseDepartment,C.courseTerm,C.courseId FROM Enrollment AS E,Users AS U,Course AS C WHERE E.uid=U.uid AND C.cid=E.cid AND E.cid=${cid}`;
        let result=await query(sql);
        let sql2=`SELECT * FROM Users AS U,Course AS C WHERE C.cid=${cid} AND U.uid=C.uid`;
        let result2=await query(sql2);
        result=result.concat(result2);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result));
    })();
    }catch(error){
        this.errorFunc(error,res);
    }
});

courses.post("/grades",(req,res)=>{
    let {uid,cid}=req.body;
    (async()=>{
        try {
            let sql=`SELECT * FROM Assignments AS A , Submission AS S WHERE A.aid=S.aid AND A.cid=${cid} AND S.uid=${uid}`;
            let response=await query(sql);
            res.status=200;
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        } catch (error) {
            this.errorFunc(error,res)
        }
    })();
});

courses.post('/upload', (req, res) => {
   try { let uploadFile = req.files;
        
        let {uid,aid}=req.body;
        (async()=>{
            let sql=`SELECT sid FROM Submission WHERE uid=${uid} AND aid=${aid}`;
            let result=await query(sql);
            let sid=null;
            if(result.length!=0){
            sid=result[0].sid;
            }
            if(sid){
                sql=`DELETE FROM SubmissionFile WHERE sid=${sid}`;
                await query(sql);
                  let fileArray=[];
                for(let x in uploadFile){
                    let {data:file,name:filename}=uploadFile[x];
                    let obj=[file,filename,sid];
                    fileArray.push(obj);
                }
                sql=`INSERT INTO SubmissionFile (file,filename,sid) VALUES ?`;
                console.log(fileArray);
                await con.query(sql,[fileArray]);

            }else{
                let obj={grades:null,uid,aid};
                sql=`INSERT INTO Submission SET ?`;
                let result=await query(sql,obj);
                let id=result.insertId;
                // console.log(result.insertId);
                let fileArray=[];
                for(let x in uploadFile){
                    let {data:file,name:filename}=uploadFile[x];
                    let obj=[file,filename,id];
                    fileArray.push(obj);
                }
                sql=`INSERT INTO SubmissionFile (file,filename,sid) VALUES ?`;
                console.log(fileArray);
                await con.query(sql,[fileArray]);
            }
        })();
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({message:"File Uploaded Successfully"}));
    }catch(error){
        console.log("hello");
        console.log(error);
        this.errorFunc(error);
    }
  })
  
courses.post("/assignments",(req,res)=>{
   try{
    let {email,courseId:cid,courseDepartment}=req.body;
    (async()=>{
        let sql=`SELECT * FROM Assignments WHERE cid=${cid}`;
        let result=await query(sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result));
    })();
  
    }catch(error){
        this.errorFunc(error,res);
    }
});

courses.post("/publishquiz",(req,res)=>{
   try{
    let {qid}=req.body;
    (async()=>{
        let sql=`UPDATE Quiz SET published=${1} WHERE qid=${qid}`;
        let result=await query(sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({message:"Quiz Published"}));
    })();
  
    }catch(error){
        this.errorFunc(error,res);
    }
});
courses.post("/announcements",(req,res)=>{
   try{
        let {courseId:cid}=req.body;    
    //get announcements based on the above criteria
    (async()=>{
        let sqlafter=`SELECT * FROM Announcement WHERE cid=${cid}`;
        let result=await query(sqlafter);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result));
    })();
    }catch(error){
        this.errorFunc(error,res);
    }
});

//home dashboard courses

courses.post("/",(req,res)=>{
  
    let {role,email:uid}=req.body;

    (async()=>{

        if(role=="faculty"){
            let sql=`SELECT * FROM Course WHERE uid=${uid}`;
            try {
                let result=await query(sql);
                res.status=200;
                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify(result));

            } catch (error) {
                errorFunc(error,res);
            }
        }else{
            let sql=`SELECT * FROM Course AS c,Enrollment AS e,Users AS u WHERE c.cid=e.cid AND c.uid=u.uid AND e.uid=${uid}`;
            try {
                let result=await query(sql);
                res.status=200;
                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify(result));

            } catch (error) {
                errorFunc(error,res);
            }
        }

    })();
})
courses.post("/getsubmissionfiles",(req,res)=>{
  (async()=>{  try {
        let {uid,aid} = req.body;
        let sql=`SELECT * FROM Submission AS S,SubmissionFile AS F WHERE S.sid=F.sid AND S.uid=${uid} AND S.aid=${aid}`;
        console.log(sql);
        let response=await query(sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(response));
    } catch (error) {
        this.errorFunc(error,res);
    }
    }
    )();
});
courses.post("/submitgrade",(req,res)=>{
    
    (async()=>{
        try {
            let {sid,grades}=req.body;
            let sql=`UPDATE Submission SET grades=${grades} WHERE sid=${sid}`;
            console.log(sql);   
            let response=await query(sql);
            res.status=200;
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
         } catch (error) {
             // this.errorFunc(error,res);
             console.log(error);
         }
    
    })();
});
courses.post("/getsubmissionbyid",(req,res)=>{
    (async()=>{
        try {
           let {aid,uid}=req.body;
           let sql=`SELECT * FROM Submission AS S,SubmissionFile AS U WHERE S.sid=U.sid AND S.aid=${aid} AND S.uid=${uid}`;
           console.log(sql);   
           let response=await query(sql);
           res.status=200;
           res.setHeader("Content-Type", "application/json");
           res.send(JSON.stringify(response));
        } catch (error) {
            // this.errorFunc(error,res);
            console.log(error);
        }
   
       })();
});
courses.post("/assignSubmitted",(req,res)=>{
    (async()=>{
     try {
        let {aid}=req.body;
        let sql=`SELECT U.name,S.grades,S.uid,S.aid FROM Submission AS S,Users AS U WHERE S.uid=U.uid AND S.aid=${aid}`;
        console.log(sql);   
        let response=await query(sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(response));
     } catch (error) {
         this.errorFunc(error);
     }

    })();
});

courses.post("/drop",(req,res)=>{
    
    (async()=>{
        try {
            let data={
                status:0,
                message:"You have successfully dropped the class !"
            };
            let {email:uid,courseId:cid}=req.body;
            console.log(`SELECT * FROM Enrollment WHERE cid=${cid} AND uid=${uid}`);
            let result=await query(`SELECT * FROM Enrollment WHERE cid=${cid} AND uid=${uid}`);
            let status=result[0].status;
            let response=await query(`SELECT * FROM Course WHERE cid=${cid}`);
            let course=response[0];
            let {currEnrollment,currWaitlist}=response[0];
            if(result[0].status=="Enrolled"){
                await query(`UPDATE Course SET currEnrollment=${course.currEnrollment+1} WHERE cid=${cid}`);
            }else{
                await query(`UPDATE Course SET currWaitlist="${course.currWaitlist-1}" WHERE cid=${cid}`);
            }
                await query(`DELETE FROM Enrollment WHERE cid=${cid} AND uid=${uid}`);
            //insert course enrollment data
            res.status=200;
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(data));
        } catch (error) {
            errorFunc(error,res);
        }
    })();
});
courses.post("/enroll",(req,res)=>{
       
    (async()=>{

        let {email:uid,courseId:cid}=req.body;
       
        let iniCheck=`SELECT * FROM Enrollment WHERE cid=${cid} AND uid=${uid}`;
        try {
            let data={
                status:0,
                message:""
            };

            let response=await query(iniCheck);
            if(response.length!=0){
                data.message="You are already enrolled/waitlisted for this class !"
            }else{
            let sql=`SELECT * FROM Course WHERE cid=${cid}`;
            let result=await query(sql);
            let course=result[0];
            if(course.courseCapacity==course.currEnrollment){
                if(course.waitlistCapacity==course.currWaitlist){
                    //class is full
                    data.message="Class is full. Please try enrolling for another class";
                }else{
                    //can waitlist
                    let sql=`INSERT INTO Enrollment VALUES ("Waitlist",${uid},${cid})`;
                    await query(`UPDATE Course SET currWaitlist="${course.currWaitlist+1}" WHERE cid=${cid}`);
                    let result=await query(sql);
                    data.message="You have been wailisted for this course!";
                }
            }else{
                //can enroll
                let sql=`INSERT INTO Enrollment VALUES ("Enrolled",${uid},${cid});`;
                let result=await query(sql);
                await query(`UPDATE Course SET currEnrollment=${course.currEnrollment+1} WHERE cid=${cid}`);
                data.message="You have been Enrolled in this course!"
               
            }
        }
            res.status=200;
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(data));
        } catch (error) {
            console.log(error);
           // errorFunc(error,res);
        }
        


        })();
    
});
courses.get("/getcourse/:id",(req,res)=>{
    (async()=>{
        try {
            let result=await query(`SELECT * FROM Course WHERE cid=${req.params.id}`);
            res.status=200;
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(result));
        } catch (error) {
            errorFunc(error,res);
        }
    })();
});

courses.post("/search",(req,res)=>{
(async()=>{
    let searchTerm=req.body.selectedOption;
    let searchValue=req.body[searchTerm];
    console.log(searchTerm)
    console.log(searchValue)
    if(searchTerm==="courseId"){
        let {filterOption,courseId}=req.body;
        if(courseId === ""){
            courseId=0;
        }
        let results=[];
        let sql="";
        let sql1="SELECT * FROM Course,Users WHERE Course.uid=Users.uid AND";
       switch(filterOption){
           case ">": 
            // results=courseList.filter((data)=>{
            //     return data.courseId>=req.body.courseId;
            // })
            sql=` courseId>${courseId}`;
           break;
           case "<":
        //    results=courseList.filter((data)=>{
        //     return data.courseId<=req.body.courseId;
        // })
        sql=` courseId<${courseId}`;
           break;
           case "=":
        //    results=courseList.filter((data)=>{
        //     return data.courseId==req.body.courseId;
        // })
        sql=` courseId=${courseId}`;
           break;
       }
       try {
        let result=await query(sql1+sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result));
       } catch (error) {
           errorFunc(error,res);
       }
       
    }else{
        let results=courseList.filter((data)=>{
            return data[searchTerm]==searchValue;
        })
        let sql=`SELECT * FROM Course,Users WHERE Course.uid=Users.uid AND ${searchTerm}="${searchValue}"`;
        console.log(sql);
        let result=await query(sql);
        res.status=200;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(result));
    }
})();
});

//create a course 

courses.post("/create",(req,res)=>{

    console.log("inside create courses");
   
    (async()=>{


    let {courseId,courseName,courseDepartment,courseDescription,courseRoom,courseCapacity,waitlistCapacity,courseTerm,uid}=req.body;
    let sql=`SELECT * FROM Course WHERE courseId="${courseId}" AND courseDepartment="${courseDepartment}" AND courseTerm="${courseTerm.toUpperCase()}"`
    try {
        console.log(sql);
        let result =await query(sql);
        if(result.length==0){
            let sqlInsert=`INSERT INTO Course(courseId,courseName,courseDepartment,courseDescription,courseRoom,courseCapacity,waitlistCapacity,courseTerm,uid,
                currEnrollment,currWaitlist) VALUES ("${courseId}","${courseName}","${courseDepartment.toUpperCase()}","${courseDescription}","${courseRoom}",${courseCapacity},
                ${waitlistCapacity},"${courseTerm}",${uid},0,0)`;
                console.log(sqlInsert);
            let response=await query(sqlInsert);
            res.status=200;
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({message:"Course created successfully!"}));
        }else{
            res.status=200;
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({message:"Course Id Already Exists"}));
        }
    } catch (error) {
        errorFunc(error,res);
    }

    })();
  

});

courses.get("/addcodes/:cid",(req,res)=>{
    let cid=req.params.cid;
    (async()=>{
        try {
            let sql=`SELECT * FROM PermissionCode AS p WHERE p.cid=${cid}`;
            let result=await query(sql);
            console.log(result);
            res.status=200;
            res.setHeader("Content-Type","application/json");
            res.send(JSON.stringify(result));
        } catch (error) {
            errorFunc(error,res);
        }
    })();
});
courses.post("/addcodeenroll",(req,res)=>{
    let {email:uid,code}=req.body;
    let data={
        status:0,
        message:""
    };
    (async()=>{
        try {
            let sql=`SELECT * FROM PermissionCode where code=${code}`;
            let result=await query(sql);
            let {used,cid}=result[0];
            if(used==1){
                data.message="The Add code has already been used";
            }else{
            let iniCheck=`SELECT * FROM Enrollment WHERE cid=${cid} AND uid=${uid}`;
            let response=await query(iniCheck);
            if(response.length!=0){
                data.message="You are already enrolled/waitlisted for this class !"
            }else{
                //can enroll
                let sql=`INSERT INTO Enrollment VALUES ("Enrolled",${uid},${cid});`;
                let result=await query(sql);
                 await query(`UPDATE PermissionCode SET used=${1},uid=${uid} WHERE code=${code}`);
                data.message="Congratulations ! You are now enrolled in this course!"
               
            }
        }
        
            res.status=200;
            res.setHeader("Content-Type","application/json");
            res.send(JSON.stringify(data));

           
        } catch (error) {
            errorFunc(error,res);
        }
    })();
});

courses.post("/addcodes",(req,res)=>{
    let {cid}=req.body;
    (async()=>{
        try {
            let sql=`SELECT code FROM PermissionCode where cid=${cid}`;
            let result=await query(sql);
            console.log(result);
            let randomNum=0;
            let index=0;
            while(index!=-1){
                randomNum=Math.floor(100000 + Math.random() * 900000);
                index=result.indexOf(randomNum);
            }
            sql=`INSERT INTO PermissionCode VALUES (${randomNum},${0},${cid},null)`;
            await query(sql);
            res.status=200;
            res.setHeader("Content-Type","application/json");
            res.send(JSON.stringify({message:"Add Code Generated"}));

        } catch (error) {
            errorFunc(error,res);
        }
    })();
});
courses.post('/lecfiles', (req, res) => { 
    let uploadFile = req.files.file;
     let fileName = req.files.file.name;
     let {cid}=req.body;
     (async()=>{
     var post  = {file: uploadFile.data, filename: fileName,posted:new Date().toJSON(),cid:cid};
    await con.query('INSERT INTO LectureFiles SET ?', post)
    })();
    res.status=200;
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({message:"File Uploaded Successfully"}));

  })

  courses.get('/lecfiles/:cid', (req, res) => { 
     let cid=req.params.cid;
     (async()=>{
        //var post  = {file: uploadFile.data, filename: 'Hello MySQL',posted:"",cid:cid};
    let result=await query("SELECT * FROM `LectureFiles` WHERE cid="+cid);
    res.status=200;
    res.setHeader("Content-Type", "application/json");
   res.send(JSON.stringify(result));
})();

  })
  
module.exports=courses;