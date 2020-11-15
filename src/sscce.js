'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    const User = sequelize.define('user', { 
      password: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: {
          len: [5,25]
        }, 
        {
        hooks: {
          beforeSave: (user) => { //encrypt the password before saving it to database
          user.password = "myHashedPasswordLongerThan25Characters"
          }
        },
    });
    await sequelize.sync();
    // no error when creating and hashing through hooks
    log(let u = await User.create({ password: '12345678' }));
    
    // 
    expect(await User.count()).to.equal(1);
};
