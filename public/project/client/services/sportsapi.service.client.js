(function(){
    angular
        .module("NetNewsApp")
        .factory("SportsService", sportsService);

    function sportsService($http, $templateCache) {
        var api = {
            findSportsNews: findSportsNews
        };
        return api;

        function findSportsNews(title, page, callback){
            var URL = "http://content.guardianapis.com/search?format=json&tag=sport/sport&use-date=last-modified&show-tags=contributor&show-fields=all&show-refinements=all&order-by=newest&api-key=617dcc89-35bf-4ae2-bf4d-c4c968ceb7a0&callback=JSON_CALLBACK&page=PAGE&q=";
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