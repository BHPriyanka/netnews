(function() {
    angular
        .module("NetNewsApp")
        .controller("HeaderController", headerController);

    function headerController($location, UserService, $rootScope, SportsService) {
        var vm = this;
        vm.logout = logout;

        function init(){
            vm.location = $location;
        }
        init();

        function logout() {
            UserService
                .logout()
                .then(function(){
                    UserService.setCurrentUser(null);
                    $location.url("/login");
                });
        }

        var months = ['January','February','March','April','May','June','July',
            'August','September','October','November','December'];
        var today = new Date();
        document.getElementById("spanDate").innerHTML = months[today.getMonth()] + " " + today.getDate()+ ", " + today.getFullYear()+": " +today.getHours()+":"+today.getMinutes();

    }
})();
