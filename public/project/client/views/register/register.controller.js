/*jslint node: true */
"use strict";

(function() {
    angular
        .module("NetNewsApp")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService, $rootScope) {
        var vm = this;
        vm.message = null;
        vm.register = register;

        function init() {
            vm.location = $location;
        }

        init();

        function register(user) {
            vm.message = null;

            if (user == null) {
                vm.message = "Please fill in the required fields";
                return;
            }
            if (!user.userName) {
                vm.message = "Please provide a username";
                return;
            }

            if (!user.firstName) {
                vm.message = "Please provide Firstname";
                return;
            }

            if (!user.lastName) {
                vm.message = "Please provide Lastname";
                return;
            }

            if (!user.password || !user.password2) {
                vm.message = "Please provide a password";
                return;
            }
            if (user.password != user.password2) {
                vm.message = "Passwords must match";
                return;
            }

            if (!user.emails) {
                vm.message = "Please provide Email ID";
                return;
            }

            if (!user.phones) {
                vm.message = "Please provide phone";
                return;
            }

            user.emails = user.emails.trim().split(",");
            user.phones = user.phones.trim().split(",");
            UserService.register(user)
                .then(function (response) {
                        var currentUser = response.data;
                        if(currentUser!=null) {
                            console.log(currentUser);
                            UserService.setCurrentUser(currentUser);
                            console.log($rootScope.currentUser);
                            $location.url('/profile/'+currentUser._id);
                        }
                        else{
                            vm.message = "User Already exists";
                            vm.currentUser = null;
                            $location.url('/register');
                        }
                    },
                    function(err){
                        vm.error=err;
                    }
                );
        }
    }
})();