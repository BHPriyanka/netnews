(function(){
    angular
        .module("NetNewsApp")
        .controller("DetailsController",detailsController);

    function detailsController($location, $routeParams, ArticleService, NewsService, $rootScope, $sce, UserService) {
        var vm = this;
        vm.id = $routeParams.id;
        vm.favorite = favorite;
        vm.submitReview = submitReview;
        var currentUser = $rootScope.currentUser;
        vm.getUserProfile = getUserProfile;

        function init() {
            vm.id = vm.id.replace(/_/g, '/');
            NewsService.findNewsById(vm.id)
                .then(function (response) {
                    vm.data = response.data;
                    vm.customBody = $sce.trustAsHtml(vm.data.response.content.fields.body);
                    vm.customHead = $sce.trustAsHtml(vm.data.response.content.fields.headline);
                    vm.customstandFirst = $sce.trustAsHtml(vm.data.response.content.fields.standfirst);
                });
            ArticleService.findUserLikes(vm.id)
                .then(function (response) {
                    var article = response.data;
                    vm.userLikes = article.userLikes;
                });
            ArticleService.findUserComments(vm.id)
                .then(function (response) {
                    var article = response.data;
                    vm.userComments = article.userComments;
                });
        }

        init();

        function getUserProfile(userId) {
            UserService.getUserProfile(userId)
                .then(function (response) {
                    $location.url('/profile/' + userId);
                });

        }

        function favorite(newsId, news) {
            if (currentUser) {
                ArticleService.userLikesArticle(currentUser._id, newsId, news)
                    .then(function (response) {
                            var article = response.data;
                            if (article != null) {
                                ArticleService.findUserLikes(newsId)
                                    .then(function (response) {
                                        vm.article = response.data;
                                    })
                                $location.url('#/details');
                            }
                            else {
                                $location.url('/login');
                            }
                        },
                        function (err) {
                            vm.error = err;
                        }
                    );
            }
            else {
                $location.url('/login');
            }
        }

        function submitReview(userReview, newsId, news) {
            if (currentUser) {
                ArticleService.userCommentsArticle(currentUser, userReview, newsId, news)
                    .then(function (response) {
                            if (response != null) {
                                ArticleService.findUserComments(newsId)
                                    .then(function (response) {
                                        vm.article = response;
                                    })
                                $location.url('#/details');
                            }
                            else {
                                $location.url('/login');
                            }
                        },
                        function (err) {
                            vm.error = err;
                        }
                    );
            } else {
                $location.url('/login');
            }

        }
    }
})();
