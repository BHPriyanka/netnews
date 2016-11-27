(function(){
    angular
        .module("NetNewsApp")
        .controller("SearchController", searchController);

        function searchController($location, $routeParams, NewsService, $rootScope, $sce){
            var vm = this;
            vm.countOfPages = 0;
            vm.trustAsHtml = $sce.trustAsHtml;
            vm.prev = prev;
            vm.next = next;
            vm.message;
            vm.isCurrentPage = isCurrentPage;

            function init(){

               // $(".search-container").empty();
                vm.location = $location;
            }
            init();
            vm.search = search;

            function search(news){
                    NewsService.findNewsByTitle(news.title, 1, function (response) {
                        for (var i in response.response.results) {
                            var id = response.response.results[i].id;
                            id = id.replace(/\//g, '_');
                            response.response.results[i].id = id;
                        }
                        $rootScope.countOfPages = response.response.pages;
                        $rootScope.currentPage = response.response.currentPage;
                        $rootScope.startIndex = response.response.startIndex;
                        $rootScope.data = response;
                        $rootScope.title = news.title;
                        $location.url('/search');
                    });
                }


            function prev(title, page){
                if(page != 0){
                    page = page - 1;
                }

                NewsService.findNewsByTitle(title, page, function(response) {
                    for (var i in response.response.results) {
                        var id = response.response.results[i].id;
                        id = id.replace(/\//g, '_');
                        response.response.results[i].id = id;
                    }
                    $rootScope.countOfPages = response.response.pages;
                    $rootScope.currentPage = response.response.currentPage;
                    $rootScope.data = response;
                    $location.url('/search');
                    window.scrollTo(0,0);
                });
            }

            function next(title, page){
                page = page + 1;

                NewsService.findNewsByTitle(title, page, function(response) {
                    for (var i in response.response.results) {
                        var id = response.response.results[i].id;
                        id = id.replace(/\//g, '_');
                        response.response.results[i].id = id;
                    }
                    $rootScope.countOfPages = response.response.pages;
                    $rootScope.currentPage = response.response.currentPage;
                    $rootScope.data = response;
                    $location.url('/search');
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
