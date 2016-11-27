
(function(){
    angular
        .module("NetNewsApp")
        .factory("NewsService", newsService);

    function newsService($http, $templateCache) {
        var api = {
            findWorldNews: findWorldNews,
            findNewsByTitle: findNewsByTitle,
            findNewsById: findNewsById
        };
        return api;

        function findWorldNews(title, page, callback) {
            var URL ="http://content.guardianapis.com/search?format=json&tag=world/world&use-date=published&show-tags=contributor&show-fields=all&show-refinements=all&order-by=newest&api-key=617dcc89-35bf-4ae2-bf4d-c4c968ceb7a0&callback=JSON_CALLBACK&q=TITLE&page=PAGE";
            URL = URL.replace("TITLE", title);
            URL = URL.replace("PAGE", page);
            $http({
                method: 'JSONP',
                url: URL,
                cache: $templateCache
            })
                .success(callback);
        }

        function findNewsByTitle(title, page, callback) {
            var URL = "http://content.guardianapis.com/search?show-fields=all&&page-size=12&show-refinements=all&api-key=617dcc89-35bf-4ae2-bf4d-c4c968ceb7a0&callback=JSON_CALLBACK&q=TITLE&page=PAGE";
            var new_title;
            new_title = title.replace(" ", "%20");
            URL = URL.replace("TITLE", new_title);
            URL = URL.replace("PAGE", page);
            console.log(URL);
            $http({
                method: 'JSONP',
                url: URL,
                cache: $templateCache
            })
                .success(callback);
        }

        function findNewsById(newsId) {
            return $http({
                method: 'JSONP',
                url: "http://content.guardianapis.com/"+ newsId +"?api-key=617dcc89-35bf-4ae2-bf4d-c4c968ceb7a0&callback=JSON_CALLBACK&show-fields=all",
                cache: $templateCache
            });
        }
    }
})();