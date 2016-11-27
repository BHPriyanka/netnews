"use strict";
var q = require("q");

module.exports = function(db, mongoose) {

    //create User Schema
    var NewsUserSchema = require("./user.schema.server.js")(mongoose);

    //create UserModel using UserSchema
    var NewsUserModel = mongoose.model('NewsUser', NewsUserSchema);

    var api = {
        createUser: createUser,
        findAllUsers: findAllUsers,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        findUserById : findUserById,
        findUsersByIds :findUsersByIds,
        userLikesArticle: userLikesArticle,
        userCommentsArticle: userCommentsArticle
    };
    return api;

    //take instance object, add to collection and return the collection
    function createUser(user) {
        // use q to defer the response
        var deferred = q.defer();

        //create user using mongoose model
        NewsUserModel.create(user, function(err, doc){
            if(err){
                //reject promise if error
                deferred.reject(err);
            } else {
                //resolve promise
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    //return the corresponding collection
    function findAllUsers() {
        var deferred = q.defer();
        NewsUserModel.find(function (err, doc){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    //credentials has username and password,returns user whose credentials match, null otherwise
    function findUserByCredentials(username, password) {
        var deferred = q.defer();
        NewsUserModel.findOne(
            {
                userName: username,
                password: password
            },
            function(err, doc){
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(doc);
                }
            }
        );
        return deferred.promise;
    }

    //take ID and object instance,find object instance in collection with ID match, update the object instance values
    function updateUser(userId, user) {
        var deferred = q.defer();
        NewsUserModel.update({_id: userId}, {$set :user},
            function (err, doc)
            {
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(doc);
                }
            });
        return deferred.promise;
    }

    //returns single user whose username matches,otherwise null
    function findUserByUsername(username) {
        var deferred = q.defer();
        NewsUserModel.findOne(
            {
                userName: username
            },
            function(err, doc){
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(doc);
                }
            }
        );
        return deferred.promise;
    }

    function findUserById(userId){
        var deferred = q.defer();

        NewsUserModel.findById(userId, function(err, doc){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }


    //accept ID, and remove based on ID
    function deleteUser(userId) {
        var deferred = q.defer();
        NewsUserModel.remove({_id : userId}, function(err, doc){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function findUsersByIds (userIds) {
        var deferred = q.defer();
        // find all users in array of user IDs

         NewsUserModel.find({
         _id: {$in: userIds}
         }, function (err, users) {
         if (err) {
             deferred.reject(err);
         } else {
             deferred.resolve(users);
         }
         });

        return deferred.promise;
    }


    function userLikesArticle (userId, news) {
        var deferred = q.defer();

        NewsUserModel.findById(userId, function (err, doc) {

            if (err) {
                deferred.reject(err);
            } else {
                doc.likes.push(news._id);

                doc.save (function (err, doc) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        // resolve promise with user
                        deferred.resolve (doc);
                    }
                });
            }
        });

        return deferred;
    }

    function userCommentsArticle(userId, news, userReview, userName) {
        var deferred = q.defer();

        var reviewObj = {
            newsId          : news.newsId,
            userId          : userId,
            reviewDesc      : userReview,
            userName        : userName,
            thumbnail       : news.thumbnail,
            webTitle        : news.webTitle
        };
        NewsUserModel.findById(userId, function (err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                doc.comments.push(news._id);
                doc.commentsArticles.push(reviewObj);
                doc.save (function (err, doc) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        // resolve promise with user
                        deferred.resolve (doc);
                    }
                });
            }
        });

        return deferred;
    }

}