(function() {
    angular
        .module("NetNewsApp")
        .controller("EntertainmentController", entertainmentController);

    function entertainmentController($location, $rootScope, EntertainmentService, $sce, $routeParams) {
        var vm = this;
        vm.trustAsHtml = $sce.trustAsHtml;
        vm.prev = prev;
        vm.next = next;
        vm.isCurrentPage = isCurrentPage;

        function init() {
            EntertainmentService.findEntertainmentNews("culture%20and%20fashion", 1, function (response) {
                for (var i in response.response.results) {
                    var id = response.response.results[i].id;
                    id = id.replace(/\//g, '_');
                    response.response.results[i].id = id;
                }
                $rootScope.countOfPages = response.response.pages;
                $rootScope.currentPage = response.response.currentPage;
                $rootScope.data = response;
                if(!$rootScope.data){
                    $location.url('/entertainment');
                }
            });
        }

        init();


        function prev(page){

            if(page != 0){
                page = page - 1;
            }

            EntertainmentService.findEntertainmentNews("culture%20and%20fashion", page, function (response) {
                for (var i in response.response.results) {
                    var id = response.response.results[i].id;
                    id = id.replace(/\//g, '_');
                    response.response.results[i].id = id;
                }
                $rootScope.countOfPages = response.response.pages;
                $rootScope.currentPage = response.response.currentPage;
                $rootScope.data = response;
                console.log($rootScope.data);
                $location.url('/entertainment');
                window.scrollTo(0,0);
            });
        }

        function next(page){
            page = page + 1;

            EntertainmentService.findEntertainmentNews("culture%20and%20fashion", page, function (response) {
                for (var i in response.response.results) {
                    var id = response.response.results[i].id;
                    id = id.replace(/\//g, '_');
                    response.response.results[i].id = id;
                }
                $rootScope.countOfPages = response.response.pages;
                $rootScope.currentPage = response.response.currentPage;
                $rootScope.data = response;
                $location.url('/entertainment');
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
