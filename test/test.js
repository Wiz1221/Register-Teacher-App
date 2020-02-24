var expect  = require('chai').expect;
var request = require('request');

describe ('Register', function() {
  it('test eg1', function(done) {
    var registerSample = {
       "teacher": "teacherken@gmail.com",
       "students":
          [
            "studentjon@example.com",
            "studenthon@example.com",
            "studentbob@example.com"
          ]
    };
    request.post({
      headers: {'content-type' : 'application/json'},
      url: 'http://localhost:8000/api/register',
      body: JSON.stringify(registerSample)
    }, (error, response, body) => {
        expect(response.statusCode).to.equal(204);
        done();
    });
  });
  it('test eg2', function(done) {
    var registerSample = {
       "teacher": "teacherjoe@gmail.com",
       "students":
          [
            "studentjon@example.com",
            "studentpek@example.com"
          ]
      };
      request.post({
        headers: {'content-type' : 'application/json'},
        url: 'http://localhost:8000/api/register',
        body: JSON.stringify(registerSample)
      }, (error, response, body) => {
          expect(response.statusCode).to.equal(204);
          done();
      });
  });
});

describe ('Retrieve common student', function() {
  it('test eg1', function(done) {
    var sample = '?teacher=teacherken%40gmail.com';
    var expectedResult = {
     "students" :
       [
        "studentjon@example.com",
        "studenthon@example.com",
        "studentbob@example.com",
       ]
    };
    request.get(`http://localhost:8000/api/commonstudents${sample}`, (error, response, body) => {
        expect(body).to.equal(JSON.stringify(expectedResult));
        done();
    });
  });
  it('test eg2', function(done) {
    var sample = '?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com';
    var expectedResult = {
      "students" :
      [
        "studentjon@example.com"
      ]
    };
    request.get(`http://localhost:8000/api/commonstudents${sample}`, (error, response, body) => {
        expect(body).to.equal(JSON.stringify(expectedResult));
        done();
    });
  });
});

describe ('Suspend', function() {
  it('test eg1', function(done) {
    var sample = {
     "student" : "studentmary@gmail.com"
    };
    request.post({
      headers: {'content-type' : 'application/json'},
      url: 'http://localhost:8000/api/suspend',
      body: JSON.stringify(sample)
    }, (error, response, body) => {
        expect(response.statusCode).to.equal(204);
        done();
    });
  });
});

describe ('Retrieve student list for notification', function() {
  it('test eg1', function(done) {
    var sample = {
     "teacher": "teacherken@gmail.com",
     "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"
    };
    var expectedResult = {
     "recipients":
       [
         "studentagnes@example.com",
         "studentmiche@example.com",
         "studentjon@example.com",
         "studenthon@example.com",
         "studentbob@example.com",
       ]
    };
    request.post({
      headers: {'content-type' : 'application/json'},
      url: 'http://localhost:8000/api/retrievefornotifications',
      body: JSON.stringify(sample)
    }, (error, response, body) => {
        expect(body).to.equal(JSON.stringify(expectedResult));
        done();
    });
  });
  it('test eg2', function(done) {
    var sample = {
     "teacher": "teacherken@gmail.com",
     "notification": "Hey everybody"
    };
    var expectedResult = {
     "recipients":
       [
        "studentjon@example.com",
        "studenthon@example.com",
        "studentbob@example.com",
       ]
    };
    request.post({
      headers: {'content-type' : 'application/json'},
      url: 'http://localhost:8000/api/retrievefornotifications',
      body: JSON.stringify(sample)
    }, (error, response, body) => {
        expect(body).to.equal(JSON.stringify(expectedResult));
        done();
    });
  });
});