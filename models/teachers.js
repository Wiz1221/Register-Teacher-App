var Sequelize = require('sequelize');

var TeacherModel = ()  => {
  const teacher = sequelize.define('teachers', {
              email: {
                type: Sequelize.STRING(250)
              }
          },
          { 
              tableName: "teachers",
              timestamps: false                            
          }
        );
  return teacher == null ? null : teacher;
};
module.exports = TeacherModel;