(function(){
    angular
        .module("NetNewsApp")
        .factory("TravelService", travelService);

    function travelService($http, $templateCache) {
        var api = {
            findTravelNews: findTravelNews
        };
        return api;

        function findTravelNews(title, page, callback){
            var URL = "http://content.guardianapis.com/search?format=json&tag=travel/travel&use-date=published&show-tags=contributor&show-fields=all&show-refinements=all&order-by=newest&api-key=617dcc89-35bf-4ae2-bf4d-c4c968ceb7a0&callback=JSON_CALLBACK&page=PAGE&q=TITLE";
            URL = URL.replace("PAGE", page);
            URL = URL.replace("TITLE", title);

            $http({
                method: 'JSONP',
                url: URL,
                cache: $templateCache
            })
                .success(callback);
        }
    }
})();