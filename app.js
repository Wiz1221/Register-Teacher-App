var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');

/* import routes to make them available to app */
var routes = require('./routes/route.js');

const app = express();

// Configure .env path
dotenv.load({path: '.env'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/api', routes);

/*
* Port setup
*/
app.set('port', process.env.PORT || 8888);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:' + app.get('port')); 
});