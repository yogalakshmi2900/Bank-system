const express       = require('express');
const bcrypt        = require('bcryptjs');
const Router        = express.Router();
const DB            = require('../../models/db');
const jwt           = require('jsonwebtoken');
const verifyToken   = require('../../models/tokenVerify.js');
const async         = require("async");

Router.get('/userTransactionDetails', verifyToken, function (req, res) {
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
      DB.GetOneDocument('accounts', {userid: req.body.id}, {}, {}, function(err, result) {
          if(err) {
              res.send(response);
          } else {
              if(result.length == 0) {
                response.status  = 2;
                response.message = 'no data found';
              } else {
                response.status  = 1;
                response.message = 'success';
                response.data    = result.transactiondetails;
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

Router.post('/transactionOption', verifyToken ,function(req,res) {
  req.checkBody('option', ' option(either withdraw or deposit) is required.').notEmpty();
  req.checkBody('amount', 'amount is required.').notEmpty();
  req.checkBody('id', 'id is required.').notEmpty();
  var errors = req.validationErrors();
  var balanceAmount;
  if (errors) {
    return res.status(422).json({ errors: errors});
  }
  const response = {
    status  : 0,
    message : 'Something went wrong in your code!'
  }
  if(jwt.decode(req.token)){
    if(((new Date().getTime() + 1)/1000)<=(jwt.decode(req.token)).exp){
        jwt.verify(req.token,'hidesecret',(err,authData)=>{
          const transactiondetails = {
            transactiondetails : {
              transactiontype : req.body.option,
              amount          : req.body.amount
            }
          }
          const formdata = {
            transactiondetails : {
              transactiontype : req.body.option,
              amount          : req.body.amount
            },
            userid             : req.body.id
          }
          async.parallel([
            function(callback) {
              DB.GetOneDocument('users', {_id:req.body.id},{},{},function(err, usersresult) {
                callback(null, usersresult);
              })
            },
            function(callback) {
              DB.GetOneDocument('accounts', {userid:req.body.id},{},{},function(err, usersresult) {
                callback(null, usersresult);
              })
            },
          ],
            function(err, results) {
             const result = {
               results1                : results[0],
               results2                : results[1],
             }

             var balanceAmount = result.results1.balanceAmount;
             if(req.body.option == 'withdraw'){
               if(parseInt(balanceAmount)>=parseInt(req.body.amount)){
                 balanceAmount=parseInt(balanceAmount)-parseInt(req.body.amount);
                 DB.UpdateDocument('users', {_id:req.body.id},{balanceAmount:balanceAmount},function(err, usersresult) {
                   if(err) {
                     res.send(response);
                   } else {
                     response.status  = 1;
                     response.message = 'Balance Amount added successfully';
                     response.data      = result;
                   }
                 });
                 if(result.results2 == null ){
                   DB.InsertDocument('accounts', formdata, function(err, result) {
                     if(err) {
                       res.send(response);
                     } else {
                       response.status  = 1;
                       response.message = 'Transaction details added successfully';
                       response.id      = result._id;
                       res.send(response);
                     }
                   });
                 }
                 else{
                   DB.UpdateDocument('accounts',{userid : req.body.id}, { $push: transactiondetails}, function(err, result) {
                     if(err) {
                       res.send(response);
                     } else {
                       response.status  = 1;
                       response.message = 'Transaction details added successfully';
                       response.data    = result;
                       res.send(response);
                     }
                   });
                 }
               }
               else {
                 response.status  = 0;
                 response.message = 'No sufficient Amount';
                 res.send(response);
               }
             }
             else{
               balanceAmount=parseInt(balanceAmount)+parseInt(req.body.amount);
               DB.UpdateDocument('users', {_id:req.body.id},{balanceAmount:balanceAmount},function(err, usersresult) {
                 if(err) {
                   res.send(response);
                 } else {
                   response.status  = 1;
                   response.message = 'Balance Amount added successfully';
                   response.data      = result;
                 }
               });
                 if(result.results2 == null ){
                   DB.InsertDocument('accounts', formdata, function(err, result) {
                     if(err) {
                       res.send(response);
                     } else {
                       response.status  = 1;
                       response.message = 'Transaction details added successfully';
                       response.id      = result._id;
                       res.send(response);
                     }
                   });
                 }
                 else{
                   DB.UpdateDocument('accounts',{userid : req.body.id}, { $push: transactiondetails}, function(err, result) {
                     if(err) {
                       res.send(response);
                     } else {
                       response.status  = 1;
                       response.message = 'Transaction details added successfully';
                       response.data      = result;
                       res.send(response);
                     }
                   });
                 }
               }
           });
         });
    }

    else{
      response.status=403;
      response.message='Token expired';
      res.send(response);
    }
  }
  else{
    response.status=403;
    response.message='Token Invalid';
    res.send(response);
  }
});

module.exports = Router;
