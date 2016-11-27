(function(){
    angular
        .module("MovieDBApp", [])
        .controller("MovieListController", MovieListController);

    function MovieListController($scope){
    var movies = [
        {id: 123, title: "Avatar", year: 2007},
        {id: 345, title: "Star Wars", year: 1994}
    ];

        $scope.movies = movies;

        //Event handler Decalrations
        $scope.addMovie = addMovie;
        $scope.removeMovie = removeMovie;
        $scope.selectMovie = selectMovie;
        $scope.updateMovie = updateMovie;

        //Event handler implementations
        function addMovie(movie){
            console.log(movie);
            var newMovie = {
                id: movie.id,
                title: movie.title,
                year: movie.year
            };
            $scope.movie = {};
            $scope.movies.push(newMovie);
        }

        function removeMovie(movie){
            var index = $scope.movies.indexOf(movie);
            $scope.movies.splice(index, 1);
        }

        function selectMovie(movie){
            $scope.selectedMovieIndex = $scope.movies.indexOf(movie);
            $scope.movie = {
                id: movie.id,
                title: movie.title,
                year: movie.year
            };
        }

        function updateMovie(movie){
            $scope.movies[$scope.selectedMovieIndex] = {
                id: movie.id,
                title: movie.title,
                year: movie.year
            }
        }
    }

    })();
