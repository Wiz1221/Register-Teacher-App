var Sequelize = require('sequelize');

var NotificationModel = ()  => {
  return sequelize.define('notifications', {
              tId: {
                type: Sequelize.INTEGER
              },
              text: {
                type: Sequelize.STRING(500)
              }
          },
          { 
              tableName: "notifications",
              timestamps: false                                          
          }
        );
};
module.exports = NotificationModel;