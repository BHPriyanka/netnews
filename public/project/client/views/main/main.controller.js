(function(){
    angular
        .module("NetNewsApp")
        .controller("MainController", MainController);

    function MainController($location)
    {
        var vm = this;
        vm.location;

        function init() {
            vm.location = $location;
            console.log(vm.location);
        }
        init();

    }
})();