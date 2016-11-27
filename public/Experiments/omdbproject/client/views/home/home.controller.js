(function(){
    angular
        .module("NetNewsApp")
        .controller("HomeController", HomeController);

    function HomeController($scope, $location){
        $scope.location = $location;
    }
})();
