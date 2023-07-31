//1 Importing mongoose
const mongoose=require('mongoose')

//2 Defining connection string
mongoose.connect('mongodb://localhost:27017/School')

//3Creating model and schema
const Teacher=mongoose.model('Teacher',{
    name:String,
    secretId:String,
    username:String,
    classN:Number,
    password:String,
    position:String,
    students:[]
})

const Student=mongoose.model('Student',{
    name:String,
    studentId:String,
    username:String,
    password:String,
    position:String,
    additionalDetails:[],
    marks:[]
})

//4 Exporting models
module.exports={
    Teacher,
    Student
}