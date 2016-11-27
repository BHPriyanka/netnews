module.exports = function(app, db, mongoose) {
    var NewsUserModel = require("./models/user.model.js")(app, db, mongoose);
    var newsModel = require("./models/news.model.js")(app, db, mongoose);
    var user_service = require("./services/user.service.server.js")(app, newsModel, NewsUserModel);
    var article_service = require("./services/article.service.server.js")(app, newsModel, NewsUserModel);
}