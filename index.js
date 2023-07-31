//1. Importing Express
const express=require('express');

//2.
const server=express();

//3. Setup port for server
server.listen(5000,()=>{
    console.log('server listening to the port 5000');
});

//4. Importing cors
const cors=require('cors');

//5. Use cors in server app
server.use(cors({
    origin:'http://localhost:4200'
}))

//6. Parse json data to js in server app
server.use(express.json());

//7 Import logic
const logic=require('./services/logic')

// import jwt token
const jwt=require('jsonwebtoken')

// Router specific middleware
const routerMiddleware=(req,res,next)=>{
    console.log('Router specific middleware');
    try{
        const token=req.headers['verify-token'];
        const data=jwt.verify(token,'superkey2023')
        console.log(data);
        req.teacherName = data.loginUser;
        req.studentUsername = data.loginStudent;
        next()
    }
    catch{
        res.status(404).json({message:'please login first'})
    }
}

//8. Register
server.post('/register',(req,res)=>{
    console.log('Inside register');
    console.log(req,res);
    logic.register(req.body.name,req.body.secretId,req.body.username,req.body.classN,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result);//Send to the client
    })
})

//9. Login
server.post('/login',(req,res)=>{
    console.log('Inside login api');
    console.log(req.body);
    logic.login(req.body.username,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//10. Add Student
server.post('/addstudent',routerMiddleware,(req,res)=>{
    console.log('Inside add student api');
    // const studentName=req.body.studentName;
    // const studentId=req.body.stydentId;
    logic.addStudent(req.body.studentName,req.body.studentId,req.body.teacherName).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//11. Getting students
server.get('/teacher-dashboard/students',routerMiddleware,(req,res)=>{
    console.log('Inside get students api');
    logic.getStudents(req.teacherName).then((result)=>{
        console.log(result);
        res.status(result.statusCode).json(result) 
    })
})

//12. Viewing student
server.get('/teacher-dashboard/students/:id',routerMiddleware,(req,res)=>{
    console.log('inside view student api');
    logic.viewStudent(req.params.id,req.teacherName).then((result)=>{
        res.status(result.statusCode).json(result)  
    })
})

//13. Student register
server.post('/studentRegister',(req,res)=>{
    console.log('inside student register api');
    logic.studentRegister(req.body.studentName,req.body.studentId,req.body.studentUsername,req.body.studentPassword).then((result) => {
      res.status(result.statusCode).json(result);
    })
})

//14. Student Login
server.post('/studentLogin',(req,res)=>{
    console.log('Inside student login api');
    logic.studentLogin(req.body.studentUsername,req.body.studentPassword).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//15. Adding student details
server.post('/studentDetails', routerMiddleware, (req, res) => {
    console.log('Inside add student details api',req.body);
    // const { studentUsername, studentId, studentDetails } = req.body;  
    logic.addStudentDetails(req.body.studentUsername,req.body.studentDetails).then((result) => {
      res.status(result.statusCode).json(result);
    });
  });

//16. Getting student details
server.get('/studentDashboard/getDetails',routerMiddleware, (req,res)=>{
    console.log('inside get details api',req.query.studentUsername);
    logic.getDetails(req.query.studentUsername).then((result)=>{
        res.status(result.statusCode).json(result)  
    })
})

//17. Adding student marks
server.post('/teacherDashboard/addStudentMarks',routerMiddleware,(req,res)=>{
    console.log('Inside add student marks api',req.body);
    logic.addStudentMarks(req.body.studentName,req.body.studentMark).then((result)=>{
        res.status(result.statusCode).json(result);
    })
})

//18. Removing student
server.delete('/teacher-dashboard/students', routerMiddleware, (req, res) => {
    const studentId = req.body.id;
    const teacherName = req.body.teacherName;
    console.log('Inside remove student api', studentId, teacherName);
    logic.removeStudent(studentId, teacherName).then((result) => {
      res.status(result.statusCode).json(result);
    });
  });