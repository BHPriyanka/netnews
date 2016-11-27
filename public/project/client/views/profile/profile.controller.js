/*jslint node: true */
"use strict";

(function () {
    angular
        .module("NetNewsApp")
        .controller("ProfileController", ProfileController);

    function ProfileController(UserService, $location, $rootScope, $routeParams) {
        var vm = this;
        vm.error = null;
        vm.message = null;
        vm.update = update;

        function init(){
                UserService
                    .getUserProfile($routeParams.id)
                    .then(function (response) {
                        vm.profile = response.data;
                        if (vm.profile.likesArticles) {
                            for (var article in vm.profile.likesArticles) {
                                vm.profile.likesArticles[article].newsId = vm.profile.likesArticles[article].newsId.replace(/\//g, '_');
                            }
                        }
                        if (vm.profile.commentsArticles) {
                            for (var article in vm.profile.commentsArticles) {
                                vm.profile.commentsArticles[article].newsId = vm.profile.commentsArticles[article].newsId.replace(/\//g, '_');
                            }
                        }
                    });
        }
        init();

        function update(user) {
            vm.error = null;
            vm.message = null;
            var success = null;

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

            if (!user.password){
                vm.message = "Please provide a password";
                return;
            }

            if(!user.emails) {
                vm.message = "Please provide Email ID";
                return;
            }

            if(!user.phones) {
                vm.message = "Please provide Phone";
                return;
            }

            var user_without_id = {
                userName: user.userName,
                lastName: user.lastName,
                firstName: user.firstName,
                password:  user.password,
                emails: user.emails,
                phones: user.phones
            }
            UserService.updateUser($rootScope.currentUser._id, user_without_id)
                .then(function (response) {
                    if (response) {
                        UserService.findUserByUserId($rootScope.currentUser._id)
                            .then (function (updatedUser) {
                                vm.profile.password = updatedUser.data.password;
                                vm.profile.userName = updatedUser.data.userName;
                                vm.profile.firstName = updatedUser.data.firstName;
                                vm.profile.lastName = updatedUser.data.lastName;
                                vm.profile.emails = updatedUser.data.emails.join(",");
                                vm.profile.phones = updatedUser.data.phones.join(",");
                                vm.profile.likes = updatedUser.data.likes;
                                vm.profile.likesArticles = updatedUser.data.likesArticles;
                                vm.profile.thumbnail = updatedUser.data.thumbnail;
                                vm.profile.comments = updatedUser.data.comments;
                                vm.profile.commentsArticles = updatedUser.data.commentsArticles;

                                UserService.setCurrentUser(updatedUser.data);
                                console.log(updatedUser.data);
                                vm.message = "User updated successfully";
                                $location.url('/profile'+user._id);
                            });
                    }
                    else {
                        vm.message = "Unable to update the user";
                    }
                });
        }
    }
})();