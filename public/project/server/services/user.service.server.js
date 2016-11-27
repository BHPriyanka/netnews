"use strict";
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt-nodejs");

module.exports = function(app, newsModel, NewsUserModel){
    var auth = authorized;

    app.post("/api/project/admin/user", auth, createUser);
    app.post("/api/project/register", register);
    app.get("/api/project/user", auth, findUserByUsername);
    app.get("/api/project/admin/user", auth, findUsers);
    app.get("/api/project/user/:userId", auth, findUserById);
    app.put("/api/project/admin/user/:userId", auth, updateUser);
    app.delete("/api/project/admin/user/:userId", auth, deleteUser);
    app.post("/api/project/logout", logout);
    app.get("/api/project/loggedin", loggedin);
    app.get("/api/project/login", passport.authenticate('local'), login);
    app.get("/api/project/profile/:userId", auth, profile);

    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    };

    function profile(req, res) {
        var userId = req.params.userId;
        var user = null;
        NewsUserModel.findUserById(userId)
            .then(
                function (doc) {
                    user = doc;
                    return newsModel.findNewsByNewsIds(user.likes);
                },

                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (articles) {
                    //console.log(articles);
                    user.likesArticles = articles;
                    return newsModel.findNewsByNewsIds(user.comments);
                },

                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function(articles){
                    user.commentsArticles = articles;
                    res.json(user);
                },
                function(err){
                    res.status(400).send(err);
                }
            )
    }

    function localStrategy(userName, password,done){
        NewsUserModel.findUserByUsername(userName)
            .then(
                function (user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    }else {
                        return done(null, false);
                    }
                },
                function (err) {
                    return done(err);
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        NewsUserModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function register(req, res) {
        var newUser = req.body;
        newUser.roles = ['viewer'];
        NewsUserModel
            .findUserByUsername(newUser.userName)
            .then(
                function(user){
                    if(user) {
                        res.json(null);
                    } else {
                        newUser.password = bcrypt.hashSync(newUser.password);
                        return NewsUserModel.createUser(newUser);
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(user) {
                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function findUserByUsername(req,res) {
        if (req.query.username) {
            var user1 = NewsUserModel.findUserByUsername(req.query.username)
                .then(
                    function (doc) {
                        req.session.currentUser = doc;
                        res.json(doc);
                    },
                    function (err) {
                        res.status(400).send(err);
                    });
        }
    }


    function findUsers(req, res) {
        if (isAdmin(req.user)) {
            NewsUserModel.findAllUsers()
                .then(
                    function (users) {
                        res.json(users);
                    },
                    function (err) {
                        res.status(400).send(err);
                    });
        } else {
            res.status(403);
        }
    }


    function deleteUser(req, res) {
        if(isAdmin(req.user)) {
            NewsUserModel.deleteUser(req.params.userId)
                .then(
                    function (user) {
                        return NewsUserModel.findAllUsers();
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                )
                .then(
                    function(users){
                        res.json(users);
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                );
        } else {
            res.status(403);
        }
    }


    function findUserById(req, res){
        var userId = req.params.userId;
        var user = NewsUserModel.findUserById(userId)
            .then(
                function (doc){
                    res.json(doc);
                },
                function (err){
                    res.status(400).send(err);
                });
    }

    function updateUser(req, res){
        var userId = req.params.userId;
        var newUser = req.body;
        if(!isAdmin(req.user)) {
            delete newUser.roles;
        }
        if(typeof newUser.roles == "string") {
            newUser.roles = newUser.roles.split(",");
        }

        newUser.password = bcrypt.hashSync(newUser.password);

        NewsUserModel.updateUser(userId, newUser)
            .then(
                function (user) {
                    return NewsUserModel.findAllUsers();
                },
                function(err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    res.json(users);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function createUser(req, res) {
        if(isAdmin(req.user)) {
            var newUser = req.body;
        }
        if (newUser.roles && newUser.roles.length > 1) {
            newUser.roles = newUser.roles.split(",");
        } else {
            newUser.roles = ["viewer"];
        }
        // first check if a user already exists with the username
        NewsUserModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    // if the user does not already exist
                    if(user == null) {
                        // create a new user
                        return NewsUserModel.createUser(newUser)
                            .then(
                                // fetch all the users
                                function(){
                                    return NewsUserModel.findAllUsers();
                                },
                                function(err){
                                    res.status(400).send(err);
                                }
                            );
                        // if the user already exists, then just fetch all the users
                    } else {
                        return NewsUserModel.findAllUsers();
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    res.json(users);
                },
                function(){
                    res.status(400).send(err);
                }
            )
    }

    function isAdmin(user) {
        if(user.roles.indexOf("admin") != -1) {
            return true
        }
        return false;
    }

}

