(function() {
    angular
        .module("NetNewsApp")
        .controller("TechController", techController);

    function techController($location, $rootScope, TechService, $sce) {
        var vm = this;
        vm.trustAsHtml = $sce.trustAsHtml;
        vm.prev = prev;
        vm.next = next;
        vm.isCurrentPage = isCurrentPage;

        function init() {
            TechService.findTechNews("technology%20and%20science", 1, function (response) {
                for(var i in response.response.results) {
                    var id = response.response.results[i].id;
                    id = id.replace(/\//g,'_');
                    response.response.results[i].id = id;
                }
                $rootScope.countOfPages = response.response.pages;
                $rootScope.currentPage = response.response.currentPage;
                $rootScope.data = response;
                if(!$rootScope.data){
                    $location.url('/technology');
                }
            });
        }

        init();

        function prev(page){

            if(page != 0){
                page = page - 1;
            }

            TechService.findTechNews("technology%20and%20science", page, function (response) {
                for(var i in response.response.results) {
                    var id = response.response.results[i].id;
                    id = id.replace(/\//g,'_');
                    response.response.results[i].id = id;
                }
                $rootScope.countOfPages = response.response.pages;
                $rootScope.currentPage = response.response.currentPage;
                $rootScope.data = response;
                $location.url('/technology');
                window.scrollTo(0,0);
            });
        }

        function next(page){
            page = page + 1;

            TechService.findTechNews("technology%20and%20science", page, function (response) {
                for(var i in response.response.results) {
                    var id = response.response.results[i].id;
                    id = id.replace(/\//g,'_');
                    response.response.results[i].id = id;
                }
                $rootScope.countOfPages = response.response.pages;
                $rootScope.currentPage = response.response.currentPage;
                $rootScope.data = response;
                $location.url('/technology');
                window.scrollTo(0,0);
            });
        }


        function isCurrentPage(currentPage){
            if(currentPage == 1){
                return true;
            }
            else return false;
        }
    }
})();
