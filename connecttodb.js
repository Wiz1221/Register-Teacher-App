var Sequelize = require('sequelize');

const connecToDb = ( callBack ) => {
    const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
        host:  process.env.DATABASE_HOST,
        dialect: 'mysql',
        dialectOptions: {
            options: {
                encrypt: true,
            },
            requestTimeout: 30000
        },
      });
      return sequelize.authenticate().then( () => {
        console.log('Connection established successfully.');
        global.sequelize = sequelize;
        return;
        // callBack();
      }).catch(err => {
        console.error('Unable to connect to the database:', err);
      }).finally(() => {
        //sequelize.close();
      });
};

module.exports = connecToDb;