var q = require("q");

module.exports = function(db, mongoose) {
    // load movie schema from movie model
    var NewsSchema = require("./news.schema.server.js")(mongoose);

    // create movie from schema
    var Article  = mongoose.model("Article", NewsSchema);


    var articles = [];
    var api = {
        findNewsByNewsIds: findNewsByNewsIds,
        createNews: createNews,
        findNewsByNewsId: findNewsByNewsId,
        userLikesArticle: userLikesArticle,
        userCommentsArticle : userCommentsArticle
    };
    return api;

    function createNews(newsId, news) {
         var article = {
             _id: "ID_" + (new Date()).getTime(),
             newsId: news.response.content.id,
             webTitle: news.response.content.webTitle,
             webUrl: news.response.content.webUrl,
             thumbnail: news.response.content.fields.thumbnail,
             likes: [],
             comments: []
        };

        var deferred = q.defer();
        article.save(function (err, doc) {

        if (err) {
            // reject promise if error
            defferred.reject(err)
        } else {
            // resolve promise
            deferred.resolve(doc);
        }

    });
    }

    function findNewsByNewsIds(newsIds) {
        var deferred = q.defer();
        Article.find({
            _id: {$in: newsIds}
        }, function (err, articles) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(articles);
            }
        })
        return deferred.promise;
    }

    function findNewsByNewsId(newsId) {
        var deferred = q.defer();
        Article.findOne({newsId:newsId}, function (err, doc) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }


    function userLikesArticle (userId, article) {
        var deferred = q.defer();

        Article.findOne({newsId: article.response.content.id},

            function (err, doc) {

                // reject promise if error
                if (err) {
                    deferred.reject(err);
                }

                if (doc) {
                    // add user to likes
                    doc.likes.push (userId);
                    // save changes
                    doc.save(function(err, doc){
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(doc);
                        }
                    });
                } else {
                    // if there's no article
                    // create a new instance
                    article = new Article({
                        newsId: article.response.content.id,
                        webTitle: article.response.content.webTitle,
                        webUrl: article.response.content.webUrl,
                        thumbnail: article.response.content.fields.thumbnail,
                        likes: [],
                        comments: []
                    });
                    // add user to likes
                    article.likes.push (userId);
                    // save new instance
                    article.save(function(err, doc) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(doc);
                        }
                    });
                }
            });

        return deferred.promise;
    }

    function userCommentsArticle(userId, newsId, userReview, article, userName) {
        var deferred = q.defer();

        var reviewObj = {
            newsId          : newsId,
            userId          : userId,
            reviewDesc      : userReview,
            userName        : userName,
            thumbnail       : article.thumbnail,
            webTitle        : article.webTitle
        };

        Article.findOne({newsId: article.response.content.id},
            function (err, doc) {

                // reject promise if error
                if (err) {
                    deferred.reject(err);
                }

                if (doc) {
                    doc.comments.push (userId);
                    doc.userComments.push (reviewObj);
                    // save changes
                    doc.save(function(err, doc){
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(doc);
                        }
                    });
                } else {
                    // if there's no article
                    // create a new instance
                    article = new Article({
                        newsId: article.response.content.id,
                        webTitle: article.response.content.webTitle,
                        webUrl: article.response.content.webUrl,
                        thumbnail: article.response.content.fields.thumbnail,
                        likes: [],
                        comments: [],
                        userComments : []
                    });
                    article.comments.push (userId);
                    article.userComments.push (reviewObj);
                    // save new instance
                    article.save(function(err, doc) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(doc);
                        }
                    });
                }
            });

        return deferred.promise;
    }

}