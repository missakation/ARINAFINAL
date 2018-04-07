
angular.module('football.controllers')

    .controller('SearchController', function ($scope, SearchStore,$state, ReservationFact, LoginStore, $ionicPopup, $ionicPopover, $timeout, $ionicLoading, pickerView, SMSService, $ionicFilterBar) {
        /** picker view stuff **/
        function getDateFromDayName(selectedDay) {
            var selectedDate = new Date();
            if (selectedDay == "Tomorrow") {
                selectedDate.setDate(selectedDate.getDate() + 1);
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            if (selectedDay == "Today") {
                selectedDate.setDate(selectedDate.getDate());
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            for (var i = 0; i < 6; i++) {
                if (weekdayFull[selectedDate.getDay()] == selectedDay)
                    return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
                selectedDate.setDate(selectedDate.getDate() + 1);
            }
        }

        var stadiums = [];
        $scope.allfreestadiums = [];
        $scope.gotlocation = false;
        $scope.search = {
            date: new Date(),
        };

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });


        SearchStore.GetMyProfileInfo(function (profile) {

            $scope.myprofile = profile;

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            tomorrow.setHours(21);
            tomorrow.setMinutes(0);
            tomorrow.setMilliseconds(0);
            tomorrow.setSeconds(0);

            $scope.search = {
                date: tomorrow,
                text: "Tomorrow, 9:00PM" //- " + ($scope.myprofile.favstadium != null && $scope.myprofile.favstadium != "" ?$scope.myprofile.favstadium:"Near me")
            };
        });

        //toRad function
        if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
                return this * Math.PI / 180;
            }
        }



        /*//preparing stadiums list
        stadiums.push("Near me");
        if ($scope.myprofile.favstadium)
            stadiums.push($scope.myprofile.favstadium);
        for (var i = 0; i < leagues.length; i++) {
            //console.log(leagues[i].name);
            if (leagues[i].name != $scope.myprofile.favstadium)
                stadiums.push(leagues[i].name);
        }*/


        $ionicLoading.hide();


        $scope.openPickerView = function openPickerView() {

            var picker = pickerView.show({
                titleText: '', // default empty string
                doneButtonText: 'Search', // dafault 'Done'
                cancelButtonText: 'Close', // default 'Cancel'
                items: [{
                    values: dateArrayThingy,
                    defaultIndex: 1
                }, {
                    values: [' 7:00 AM ', ' 7:30 AM ', ' 8:00 AM ', ' 8:30 AM ', ' 9:00 AM ', '9:30 AM ', ' 10:00 AM ', ' 10:30 AM', ' 11:00 AM ', ' 11:30 AM ', ' Noon ', ' 1:00 PM ', ' 1:30 PM ', ' 2:00 PM ', ' 2:30 PM ', ' 3:00 PM ', ' 3:30 PM ', ' 4:00 PM ', ' 4:30 PM ', ' 5:00 PM ', ' 5:30 PM ', ' 6:00 PM ', ' 6:30 PM ', ' 7:00 PM ', ' 7:30 PM ', ' 8:00 PM', ' 8:30 PM ', ' 9:00 PM ', ' 9:30 PM ', ' 10:00 PM ', ' 10:30 PM ', ' 11:00 PM', '11:30 PM ', ' Midnight ',],
                    defaultIndex: 27
                }/*, {
                    values: stadiums,
                    defaultIndex: 0
                }
                */
                ]
            });

            if (picker) {
                picker.then(function pickerViewFinish(output) {
                    if (output) {
                        // output is Array type
                        var correctDate;
                        var selectedDate = output[0];
                        var selectedTime = output[1];
                        if (!Date.parse(selectedDate)) {
                            selectedDate = getDateFromDayName(selectedDate);
                            console.log(selectedDate);
                        }
                        $scope.search.date = new Date(selectedDate + " " + selectedTime + ", " + (new Date()).getFullYear());
                        //$scope.search.players = (output[2].split(" "))[1];
                        console.log($scope.search.date);
                        $scope.search.text = output.join(" - ");
                        $scope.checkfree();
                    }
                });
            }


        };
        /** End picker view stufgf**/
        var freestadiums = [];


        // .fromTemplate() method
        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/player-popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {
            // Execute action
            //scope.$digest();
            //alert($scope.choice)
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
        });

        var user = firebase.auth().currentUser;

        /*   if (user != null) {
               user.providerData.forEach(function (profile) {
         
                   alert("  Provider-specific UID: " + profile.uid);
                   alert("  Name: " + profile.displayName);
                   alert("  Email: " + profile.email);
               });
           }*/

        var filter =
            {
                sortby: "skill",
                skill: "Not Bad",
                distancefrom: 0,
                distanceto: 250000,
            }

        $scope.sliderskill = {
            value: 3,
            options: {
                showSelectionBar: true,
                floor: 0,
                ceil: 3,
                showSelectionBar: true,
                hideLimitLabels: true,
                stepsArray: ['Newbie', 'Not Bad', 'Solid', 'Pro']

            }
        };

        $scope.allfreeplayers = [];

        $scope.gototeam = function (id) {
            if (!(id == null || id == '' || id === undefined || id == 'none')) {
                $state.go("app.teamview",
                    {
                        teamid: id
                    })
            }
        }

        $scope.checkfree = function (search) {

            //getting current location
            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.mylatitude = position.coords.latitude;
                $scope.mylongitude = position.coords.longitude;
                $scope.gotlocation = true;

                if ($scope.gotlocation) {

                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });

                    SearchStore.SearchAvailablePlayers($scope.search, function (players) {

                        var counter = 0;
                        var count = players.length;
                        $scope.allfreeplayers = players;

                        if ($scope.allfreeplayers.length > 0) {

                            $scope.allfreeplayers.forEach(function (element) {
                                /** Converts numeric degrees to radians */
                                var lat1 = $scope.mylatitude;
                                var lon1 = $scope.mylongitude;



                                var lat2 = element.favlatitude;
                                var lon2 = element.favlongitude;

                                var R = 6371; // km 
                                //has a problem with the .toRad() method below.
                                var x1 = lat2 - lat1;
                                
                                var dLat = x1.toRad();


                                var x2 = lon2 - lon1;
                                var dLon = x2.toRad();
                                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                var d = R * c;

                                element.distance = d.toFixed(2);
                                element.points = d + (element.seendifference/60/5);
                                /*$scope.allfreestadiums = $scope.allfreestadiums.sort(function (a, b) {
                                    return a.distance - b.distance;
                                });*/


                                if (element.teamdisplayedkey != 'none' || element.teamdisplayedkey != '') {
                                    firebase.database().ref('/teampoints/' + element.teamdisplayedkey).on('value', function (snapshot) {
                                        if (snapshot.exists()) {
                                            element.teamkey = snapshot.key;
                                            element.teambadge = snapshot.child("badge").val();
                                            element.teamname = snapshot.child("name").val();
                                            element.rank = snapshot.child("rank").val();
                                            element.rating = snapshot.child("rating").val();
                                            element.teamexists = true;
                                            switch (element.rating) {
                                                case 1:
                                                    element.rankdescription = element.rating + 'st';
                                                    break;
                                                case 2:
                                                    element.rankdescription = element.rating + 'nd';
                                                    break;
                                                case 3:
                                                    element.rankdescription = element.rating + 'rd';
                                                    break;

                                                default:
                                                    element.rankdescription = element.rating + 'th';
                                                    break;
                                            }

                                        }

                                        else {
                                            element.members = "";
                                            element.rank = "";
                                            element.rating = "";
                                            element.teambadge = "defaultteam";
                                            element.teamexists = false;
                                        }


                                    })
                                    counter++;
                                }
                                else {
                                    element.members = "";
                                    element.rank = "";
                                    element.rating = "";
                                    element.teambadge = "defaultteam";
                                    element.teamexists = false;
                                }

                            }, this);

                        }

                        console.log($scope.allfreeplayers);
                        $scope.filteredPlayers = $scope.allfreeplayers;
                        $ionicLoading.hide();


                    })
                }
                else {

                    var alertPopup = $ionicPopup.alert({
                        title: 'New Team',
                        template: 'Please Turn On Your Wifi To See Players Around You'
                    }).then(function () {
                        $state.go("app.homepage");
                    }, function (error) {

                    })

                }

            }, function (error) {
                alert(error.message);
            });



        }

        $scope.checkfree();

        $scope.requestnumber = function (player) {

            if (!(player == null || player == undefined || player == []) && !($scope.myprofile == null || $scope.myprofile == undefined || $scope.myprofile == [])) {


                if (!player.status > 0) {

                    var userId = firebase.auth().currentUser.uid;
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    firebase.database().ref('/players/' + userId).once('value').then(function (snapshot) {
                        $ionicLoading.hide();
                        if (!snapshot.val().isMobileVerified) {
                            SMSService.verifyUserMobile($scope, $scope.requestnumber, [player])
                        } else {
                            SearchStore.RequestNumber($scope.myprofile, player).then(function (value) {
                                player.status = 1;
                                player.statusdesc = "Number Requested";
                                player.color = "white";
                                player.backcolor = "#2ab042";

                                console.log($scope.myprofile);
                                console.log(player);
                                LoginStore.SendNotification("Hello, I am " + $scope.myprofile.firstname + " " + $scope.myprofile.lastname + " . Can I invite you to a match?", player.devicetoken);

                                $scope.$apply();

                            }, function (error) {
                                alert(error.message);
                            })
                        }
                    });

                }
            }

        }

        //Filter bar stuff
        var filterBarInstance;

        //function getItems () {
        //    var items = [];
        //    for (var x = 1; x < 2000; x++) {
        //        items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
        //    }
        //    $scope.items = items;
        //}

        //getItems();

        //$scope.$digest();
        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.allfreeplayers,
                update: function (filteredItems, filterText) {
                    if (filterText != "" && filterText != null) {
                        console.log("filterText is: " + filterText)
                        $scope.filteredPlayers = filteredItems;
                    }
                    else {
                        console.log("filterText non empty is: " + filterText)
                        $scope.filteredPlayers = $scope.allfreeplayers;
                    }
                }//,
                //filterProperties: ['displayname', 'firstname', 'lastname']
            });
        };


        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                getItems();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        //------------filter bar stuff ----/
    })
