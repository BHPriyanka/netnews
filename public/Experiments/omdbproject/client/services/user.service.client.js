(function(){
    angular
        .module("NetNewsApp")
        .factory("UserService", userService);

    function userService($http, $rootScope) {
        var api = {
            login: login,
            setCurrentUser: setCurrentUser,
            getCurrentUser: getCurrentUser,
            register: register,
            logout: logout,
            getProfile: getProfile
        };
        return api;

        function getProfile() {
            return $http.get("/api/Experiments/profile/"+$rootScope.currentUser._id);
        }

        function register(user) {
            return $http.post("/api/Experiments/register", user);
        }

        function logout() {
            return $http.post("/api/Experiments/logout");
        }

        function getCurrentUser() {
            return $http.get("/api/Experiments/loggedin");
        }

        function setCurrentUser(user) {
            $rootScope.currentUser = user;
        }

        function login(credentials) {
            return $http.post("/api/Experiments/login", credentials);
        }
    }
})();