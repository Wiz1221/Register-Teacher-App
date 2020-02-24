var Sequelize = require('sequelize');
var db = require('../connecttodb');
var TeacherModel =  require('../models/teachers');
var StudentModel =  require('../models/students');
var NotificationModel = require('../models/notifications');
var RegistrationModel = require('../models/registrations');

const Op = Sequelize.Op;

exports.register = async (req, res) => {
  try {
    await db();
    let { teacher: teacherInput, students: studentInput } = req.body;
    if (teacherInput && Array.isArray(studentInput) && studentInput.length > 0) {
      let tId = 0;
      let sIdArr = [];
      // find required teacher id or create if not in database
      await TeacherModel().findOrCreate({
        where: {email: teacherInput},
        defaults: {email: teacherInput}
      })
      .then(([teacher]) => {
        tId = teacher.get('id');
      });
      // find required student or create if not in database
      for (var i = 0; i < studentInput.length; i++) {
        await StudentModel().findOrCreate({
          where: {email: studentInput[i]},
          defaults: {email: studentInput[i], isSuspend: false}
        })
        .then(([student]) => {
          sIdArr.push(student.get('id'));
        });
      }
      // create relationship of teacher and student. use findOrCreate to prevent duplicates 
      for (var j = 0; j < sIdArr.length; j++) {
        RegistrationModel().findOrCreate({
          where: {tId: tId, sId: sIdArr[j]},
          defaults: {tId: tId, sId: sIdArr[j]}
        });
      }
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Please provide teacher or student info" });
    }
  }
  catch (err) {
    console.log('catch err', err)
    res.status(404).json({ message: `Error occured: ${err}` });
  }
}


exports.retrieveStudent = async (req, res) => {
  try {
    await db();
    if (req.query && req.query.teacher) {
      let teacherInput = typeof req.query.teacher === "string" ? [req.query.teacher] : req.query.teacher;

      let teacherIdArr = await getTeacherAll(teacherInput);
      if (teacherIdArr.length !== teacherInput.length || teacherIdArr.length === 0) {
        res.status(404).json({ message: "Teacher not registered" });
        return;
      }
      let studentIdArr = await getRegistration(teacherIdArr);
      // find common student when more than 1 teacher
      if (teacherInput.length > 1) {
        studentIdArr = findCommonStudent(teacherInput.length, studentIdArr);
      }
      let studentEmailArr = await getStudentEmailAll(studentIdArr);

      res.json({ students: studentEmailArr });
    } else {
      res.status(404).json({ message: "Please provide teacher info" });
    }
  }
  catch (err) {
    console.log('catch err', err)
    res.status(404).json({ message: `Error occured: ${err}` });
  }
}

exports.suspend = async (req, res) => {
  try {
    await db();
    let { student: studentInput } = req.body;
    if (studentInput) {
      StudentModel().update(
        { isSuspend: true },
        { where: {
            email: studentInput
          }
        });
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Please provide student info" });
    }
  }
  catch (err) {
    console.log('catch err', err)
    res.status(404).json({ message: `Error occured: ${err}` });
  }
}

exports.retrieveForNotifications = async (req, res) => {
  try {
    await db();
    let { teacher: teacherInput, notification } = req.body;
    if (teacherInput && notification) {
      let teacherId = await getTeacherAll([teacherInput]);
      // when no matching teacher in database, return error
      if (teacherId.length === 0) {
        res.status(404).json({ message: "Teacher not registered" });
        return;
      }
      // save notification to database for future expansion
      NotificationModel().create({
        tId: teacherId[0],
        text: notification
      });

      // find required student email list
      let mentionedStudent = findMentionedEmail(notification);
      let registeredStudentId = await getRegistration(teacherId);
      let registeredStudent = await getStudentEmailAll(registeredStudentId, { isSuspend: {[Op.not]: true} });

      let finalStudentList = mentionedStudent.concat(registeredStudent);
      // remove duplicates
      finalStudentList.filter((item, i) => item.indexOf(i) === i);

      res.json({ recipients: finalStudentList });
    } else {
      res.status(404).json({ message: "Please provide required info" });
    }
  }
  catch (err) {
    console.log('catch err', err)
    res.status(404).json({ message: `Error occured: ${err}` });
  }
}


getTeacherAll = (teacherEmail) => {
  let Teacher = TeacherModel();
  return Teacher.findAll({ where: {email: teacherEmail} }).then(teacher => {
    return teacher.map(item => item.get('id'));
  });
}

getStudentAll = (studentEmail, query = {}) => {
  let Student = StudentModel();
  return Student.findAll({ where: {email: studentEmail, ...query} }).then(student => {
    return student.map(item => item.get('id'));
  });
}

getStudentEmailAll = (studentId) => {
  let Student = StudentModel();
  return Student.findAll({ where: {id: studentId} }).then(student => {
    return student.map(item => item.get('email'));
  });
} 

getRegistration = (teacherId) => {
  let Registration = RegistrationModel();
  return Registration.findAll({ where: { tId: teacherId } }).then(register => {
    return register.map(item => {
      return item.get('sId');
    });
  })
}

findCommonStudent = (noOfTeacher, studentIdArr) => {
  let store = {};
  let commonStudents = [];
  studentIdArr.forEach((id,i) => {
    if (studentIdArr.indexOf(id) !== i) {
      if (store[id]) {
        store[id] ++;
      } else {
        store[id] = 1;
      }
    }
  });
  Object.keys(store).forEach((key) => {
    if (store[key] === noOfTeacher - 1) {
      commonStudents.push(key);
    }
  });
  return commonStudents;
}

findMentionedEmail = (text) => {
  let resultArr = text.match(/@(.*?).com/g)
  if (resultArr) {
    return resultArr.map(val => val.substring(1));
  }
  return [];
}

