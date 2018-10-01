
angular.module('football.controllers')

.controller('BookingController', function ($scope, $http, LoginStore, $timeout, BookingStore, $ionicPopup, $ionicLoading) {



    $scope.tabs =
        {
            Current: false,
            Previous: false
        }

    $scope.status =
        {
            Current: "solid",
            Previous: "none"
        }
    $scope.nointernet = false;

    setTimeout(() => {
        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
                $scope.notloaded = false;
            }
        });
    }, 2000)



    $scope.currentbookings = [];
    $scope.previousbookings = [];
    $scope.selectedbookings = [];


    $scope.RefreshPage = function () {
        $scope.notloaded = true;
        $scope.currentbookings = [];
        $scope.previousbookings = [];
        $scope.selectedbookings = [];

        BookingStore.GetMyUpcomingBookings(function (leagues) {

            $http({
                method: 'GET',
                url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
            }).then(function successCallback(response) {

                $scope.bookings = leagues;
                $scope.tabs.Current = true;
                $scope.notloaded = false;


                $scope.currentdate = new Date(response.data);

                for (var i = 0; i < $scope.bookings.length; i++) {

                    if ($scope.bookings[i].date >= $scope.currentdate) {
                        $scope.currentbookings.push($scope.bookings[i]);
                    }
                    else {
                        $scope.previousbookings.push($scope.bookings[i]);
                    }

                }

                $scope.selectedbookings = $scope.currentbookings;
            }, function errorCallback(response) {

            });


        });
    }

    $scope.Rate = function () {

    }

    $scope.RefreshPage();

    $scope.CancelBooking = function (item) {

        var difference = (item.date - $scope.currentdate) / 1000 / 60 / 60;

        firebase.database().ref('/stadiumsinfo/' + item.stadiumkey + '/ministadiums/' + item.ministadiumkey + '/cancellation').once('value').then(function (snapshot) {

            var user = firebase.auth().currentUser;
            var id = user.uid;

            if (id !== null || id == '' || id === undefined) {

                if (difference < snapshot.val()) {
                    var confirmPopup = $ionicPopup.alert({
                        template: 'You cannot cancel this reservation due to stadiums cancellation policy. Please call the stadium'
                    });

                }
                else {

                    firebase.database().ref('/playersinfo/' + id).once('value').then(function (playersnapshot) {

                        firebase.database().ref('/stadiumsinfo/' + item.stadiumkey).once('value', function (stadiumsinfo) {

                            /// PLAYER TOKENS
                            var Tokens = [];
                            if (stadiumsinfo.val().hasOwnProperty("devicetoken")) {
                                for (var k in stadiumsinfo.val().devicetoken) {
                                    if (stadiumsinfo.val().devicetoken.hasOwnProperty(k)) {
                                        Tokens.push(k);
                                    }
                                }
                            }

                            $ionicLoading.show({
                                content: 'Loading',
                                animation: 'fade-in',
                                showBackdrop: true,
                                maxWidth: 200,
                                showDelay: 0
                            });
                            BookingStore.GetBookingbyID(item, function (res) {
                                if (res != null && res != []) {
                                    LoginStore.CancelNotification(res.reminderNotificationID);
                                    LoginStore.CancelNotification(res.afterMatchNotificationID);
                                    BookingStore.DeleteBookingByID(res).then(function () {


                                        LoginStore.SendNotification("Booking on " + item.date.toString() + " Has Been Canceled By " + playersnapshot.val().firstname + " - Tel:  " + playersnapshot.val().telephone, Tokens, null).then(function (res) {
                                            console.log(res);
                                        });;

                                        $ionicLoading.hide();
                                        var alertPopup = $ionicPopup.alert({
                                            template: 'Booking Cancelled Successfully'
                                        }).then(function () {
                                            $scope.RefreshPage();
                                        }, function (error) {

                                        })

                                    }, function (error) {
                                        $ionicLoading.hide();
                                    })
                                }
                            })

                        }, function (error) {
                            alert("ERROR");
                        })
                    })
                }


            }

        })

    }

    $scope.switchscreens = function (x) {
        switch (x) {
            case 1:
                $scope.tabs.Current = true;
                $scope.tabs.Previous = false;

                $scope.status.Current = "none";
                $scope.status.Previous = "none";

                $scope.status.Current = "solid";

                $scope.selectedbookings = $scope.currentbookings;
                console.log($scope.selectedbookings);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                break;

            case 2:
                $scope.tabs.Previous = true;
                $scope.tabs.Current = false;

                $scope.status.Current = "none";
                $scope.status.Previous = "none";

                $scope.status.Previous = "solid";

                $scope.selectedbookings = $scope.previousbookings;
                console.log($scope.selectedbookings);
                if (!$scope.$$phase) {
                    $scope.$apply();
                    $scope.$digest();
                }

                break;
        }
    }


})
