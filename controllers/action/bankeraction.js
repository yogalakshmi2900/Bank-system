const express       = require('express');
const bcrypt        = require('bcryptjs');
const Router        = express.Router();
const DB            = require('../../models/db');
const jwt           = require('jsonwebtoken');
const verifyToken   = require('../../models/tokenVerify.js');

Router.get('/userList', verifyToken, function (req, res) {
  const response = {
    status  : 0,
    message : 'Something went wrong in your code!'
  }
  if (jwt.decode(req.token)) {
    if (((new Date().getTime() + 1) / 1000) <= (jwt.decode(req.token)).exp) {
      jwt.verify(req.token, 'hidesecret', (err, authData) => {
            if (err) {
              response.status = 403;
              response.status = 'invalid user';
              res.send(response);
            } else {
      DB.GetDocument('users', {usertype:'customer'}, {}, {}, function(err, result) {
          if(err) {
              res.send(response);
          } else {
              if(result.length == 0) {
                response.status  = 2;
                response.message = 'no data found';
              } else {
                response.status  = 1;
                response.message = 'success';
                response.data    = result;
                response.count   = result.length;
              }
              res.send(response);
          }
        });
      }
    });
    }
    else{
       response.status=403;
       response.message='Token expired';
       res.send(response);
    }
  }
  else {
    response.status = 403;
    response.message = 'invalid user';
    res.send(response);
  }
});

Router.post('/viewSelectedUser', verifyToken, function (req, res) {
  const response = {
    status  : 0,
    message : 'Something went wrong in your code!'
  }
  if (jwt.decode(req.token)) {
  if (((new Date().getTime() + 1) / 1000) <= (jwt.decode(req.token)).exp) {
    jwt.verify(req.token, 'hidesecret', (err, authData) => {
          if (err) {
            response.status = 403;
            response.status = 'invalid user';
            res.send(response);
          } else {
     DB.GetOneDocument('accounts', {userid:req.body.id}, {}, {}, function(err, result) {
      if(err) {
          res.send(response);
      } else {
          response.status  = 1;
          response.message = 'success';
          response.data    = result;
          res.send(response);
        }
      });
        }
    });
}else{
   response.status=403;
   response.message='Token expired';
   res.send(response);
}
} else {
  response.status = 403;
  response.message = 'invalid user';
  res.send(response);
}
});
module.exports = Router;
