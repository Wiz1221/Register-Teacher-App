var Sequelize = require('sequelize');

var RegistrationModel = ()  => {
  return sequelize.define('registrations', {
              tId: {
                type: Sequelize.INTEGER
              },
              sId: {
                type: Sequelize.INTEGER
              }
          },
          { 
              tableName: "registrations",
              timestamps: false                                                        
          }
        );
};
module.exports = RegistrationModel;