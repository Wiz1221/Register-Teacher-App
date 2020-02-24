var Sequelize = require('sequelize');

var StudentModel = ()  => {
  return sequelize.define('students', {
              email: {
                type: Sequelize.STRING(250)
              },
              isSuspend: {
                type: Sequelize.BOOLEAN
              }
          },
          { 
              tableName: "students",              
              timestamps: false                            
          }
        );
};
module.exports = StudentModel;