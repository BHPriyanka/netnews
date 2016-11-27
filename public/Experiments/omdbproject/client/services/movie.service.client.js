(function(){
    angular
        .module("NetNewsApp")
        .factory("MovieService", movieService);

    function movieService($http) {
        var api = {
            userLikesMovie: userLikesMovie,
            findUserLikes: findUserLikes
        };
        return api;

        function findUserLikes (imdbID) {
            return $http.get("/api/Experiments/movie/"+imdbID+"/user");
        }

        function userLikesMovie(userId, movie) {
            return $http.post("/api/Experiments/user/"+userId+"/movie/"+movie.imdbID, movie);
        }
    }
})();