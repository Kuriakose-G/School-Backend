// 1. Importing db.
const db = require('./db');

// Import jwt token.
const jwt = require('jsonwebtoken');

// 2. Register logic.
const register = (name, secretId, username, classN, password) => {
    console.log('Inside register function');
    return db.Teacher.findOne({username}).then((response) => {
        console.log(response);

        if(response) {
            return {
                statusCode: 401,
                message: "Teacher already registered"
            }
        } else {
            const newTeacher = new db.Teacher({
                name,
                secretId,
                username,
                classN,
                password,
                position: 'teacher',
                students: []
            })
            newTeacher.save()
            return {
                statusCode: 200,
                message: "Teacher registered successfully"
            }
        }
    })
}

// 3. Login logic.
const login = (username, password) => {
    console.log('Inside login function');
    return db.Teacher.findOne({username, password}).then((result) => {
        if(result) {
            const token =jwt.sign({
                loginUser:username
            },'superkey2023')
            return {
                statusCode: 200,
                message: 'Login Successful',
                currentUser: result.name,
                token,
                currentClass: result.classN,
            }
        } else {
            return {
                statusCode: 401,
                message: "Invalid Data"
            }
        }
    })
}

//4 Adding new student
const addStudent = (studentName, studentId, name) => {
  console.log('Inside addStudent function,', name);
  return db.Teacher.findOne({ name }).then((result) => {
    if (!result) {
      return {
        statusCode: 401,
        message: "Invalid teacher name",
      };
    } else {
      // Check if student with the same ID or name already exists
      const existingStudent = result.students.find((student) => {
        return (
          student.studentName === studentName || student.studentId === studentId
        );
      });

      if (existingStudent) {
        return {
          statusCode: 400,
          message: "Student with the same ID or name already exists",
        };
      } else {
        // Find the maximum ID value among existing students
        const maxId = Math.max(...result.students.map((student) => student.id));
        const newId = maxId >= 0 ? maxId + 1 : 1; // Assign a new ID

        result.students.push({
          id: newId,
          studentName,
          studentId,
          details:[],
          marks:[]
        });
        result.save();
        return {
          statusCode: 200,
          message: "Student Added",
        };
      }
    }
  });
};

//5 Getting students
const getStudents=(username)=>{
    return db.Teacher.findOne({username}).then((result)=>{
        if(!result){
            console.log('In getStudent function result is',result);
            return{
                statusCode:401,
                message:"Invalid user"
            }
        }else{
            return{                
                statusCode:200,
                students:result.students
            }
        }
    })
}

//6 View student
const viewStudent = (id, username) => {
  return db.Teacher.findOne({ username }).then((result) => {
    if (!result) {
      return {
        statusCode: 401,
        message: "Invalid user",
      };
    } else {
      const student = result.students.find((student) => student.id === parseInt(id)); // Parse the ID to an integer
      if (!student) {
        return {
          statusCode: 404,
          message: "Student not found",
        };
      } else {
        return {
          statusCode: 200,
          student: student, // Assign the student object to the `student` variable
        };
      }
    }
  });
};

//7 Register student logic
const studentRegister = (studentName, studentId, studentUsername, studentPassword) => {
  console.log('Inside student register function');
  return db.Teacher.findOne({}).then((result) => {
    if (!result) {
      return {
        statusCode: 401,
        message: "Invalid teacher",
      };
    } else {
      const existingStudent = result.students.find(
        (student) =>
          student.studentName === studentName || student.studentId === studentId
      );
      if (!existingStudent) {
        return {
          statusCode: 401,
          message: "Student not found",
        };
      } else {
        return db.Student.findOne({ studentUsername }).then((response) => {
          if (response) {
            return {
              statusCode: 401,
              message: "Student already registered",
            };
          } else {
            const newStudent = new db.Student({
              name: studentName,
              studentId: studentId,
              username: studentUsername,
              password: studentPassword,
              position: "student",
              additionalDetails:[],
              marks: [],
            });
            newStudent.save();
            return {
              statusCode: 200,
              message: "Student registered successfully",
            };
          }
        });
      }
    }
  });
};

