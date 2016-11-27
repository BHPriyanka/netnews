(function(){
    angular
        .module("NetNewsApp")
        .factory("EntertainmentService", entertainmentService);

    function entertainmentService($http, $templateCache) {
        var api = {
            findEntertainmentNews: findEntertainmentNews
        };
        return api;

        function findEntertainmentNews(title, page, callback){
            var URL = "http://content.guardianapis.com/search?page=PAGE&format=json&tag=culture/culture,fashion/fashion&use-date=published&show-tags=contributor&show-fields=all&show-refinements=all&order-by=newest&api-key=617dcc89-35bf-4ae2-bf4d-c4c968ceb7a0&callback=JSON_CALLBACK&page-size=15&q=";
            var url = URL.replace("PAGE", page);
            $http({
                method: 'JSONP',
                url: url.concat(title),
                cache: $templateCache,
            })
                .success(callback);
        }
    }
})();