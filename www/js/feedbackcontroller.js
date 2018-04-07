

angular.module('football.controllers')

    .controller('FeedBackController', function ($scope, $ionicHistory, $timeout, $state, $ionicPopup, $ionicLoading, $ionicPopover) {

        $scope.error = false;
        $scope.loading = false;
        $scope.feedbacktext =
            {
                text: ""
            };
        $scope.nointernet = false;

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $scope.nointernet = true;
            }
        });

        $scope.savefeedback = function () {
            $scope.loading = true;

            if ($scope.feedbacktext.text.length > 10) {
                var user = firebase.auth().currentUser;
                var id = user.uid;

                if (id !== null && id != '' && id !== undefined) {

                    var updates = {};

                    var newPostKey = firebase.database().ref().child('/feedback/' + id).push().key;

                    updates['/feedback/' + id + '/' + newPostKey] =
                        {
                            text: $scope.feedbacktext.text
                        }
                    firebase.database().ref().update(updates).then(function (res) {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: "Thank you for your feedback <3"
                        }).then(function () {
                            $scope.loading = false;
                            $state.go("app.homepage");
                        });


                    }, function (error) {
                        $scope.loading = false;
                    });

                }
            }
            else {
                $scope.error = true;
            }

        }


    })