//8 Student login logic
const studentLogin=(username,password)=>{
  console.log('Inside student login function');
  return db.Student.findOne({username,password}).then((result)=>{
    if(result){
      const token=jwt.sign({
        loginStudent:username
      },'superkey2023')
      return{
        statusCode:200,
        message:'Login Successful',
        currentStudent:result.name,
        token
      }
    }else{
      return{
        statusCode:401,
        message:'Invalid Data'
      }
    }
  })
}

//Adding student details
const addStudentDetails = async (studentUsername, studentDetails) => {
  try {
    console.log('Inside student details function', studentUsername, studentDetails);

    const student = await db.Student.findOne({ name: studentUsername });
    if (!student) {
      console.log('Invalid student');
      return {
        statusCode: 401,
        message: "Invalid student",
      };
    }

    const existingIndex = student.additionalDetails.findIndex(
      (details) => details.someField === studentDetails.someField // Replace 'someField' with a unique field in 'studentDetails'
    );

    if (existingIndex !== -1) {
      // Details already exist, replace them
      student.additionalDetails.splice(existingIndex, 1, studentDetails);
    } else {
      // Details don't exist, add them
      student.additionalDetails.push(studentDetails);
    }

    await student.save();
    return {
      statusCode: 200,
      message: "Student details added/updated successfully",
    };
  } catch (error) {
    console.error("Error adding student details:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
};

//10 Getting student details
const getDetails = (studentUsername) => {
  console.log('Inside getdetails function', studentUsername);
  return db.Student.findOne({ name: studentUsername }).then((result) => {
    if (!result) {
      return {
        statusCode: 401,
        message: "Invalid user",
      };
    } else {
      return {
        statusCode: 200,
        details: result
      };
    }
  });
}

//Adding student marks
const addStudentMarks = (studentName, studentMark) => {
  console.log('inside addStudentMarks function', studentName, studentMark);
  return db.Student.findOne({ name: studentName }).then((result) => {
    if (!result) {
      return {
        statusCode: 401,
        message: "Did not find student name"
      };
    } else {
      const newMark = {
        semester: studentMark.semester,
        type: studentMark.type,
        number: studentMark.number,
        subject: studentMark.subject,
        mark: studentMark.mark
      };

      // Check if the mark with the same details already exists
      const isMarkAlreadyPresent = result.marks.some((existingMark) =>
        existingMark.semester === newMark.semester &&
        existingMark.type === newMark.type &&
        existingMark.number === newMark.number &&
        existingMark.subject === newMark.subject
      );

      if (isMarkAlreadyPresent) {
        return {
          statusCode: 409,
          message: "Mark with the same details already exists"
        };
      }

      result.marks.push(newMark);

      // Save the updated student document
      return result.save().then((savedResult) => {
        return {
          statusCode: 200,
          message: "Student marks added successfully",
          updatedStudent: savedResult
        };
      }).catch((error) => {
        return {
          statusCode: 500,
          message: "Error saving student marks",
          error: error.message
        };
      });
    }
  }).catch((error) => {
    return {
      statusCode: 500,
      message: "Error finding student",
      error: error.message
    };
  });
};

//Removing Students
const removeStudent = async (studentId, teacherName) => {
  console.log('inside removeStudent function',studentId, teacherName);
  try {
    // Find the teacher with the given teacherName
    const teacher = await db.Teacher.findOne({ name: teacherName });

    if (!teacher) {
      // If the teacher is not found, return an error
      return { statusCode: 404, message: 'Teacher not found' };
    }
    // Find the index of the student with the given studentId in the teacher's students array
    const studentIndex = teacher.students.findIndex((student) => student.id === studentId);

    if (studentIndex === -1) {
      // If the student with the given studentId is not found in the teacher's students array, return an error
      return { statusCode: 404, message: 'Student not found' };
    }

    // Remove the student from the teacher's students array
    teacher.students.splice(studentIndex, 1);

    // Save the updated teacher object in the database
    await teacher.save();

    return { statusCode: 200, message: 'Student removed successfully' };
  } catch (error) {
    console.error('Error removing student:', error);
    return { statusCode: 500, message: 'Internal server error' };
  }
};

module.exports = {
    register,
    login,
    addStudent,
    getStudents,
    viewStudent,
    studentRegister,
    studentLogin,
    addStudentDetails,
    getDetails,
    addStudentMarks,
    removeStudent
}