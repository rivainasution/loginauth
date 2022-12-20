'use strict'; // single instance

const passport = require('passport');
let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// db
const db = require('../models');
const Users = db.users;
const Op = db.Sequelize.Op;

let config = require('../config');
let opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    Users.findByPk(jwt_payload.userid)
        .then(data => {
            if (data) {
                return done(null, data);
            } else {
                // htttp 404 not found
                return done("user tidak terdaftar", false);
            }
        })
        // error
        .catch(err => {
            return done("user tidak terdaftar", false);
        });

}));
