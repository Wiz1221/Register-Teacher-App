# Ufinity-Teacher-App

### Requirements

This application require the following to run:

* [Node.js](https://nodejs.org/) v4+
* MySQL

### Setting up environment

Install the dependencies and devDependencies and start the server.

For backend: 
```sh
$ git clone https://github.com/Wiz1221/Ufinity-Teacher-App.git
$ cd Ufinity-Teacher-App
$ npm install
$ npm start
```

### Setting up database

Please import the file database.sql into MySql

### Setting up data

If you do not have the database set up for the application, you may run the following requests first.

This will register the teachers to the database for testing purposes.

```sh
POST
url: http://localhost:8000/api/register
body: 
{
   "teacher": "teacherken@gmail.com",
   "students":
      [
        "studentjon@example.com",
        "studenthon@example.com",
        "studentbob@example.com"
      ]
}
```

```sh
POST
url: http://localhost:8000/api/register
body: 
{
	"teacher": "teacherjoe@gmail.com",
	"students":
	  [
	    "studentjon@example.com",
	    "studentpek@example.com"
	  ]
}
```

### Running Unit Tests

```sh
$ npm test
```
