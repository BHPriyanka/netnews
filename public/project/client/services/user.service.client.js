(function(){
    angular
        .module("NetNewsApp")
        .factory("UserService", UserService);

    function UserService($rootScope, $http) {
        var api = {
            setCurrentUser: setCurrentUser,
            getCurrentUser: getCurrentUser,
            updateUser: updateUser,
            findUserByUserId: findUserByUserId,
            findUserByUsername: findUserByUsername,
            createUser: createUser,
            deleteUser: deleteUser,
            findAllUsers: findAllUsers,
            logout: logout,
            login: login,
            register: register,
            getUserProfile: getUserProfile
        };
        return api;

        function createUser(user) {
            return $http.post("/api/project/admin/user", user);
        }

        function setCurrentUser(user) {
            console.log("setCurrentUser");
            $rootScope.currentUser = user;
        }

        function getCurrentUser() {
            return $http.get("/api/project/loggedin");
        }

        function updateUser(userId, user) {
            return $http.put("/api/project/admin/user/" + userId, user);
        }

        function findUserByUserId(userId) {
            return $http.get("/api/project/user/" + userId);
        }

        function findUserByUsername(username) {
            return $http.get("/api/project/user?username=" + username);
        }

        function deleteUser(userId) {
            return $http.delete("/api/project/admin/user/" + userId);
        }

        function findAllUsers() {
            return $http.get("/api/project/admin/user");
        }

        function register(user) {
            return $http.post("/api/project/register", user);
        }

        function logout(){
            return $http.post("/api/project/logout");
        }

        function login(credentials) {
            return $http.get("/api/project/login",
                {
                    params: {
                        'username': credentials.userName,
                        'password': credentials.password
                    }
                });
        }


        function getUserProfile(id){
            return $http.get("/api/project/profile/"+id);
        }
    }

})();