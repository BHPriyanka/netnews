module.exports = function(app, newsModel, NewsUserModel) {
    app.post("/api/project/user/:userId/news/:newsId", userLikesArticle);
    app.get("/api/project/news/:newsId/user", findUserLikes);
    app.post("/api/user/:userId/news/:newsId/review", userCommentsArticle);
    app.get("/api/news/:newsId/user", findUserComments);

    function userLikesArticle(req, res) {
        var news  = req.body;
        var userId = req.params.userId;
        var newsId = req.params.newsId;
        var article;

        newsModel
            .userLikesArticle(userId, news)
            .then(
                function (article) {
                    return NewsUserModel.userLikesArticle(userId, article);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (user) {
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function findUserLikes (req, res) {
        var newsId = req.params.newsId;
        var news = null;
        newsId = newsId.replace(/_/g,'/');
        newsModel.findNewsByNewsId(newsId)
            .then(function (doc) {
                news = doc;
                if(doc){
                    return NewsUserModel.findUsersByIds(news.likes);
                } else {
                    res.json ({});
                }
            },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then (
                function (users) {
                    news.userLikes = users;
                    res.json(news);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function userCommentsArticle(req, res){
        var userId = req.params.userId;
        var newsId = req.params.newsId;
        var news = req.body
        var userReview  = news.userReview;//req.params.userReview;
        var userName = news.userName;
        news = news.news;

        newsModel
            .userCommentsArticle(userId, newsId, userReview, news, userName)
            .then(
                function (article) {
                    return NewsUserModel.userCommentsArticle(userId, article, userReview, userName);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (user) {
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function findUserComments (req, res) {
        var newsId = req.params.newsId;
        var news = null;
        newsId = newsId.replace(/_/g,'/');
        newsModel.findNewsByNewsId(newsId)
            .then(function (doc) {
                    news = doc;
                    if(doc){
                        return NewsUserModel.findUsersByIds(news.comments);
                    } else {
                        res.json ({});
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then (
                function (users) {
                    news.commentsArticles = users;
                    res.json(news);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }
}