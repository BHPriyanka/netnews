(function(){
    angular
        .module("NetNewsApp")
        .controller("HeaderController", headerController);

    function headerController($location, UserService) {
        var vm = this;

        vm.logout = logout;

        function init() {
            vm.$location = $location;
        }
        init();

        function logout() {
            UserService
                .logout()
                .then(function(){
                    UserService.setCurrentUser(null);
                    $location.url("/home");
                });
        }
    }
})();