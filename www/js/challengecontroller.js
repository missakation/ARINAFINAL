
angular.module('football.controllers')



    .controller('ChallengeController', function ($scope, TeamStores, ChallengeStore, $state, $ionicPopup, $ionicLoading, $ionicPopover, pickerView, $ionicFilterBar) {

        $scope.myteam = $state.params.myteam;

        var numofplayersArr = [];
        //alert(JSON.stringify($state.params.myteam));

        //alert("Key:" +$scope.myteam.key);
        //alert($scope.myteam);



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

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        //tomorrow.date.setDate($scope.search.date.getDate() + 1);
        tomorrow.setHours(21);
        tomorrow.setMinutes(0);
        tomorrow.setMilliseconds(0);
        tomorrow.setSeconds(0);

        // set the rate and max variables
        $scope.rating = {};
        $scope.rating.rate = 3;
        $scope.rating.max = 5;


        $scope.search = {
            date: tomorrow,
            text: "Tomorrow, 9:00PM - 5 VS 5 " ,
            players: 5
        };

        TeamStores.GetTeamInfoByKey($scope.myteam.key, function (teaminfo) {
            //alert(JSON.stringify(teaminfo));


            if (teaminfo.teamofeleven) {
                numofplayersArr.push(" 11 Vs 11");
                $scope.search.players = "11";
            }
            if (teaminfo.teamoften) {
                numofplayersArr.push(" 10 Vs 10");
                $scope.search.players = "10";
            }

            if (teaminfo.teamofnine) {
                numofplayersArr.push(" 9 Vs 9");
                $scope.search.players = "9";
            }


            if (teaminfo.teamofeight) {
                numofplayersArr.push(" 8 Vs 8");
                $scope.search.players = "8";
            }


            if (teaminfo.teamofseven) {
                numofplayersArr.push(" 7 Vs 7");
                $scope.search.players = "7";
            }



            if (teaminfo.teamofsix) {
                numofplayersArr.push(" 6 Vs 6");
                $scope.search.players = "6";
            }

            numofplayersArr.reverse();


            if (teaminfo.teamoffive) {
                numofplayersArr.push(" 5 Vs 5");
                $scope.search.players = "5";
            }
        });

		$scope.search.text = "Tomorrow, 9:00PM - " + numofplayersArr[0];
		
		
		
        $scope.openPickerView = function openPickerView() {

            var picker = pickerView.show({
                titleText: '', // default empty string
                doneButtonText: 'Search', // dafault 'Done'
                cancelButtonText: 'Close', // default 'Cancel'
                items: [{
                    values: dateArrayThingy,
                    defaultIndex: 0
                }, {
                    values: [' 7:00 AM ', ' 7:30 AM ', ' 8:00 AM ', ' 8:30 AM ', ' 9:00 AM ', '9:30 AM ', ' 10:00 AM ', ' 10:30 AM', ' 11:00 AM ', ' 11:30 AM ', ' 12:00 PM ', ' 1:00 PM ', ' 1:30 PM ', ' 2:00 PM ', ' 2:30 PM ', ' 3:00 PM ', ' 3:30 PM ', ' 4:00 PM ', ' 4:30 PM ', ' 5:00 PM ', ' 5:30 PM ', ' 6:00 PM ', ' 6:30 PM ', ' 7:00 PM ', ' 7:30 PM ', ' 8:00 PM', ' 8:30 PM ', ' 9:00 PM ', ' 9:30 PM ', ' 10:00 PM ', ' 10:30 PM ', ' 11:00 PM', '11:30 PM ', ' 12:00 AM ',],
                    defaultIndex: 27
                }, {
                    //values: [" 5 Vs 5", " 6 Vs 6", " 7 Vs 7", " 8 Vs 8", " 9 Vs 9", " 10 Vs 10", " 11 Vs 11"],
                    values: numofplayersArr,
                    defaultIndex: 0
                }]
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
                        $scope.search.players = (output[2].split(" "))[1];
                        console.log($scope.search.date);
                        $scope.search.text = output.join(" - ");
                        console.log($scope.search.players);
                        $scope.checkfree();
                    }
                });
            }


        };
        /** End picker view stufgf**/


        $scope.selectedteams = [];

        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/my-popover.html', {
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


        $scope.checkfree = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            try {
                //works
                //toRad function
                if (typeof (Number.prototype.toRad) === "undefined") {
                    Number.prototype.toRad = function () {
                        return this * Math.PI / 180;
                    }
                }

                var date = new Date();
                ChallengeStore.GetAllTeamsNotMe($scope.myteam, $scope.search, function (leagues) {

                    $ionicLoading.hide();
                    $scope.allteamsnotme = leagues;
                    $scope.filteredTeams = $scope.allteamsnotme;



                    if ($scope.allteamsnotme.length == 0) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Team Found'
                        });
                    }
                    else {
                        $scope.allteamsnotme.forEach(function (element) {
                            if (element.teamadmin != null || element.teamadmin != "") {
                                firebase.database().ref('/playersinfo/' + element.teamadmin).on('value', function (snapshot) {
                                    element.captainname = snapshot.val().firstname + " " + snapshot.val().lastname;
                                    element.captainphoto = snapshot.val().photoURL == "" ? 'img/PlayerProfile.png' : snapshot.val().photoURL;


                                    if (snapshot.child("lastseen").exists()) {
                                        element.lastseen =
                                            {
                                                year: 0,
                                                month: 0,
                                                day: 0,
                                                hour: 0,
                                                minute: 0
                                            };
                                        element.lastseen.year = snapshot.val().lastseen.loginyear;
                                        element.lastseen.month = snapshot.val().lastseen.loginmonth;
                                        element.lastseen.day = snapshot.val().lastseen.loginday;
                                        element.lastseen.hour = snapshot.val().lastseen.loginhour;
                                        element.lastseen.minute = snapshot.val().lastseen.loginminute;

                                        element.lastseen.date = new Date();
                                        element.lastseen.date.setMinutes(snapshot.val().lastseen.loginminute);
                                        element.lastseen.date.setFullYear(snapshot.val().lastseen.loginyear);
                                        element.lastseen.date.setMonth(snapshot.val().lastseen.loginmonth);
                                        element.lastseen.date.setHours(snapshot.val().lastseen.loginhour);
                                        element.lastseen.date.setDate(snapshot.val().lastseen.loginday);

                                        var difference = (new Date() - element.lastseen.date) / 1000 / 60;

                                        if (difference < 20) {
                                            element.lastseen.text = "Online";
                                        }
                                        else
                                            if (difference <= 60) {
                                                element.lastseen.text = Math.floor(difference) + " mins. ago";
                                            }
                                            else
                                                if (difference <= 24 * 60) {
                                                    element.lastseen.text = Math.floor(difference / 60) + " hrs. ago";
                                                }
                                                else
                                                    if (difference >= 24 * 60 && difference <= 48 * 60) {
                                                        element.lastseen.text = "Yesterday";
                                                    }
                                                    else {
                                                        element.lastseen.text = (Math.floor((difference / 60 / 24))) + " days ago";
                                                    }

                                    }

                                })
                            }

                            /** Converts numeric degrees to radians */
                            var lat1 = $scope.myteam.favlatitude;
                            var lon1 = $scope.myteam.favlongitude;

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

                            element.points = Math.abs(($scope.myteam.rating - element.rating)) + element.distance * 5 + ((5 - element.reviewrating) * 20);

                        }, this);
                    }

                })

                $scope.$apply();
            }
            catch (error) {
                alert(error.message);
            }
        }


        try {
            //works

            var date = new Date();
            $scope.checkfree();
        }
        catch (error) {
            alert(error.message);
        }

        $scope.updateselectedteams = function (team) {

            try {

                if (team.selected == "unselect") {
                    $scope.selectedteams = $scope.selectedteams.filter(function (el) {
                        return el.key !== team.key;
                    });
                    team.selected = "select";
                    team.color = "#28b041";
                    team.backcolor = "white";

                }
                else {
                    if ($scope.selectedteams.length == 3) {
                        $ionicPopup.alert({
                            title: 'Forbidden',
                            template: 'You cannot select more than 3 teams'
                        });
                    }
                    else {

                        $scope.selectedteams.push(angular.copy(team));
                        team.selected = "unselect";
                        team.color = "white";
                        team.backcolor = "#28b041";

                    }
                }
            }
            catch (error) {
                alert(error.message);
            }

        }

        $scope.choosestadium = function () {
            try {


                if ($scope.selectedteams.length == 0) {
                    $ionicPopup.alert({
                        title: 'Select a Team',
                        template: 'You have to select at least one team'
                    });
                }
                else {

                    $state.go('app.challengeteamstadium',

                        {
                            date: $scope.search.date,
                            players: $scope.search.players,
                            visualText: $scope.search.text,
							gabig: "vardig",
                            teams: $scope.selectedteams,
                            myteam: $scope.myteam
                        });
                }
            }
            catch (error) {
                alert(error.message);
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


        $scope.filteredTeams = $scope.allteamsnotme;
        //$scope.$digest();
        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.allteamsnotme,
                update: function (filteredItems, filterText) {
                    if (filterText != "" && filterText != null) {
                        console.log("filterText is: " + filterText)
                        $scope.filteredTeams = filteredItems;
                    }
                    else {
                        console.log("filterText non empty is: " + filterText)
                        $scope.filteredTeams = $scope.allteamsnotme;
                    }
                },
                filterProperties: "teamname"
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






    .controller('challengestadiumcontroller', function ($http, $scope, $ionicHistory, LoginStore, ChallengeStore, HomeStore, ReservationFact, $state, $stateParams, $ionicPopup, $ionicLoading, $ionicPopover, $ionicFilterBar) {
        $scope.selectedstadiums = [];
        $scope.challengestatus = false;
        $scope.selecteddate =
            {
                date: $state.params.date,
                text: $state.params.visualText
            };

        $scope.myteam = $state.params.myteam;

        ReservationFact.FindFreeStadiums($state.params, function (leagues) {

            $scope.globalstadiums = leagues;
            $scope.allfreestadiums = leagues;

            if (leagues.length == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'No Available Stadiums'
                });
            }


            // Simple GET request example:
            $http({
                method: 'GET',
                url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
            }).then(function successCallback(response) {

                $scope.currentdate = new Date(response.data);
                HomeStore.GetProfileInfo($scope.currentdate, function (myprofile) {

                    $scope.profile = myprofile;

                })

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

            ///** Converts numeric degrees to radians */

            //for (var i = 0; i < leagues.length; i++)
            //{
            //    var lat1 = $scope.latitude;
            //    var lon1 = $scope.longitude;

            //    var lat2 = $scope.globalstadiums[i].latitude;
            //    var lon2 = $scope.globalstadiums[i].longitude;


            //    var R = 6371; // km 
            //    //has a problem with the .toRad() method below.
            //    var x1 = lat2 - lat1;

            //    var dLat = x1.toRad();

            //    var x2 = lon2 - lon1;
            //    var dLon = x2.toRad();
            //    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            //        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            //        Math.sin(dLon / 2) * Math.sin(dLon / 2);
            //    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            //    var d = R * c; // Distance in km

            //    $scope.globalstadiums[i].distance = d;
            //    // LOGIC FOR POINTS START
            //    var distancePoint = $scope.globalstadiums[i].distance * 1.5;
            //    var ratingPoint = (5 - (parseInt($scope.globalstadiums[i].rating))) * 3;
            //    var diff = Math.abs(new Date($scope.globalstadiums[i].datetime) - new Date());
            //    var minutes = Math.floor((diff / 1000) / 60);
            //    var timePoint = (minutes / 30) * 5;
            //    var favouritePoint = 0;
            //    var favstadiumname = profileInfoSnapshot.child("favstadiumname").val();
            //    if (favstadiumname === $scope.globalstadiums[i].stadiumname) {
            //        favouritePoint = -10;
            //    }
            //    var totlPoints = Math.floor(distancePoint + ratingPoint + timePoint + favouritePoint);
            //    $scope.globalstadiums[i].points = -totlPoints;

            //}

            $scope.filteredStadiums = $scope.allfreestadiums;


            if (typeof (Number.prototype.toRad) === "undefined") {
                Number.prototype.toRad = function () {
                    return this * Math.PI / 180;
                }
            }
        })
        $scope.updateselectedteams = function (stadiums) {

            try {

                if (stadiums.selected == "unselect") {
                    $scope.selectedstadiums = $scope.selectedstadiums.filter(function (el) {
                        return ((el.stadiumkey !== stadiums.stadiumkey) || (el.stadiumkey == stadiums.stadiumkey && el.ministadiumkey !== stadiums.ministadiumkey));
                    });
                    stadiums.selected = "select";
                    stadiums.color = "#28b041";
                    stadiums.backcolor = "white";

                }
                else {
                    if ($scope.selectedstadiums.length == 3) {
                        $ionicPopup.alert({
                            title: 'Forbidden',
                            template: 'You cannot select more than 3 stadiums'
                        });
                    }
                    else {
                        $scope.selectedstadiums.push(angular.copy(stadiums));
                        stadiums.selected = "unselect";
                        stadiums.color = "white";
                        stadiums.backcolor = "#28b041";
                    }
                }
            }
            catch (error) {
                alert(error.message);
            }


        }
        $scope.sendchallenge = function () {

            try {

                $scope.challengestatus = true;
                if ($scope.selectedstadiums == 0) {
                    $ionicPopup.alert({
                        title: 'Select a Stadium',
                        template: 'You have to select at least one stadium'
                    });
                }
                else {

                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Confirm',
                        template: 'Are you sure you want to send the challenges?'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {
                            $ionicLoading.show({
                                content: 'Loading',
                                animation: 'fade-in',
                                showBackdrop: true,
                                maxWidth: 200,
                                showDelay: 0
                            });
                            ChallengeStore.GetNumChallengeByDate($state.params.date, $scope.myteam, function (result) {
                                if (result + $state.params.teams.length < 4) {
                                    ChallengeStore.ChallengeTeams($state.params.date, $state.params.numplayers, $state.params.teams, $scope.selectedstadiums, $scope.myteam, $scope.profile)
                                        .then(function (value) {
                                            $state.params.teams.forEach(function (element) {

                                                firebase.database().ref('/playersinfo/' + element.teamadmin).on('value', function (snapshot) {

                                                    /// PLAYER TOKENS
                                                    var Tokens = [];
                                                    if (snapshot.val().hasOwnProperty("devicetoken")) {
                                                        for (var k in snapshot.val().devicetoken) {
                                                            if (snapshot.val().devicetoken.hasOwnProperty(k)) {
                                                                Tokens.push(k);
                                                            }
                                                        }
                                                    }

                                                    if (snapshot.val().devicetoken) {
                                                        if (snapshot.val().settings.notification) {
                                                            LoginStore.SendNotification($scope.myteam.teamname + ' challenges you to play a game at ' + $state.params.date + ' vs your team ' + element.teamname, Tokens).then(function (res) {
                                                                console.log(res);
                                                            });;
                                                        }
                                                    } else {
                                                    }
                                                })

                                            })
                                            $ionicLoading.hide();
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Success',
                                                template: 'Successfully Challenged'
                                            }).then(function () {
                                                $ionicHistory.nextViewOptions({
                                                    disableBack: true
                                                });
                                                $state.go("app.homepage");
                                            });
                                        }, function (error) {
                                            $ionicLoading.hide();
                                            alert(error.message);
                                        })
                                }
                                else {
                                    $ionicLoading.hide();
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: 'You have ' + (3 - result) + ' challenges left for the selected date'
                                    }).then(function () {

                                    });
                                }

                            }, function (error) {
                                $ionicLoading.hide();
                                alert(error.message);
                            })



                        }


                    })


                }
                $scope.challengestatus = false;
            }
            catch (error) {
                alert(error.message);
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


        $scope.filteredStadiums = $scope.allfreestadiums;
        //$scope.$digest();
        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.allfreestadiums,
                update: function (filteredItems, filterText) {
                    if (filterText != "" && filterText != null) {
                        console.log("filterText is: " + filterText)
                        $scope.filteredStadiums = filteredItems;
                    }
                    else {
                        console.log("filterText non empty is: " + filterText)
                        $scope.filteredStadiums = $scope.allfreestadiums;
                    }
                },
                filterProperties: "stadiumname"
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

    .controller('ChooseYourTeamController', function ($scope, $ionicPopup, $ionicLoading, $state, $stateParams, ChallengeStore, $timeout) {

        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            // handle event
            //works
            try {

                ChallengeStore.GetMyAdminTeams(function (myteams) {

                    $ionicLoading.hide();
                    $scope.allmyteams = myteams;

                    $scope.allmyteams.forEach(function (element) {

                        firebase.database().ref('/teaminfo/' + element.key).on('value', function (snapshot) {
                            if (snapshot.exists()) {
                                element.members = snapshot.child("players").numChildren() - 1;
                                element.rank = snapshot.child("rank").val();
                                element.rating = snapshot.child("rating").val(),
                                    element.favlatitude = snapshot.child("favlatitude").val(),
                                    element.favlongitude = snapshot.child("favlongitude").val()
                            }
                            else {
                                element.members = "Not Found";
                                element.rank = "Not Found";
                                element.rating = "Not Found";
                            }

                        })

                    })

                    if (myteams.length == 0) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Empty',
                            template: 'You do not belong to any team right now'
                        });
                    }

                    if (myteams.length == 4) {
                        $scope.gochallengeteams($scope.test[0]);
                    }

                })

            }
            catch (error) {
                alert(error.message);
            }
        });


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });



        $scope.gochallengeteams = function (team) {
            console.log("HEREEEE");
            console.log(team);
            try {
                if ($state.params.otherteam || $state.params.otherteam != null) {
                    $state.go('app.challengeteamstadium',

                        {
                            date: new Date(),
                            teams: $state.params.otherteam,
                            myteam: team
                        });
                }
                else {
                    $state.go('app.challengeteam',

                        {
                            myteam: team
                        });
                }


            }


            catch (error) {
                alert(error.message);
            }
        }


    })

