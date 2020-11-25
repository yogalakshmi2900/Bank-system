const mongoose = require('mongoose');

const importedUserSchema             = require('../schemas/userschema');
const importedAccountSchema             = require('../schemas/accountschema');

// Creating schema
const UserSchema              = mongoose.Schema(importedUserSchema,{timestamps: true,  versionKey: false});
const AccountSchema           = mongoose.Schema(importedAccountSchema,{timestamps: true,  versionKey: false});

// Creating models
const UserModel              = mongoose.model('users', UserSchema);
const AccountModel              = mongoose.model('accounts', AccountSchema);

module.exports = {
  users             : UserModel,
  accounts          : AccountModel
}
