(function() {
    angular
        .module("NetNewsApp")
        .controller("SportsController", sportsController);

    function sportsController($location, $rootScope, SportsService, $sce) {
        var vm = this;

        vm.trustAsHtml = $sce.trustAsHtml;
        vm.prev = prev;
        vm.next = next;
        vm.isCurrentPage = isCurrentPage;

        function init() {
            SportsService.findSportsNews("sports", 1, function (response) {
                for(var i in response.response.results) {
                    var id = response.response.results[i].id;
                    id = id.replace(/\//g,'_');
                    response.response.results[i].id = id;
                }
                $rootScope.countOfPages = response.response.pages;
                $rootScope.currentPage = response.response.currentPage;
                $rootScope.data = response;
                if(!$rootScope.data){
                    $location.url('/sports');
                }
            });
        }

        init();

        function prev(page){

            if(page != 0){
                page = page - 1;
            }

            SportsService.findSportsNews("sports", page, function (response) {
                for(var i in response.response.results) {
                    var id = response.response.results[i].id;
                    id = id.replace(/\//g,'_');
                    response.response.results[i].id = id;
                }
                $rootScope.countOfPages = response.response.pages;
                $rootScope.currentPage = response.response.currentPage;
                $rootScope.data = response;
                $location.url('/sports');
                window.scrollTo(0,0);
            });
        }

        function next(page){
            page = page + 1;

            SportsService.findSportsNews("sports", page, function (response) {
                for(var i in response.response.results) {
                    var id = response.response.results[i].id;
                    id = id.replace(/\//g,'_');
                    response.response.results[i].id = id;
                }
                $rootScope.countOfPages = response.response.pages;
                $rootScope.currentPage = response.response.currentPage;
                $rootScope.data = response;
                $location.url('/sports');
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
