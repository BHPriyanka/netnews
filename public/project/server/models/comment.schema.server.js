module.exports = function(mongoose) {
    var articleReviewSchema =  mongoose.Schema({
            newsId          : String,
            userId          : String,
            userName        : String,
            reviewDesc      : String,
            reviewDate      : {type : Date,  default: Date.now},
            thumbnail       : String,
            webTitle        : String
        },
        {collection: "project.article.review"});

    return articleReviewSchema;
};