const express       = require('express');
const bcrypt        = require('bcryptjs');
const Router        = express.Router();
const DB            = require('../../models/db');
const jwt           = require('jsonwebtoken');
const verifyToken   = require('../../models/tokenVerify.js');


Router.post('/customerLogin',function(req,res) {
  const email      = req.body.email;
  const password   = req.body.password;
  const user       = {
                      email    : email,
                      password : password,
                     };
  DB.GetOneDocument('users', { email:email,usertype : 'customer'}, {}, {}, function(err, result) {
        const response = {
          status  : 0,
          message : 'Something went wrong in your code!'
         };
        if(err) {
            res.send(response);
          } else {
            if(result) {
                const passswordCheck = bcrypt.compareSync(password,result.password, null);
                if(passswordCheck && result.email == email) {
                  jwt.sign({user},'hidesecret',{expiresIn:'10h'} ,(err,token)=>{
                    if(token) {
                      res.send({status:1,message:"Login Successfully",token:token});
                    }
                  });
               } else {
                  res.send({status:0,message:"Invalid password"});
               }
           } else {
             res.send({status:0,message:"Invalid email"});
           }
      }
  });
});

Router.post('/bankerLogin',function(req,res) {
  const email      = req.body.email;
  const password   = req.body.password;
  const user       = {
                      email    : email,
                      password : password,
                     };
  DB.GetOneDocument('users', { email:email,usertype : 'banker' }, {}, {}, function(err, result) {
        const response = {
          status  : 0,
          message : 'Something went wrong in your code!'
         };
        if(err) {
            res.send(response);
          } else {
            if(result) {
                const passswordCheck = bcrypt.compareSync(password,result.password, null);
                if(passswordCheck && result.email == email) {
                  jwt.sign({user},'hidesecret',{expiresIn:'10h'} ,(err,token)=>{
                    if(token) {
                      res.send({status:1,message:"Login Successfully",token:token});
                    }
                  });
               } else {
                  res.send({status:0,message:"Invalid password"});
               }
           } else {
             res.send({status:0,message:"Invalid email"});
           }
      }
  });
});

module.exports = Router;
