module.exports = function(mongoose) {
    var articleReviewSchema = require("./comment.schema.server.js")(mongoose);

    // use mongoose to declare a movie schema
    var NewsSchema = mongoose.Schema({
        newsId: String,
        webTitle: String,
        webUrl: String,
        thumbnail: String,
        // ids of users that like this movie
        likes: [String],
        // list of users that like this movie
        userLikes: [
            {userName: String}
        ],
        comments: [String],
        userComments: [articleReviewSchema]
        // store movie documents in this collection
    }, {collection: 'project.news.article'});

    return NewsSchema;

};