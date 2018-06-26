
angular.module('football.controllers')
    .controller('stadiumcontroller', function ($scope, LoginStore, $ionicPlatform, $ionicScrollDelegate, $http, $ionicPopover, $interval, $ionicHistory, ReservationFact, $ionicPopup, $ionicLoading, $timeout, $state, $cordovaDatePicker, pickerView, SMSService, $ionicFilterBar) {


        /*var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('/players/' + userId).once('value').then(function (snapshot) {

            var Tokens = [];
            var UserProfile = snapshot.val();
            if (UserProfile.hasOwnProperty("devicetoken")) {
                for (var k in UserProfile.devicetoken) {
                    if (UserProfile.devicetoken.hasOwnProperty(k)) {
                        Tokens.push(k);
                    }
                }
                LoginStore.SendNotification("Testation", Tokens).then(function (res) {
                })
            }

        })*/

        $scope.$on("$ionicView.afterEnter", function (event, data) {
            // handle event
            //works

            $timeout(function () {

                try {

                    var user = firebase.auth().currentUser;

                    if (!(user === null || user == '' || user === undefined)) {

                        LoginStore.UpdateLastSeen();

                        window.plugins.OneSignal.getIds(function (ids) {
                            var updates = {};
                            updates['/players/' + user.uid + '/devicetoken/' + ids.userId] = true;
                            updates['/playersinfo/' + user.uid + '/devicetoken/' + ids.userId] = true;
                            firebase.database().ref().update(updates).then(function () {
                            });
                        });

                    }

                }
                catch (err) {

                }
            }, 3000)

        })


        $scope.ispickeropened = false;

        $scope.openPickerView = function openPickerView() {

            $scope.ispickeropened = true;

            var picker = pickerView.show({
                titleText: '', // default empty string
                doneButtonText: 'Search Stadiums', // dafault 'Done'
                cancelButtonText: 'Close', // default 'Cancel'
                items: [{
                    values: dateArrayThingy,
                    defaultIndex: 1
                }, {
                    values: [' 7:00 AM ', ' 7:30 AM ', ' 8:00 AM ', ' 8:30 AM ', ' 9:00 AM ', '9:30 AM ', ' 10:00 AM ', ' 10:30 AM', ' 11:00 AM ', ' 11:30 AM ', ' 12:00 PM ', ' 12:30 PM ', ' 1:00 PM ', ' 1:30 PM ', ' 2:00 PM ', ' 2:30 PM ', ' 3:00 PM ', ' 3:30 PM ', ' 4:00 PM ', ' 4:30 PM ', ' 5:00 PM ', ' 5:30 PM ', ' 6:00 PM ', ' 6:30 PM ', ' 7:00 PM ', ' 7:30 PM ', ' 8:00 PM', ' 8:30 PM ', ' 9:00 PM ', ' 9:30 PM ', ' 10:00 PM ', ' 10:30 PM ', ' 11:00 PM', '11:30 PM '],
                    defaultIndex: 27
                }, {
                    values: [" 5 Vs 5", " 6 Vs 6", " 7 Vs 7", " 8 Vs 8", " 9 Vs 9", " 10 Vs 10", " 11 Vs 11"],
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
                        $scope.checkfree();
                    }
                });
            }
        };

        $ionicPlatform.registerBackButtonAction(function (e) {

            if (pickerView.isShowing()) {
                e.preventDefault();
                pickerView.close();
            }
            else {
                $ionicHistory.goBack();
            }


        }, 100);

        $scope.CurrentRate = {};
        $scope.notratedstadiums = [];
        $scope.RateLeft = false;

        $scope.RateStadium = function () {

            var updates = {};
            var userid = firebase.auth().currentUser.uid;

            updates['/players/' + userid + "/rated/" + $scope.CurrentRate.stadiumkey + $scope.CurrentRate.ministadiumkey] = {
                rated: 1,
                rate: $scope.CurrentRate.rate,
                stadiumkey: $scope.CurrentRate.stadiumkey,
                ministadiumkey: $scope.CurrentRate.ministadiumkey,
                date: $scope.CurrentRate.date
            };

            updates['stadiums/' + $scope.CurrentRate.stadiumkey + '/ministadiums/' + $scope.CurrentRate.ministadiumkey + "/rated/" + userid] = {
                rated: 1,
                rate: $scope.CurrentRate.rate,
                stadiumkey: $scope.CurrentRate.stadiumkey,
                ministadiumkey: $scope.CurrentRate.ministadiumkey,
                date: $scope.CurrentRate.date

            };

            firebase.database().ref().update(updates);


            $scope.RateLeft = false;
            var alertPopup = $ionicPopup.alert({
                template: 'Thank You So Much <3 !'
            });


            setTimeout(() => {
                $scope.OpenRate();
            }, 2000)

        }


        $scope.CancelRate = function () {
            var updates = {};
            var userid = firebase.auth().currentUser.uid;

            updates['/players/' + userid + "/rated/" + $scope.CurrentRate.stadiumkey + $scope.CurrentRate.ministadiumkey] = {
                rated: 2,
                rate: 0,
                stadiumkey: $scope.CurrentRate.stadiumkey,
                ministadiumkey: $scope.CurrentRate.ministadiumkey,
                date: $scope.CurrentRate.date
            };

            updates['stadiums/' + $scope.CurrentRate.stadiumkey + '/ministadiums/' + $scope.CurrentRate.ministadiumkey + "/rated/" + userid] = {
                rated: 2,
                rate: 0,
                stadiumkey: $scope.CurrentRate.stadiumkey,
                ministadiumkey: $scope.CurrentRate.ministadiumkey,
                date: $scope.CurrentRate.date

            };

            firebase.database().ref().update(updates);
            $scope.RateLeft = false;

            setTimeout(() => {
                $scope.OpenRate();
            }, 2000)
        }

        $scope.OpenRate = function () {

            if ($scope.notratedstadiums.length > 0) {
                $scope.CurrentRate = $scope.notratedstadiums.pop();
                $scope.RateLeft = true;
            }
            $scope.$apply();

        }
        setTimeout(() => {

            var userid = firebase.auth().currentUser.uid;
            firebase.database().ref('/players/' + userid + "/rated/").orderByChild("rated").equalTo(0)
                .once('value', function (snapshot) {

                    for (const key in snapshot.val()) {

                        var Obj = snapshot.val()[key];

                        var MatchDate = new Date(Obj.date);
                        MatchDate.setMinutes(MatchDate.getMinutes() + 90);

                        if (new Date() > MatchDate) {

                            $scope.notratedstadiums.push(Obj);

                        }

                    }

                    $scope.OpenRate();

                })


        }, 5000);

        $scope.notverified = false;
        $scope.nointernet = false;
        $scope.gotlocation = false;
        $scope.latitude = 0;
        $scope.longitude = 0;

        $scope.filter = {
            indoor: true,
            outdoor: true,
            clay: true,
            grass: true,
            money: 0

        };

        $scope.popupopen = false;

        $scope.white = "white";
        $scope.backcolor = "#28b041";



        $scope.managecolors =
            {
                indoor:
                {
                    color: "#28b041",
                    backcolor: "white",
                    selected: false
                },
                outdoor:
                {
                    color: "#28b041",
                    backcolor: "white",
                    selected: false
                },
                anydoor:
                {
                    color: "#28b041",
                    backcolor: "white",
                    selected: true
                },
                grass:
                {
                    color: "#28b041",
                    backcolor: "white",
                    selected: false
                },
                ground:
                {
                    color: "#28b041",
                    backcolor: "white",
                    selected: false
                },
                anyground:
                {
                    color: "#28b041",
                    backcolor: "white",
                    selected: true
                },
                sortby: "-points",
                sortbyfilter: "-points",
                distancefrom: 0,
                distanceto: 100,
                pricefrom: 0,
                priceto: 300000
            }

        $scope.distanceslider = {
            minValue: 0,
            maxValue: 100,
            options: {
                step: 1
            }
        };

        $scope.priceslider = {
            minValue: 0,
            maxValue: 300000,
            options: {
                step: 10000
            }
        };

        $scope.updatedoortype = function (x) {

            $scope.managecolors.indoor.selected = false;
            $scope.managecolors.outdoor.selected = false;
            $scope.managecolors.anydoor.selected = false;


            console.log("test");
            switch (x) {
                case "indoor":
                    $scope.managecolors.indoor.selected = true;

                    break;
                case "outdoor":
                    $scope.managecolors.outdoor.selected = true;
                    break;
                case "anydoor":
                    $scope.managecolors.anydoor.selected = true;
                    break;
            }

            $scope.updatecolors();

        }

        $scope.updategroundtype = function (x) {
            $scope.managecolors.grass.selected = false;
            $scope.managecolors.ground.selected = false;
            $scope.managecolors.anyground.selected = false;

            switch (x) {
                case "grass":
                    $scope.managecolors.grass.selected = true;
                    break;
                case "ground":
                    $scope.managecolors.ground.selected = true;
                    break;
                case "anyground":
                    $scope.managecolors.anyground.selected = true;
                    break;
            }
            $scope.updatecolors();
        }

        $scope.updatecolors = function () {
            $scope.managecolors.indoor.color = $scope.managecolors.indoor.selected ? $scope.white : $scope.backcolor;
            $scope.managecolors.indoor.backcolor = $scope.managecolors.indoor.selected ? $scope.backcolor : $scope.white;

            $scope.managecolors.outdoor.color = $scope.managecolors.outdoor.selected ? $scope.white : $scope.backcolor;
            $scope.managecolors.outdoor.backcolor = $scope.managecolors.outdoor.selected ? $scope.backcolor : $scope.white;

            $scope.managecolors.anydoor.color = $scope.managecolors.anydoor.selected ? $scope.white : $scope.backcolor;
            $scope.managecolors.anydoor.backcolor = $scope.managecolors.anydoor.selected ? $scope.backcolor : $scope.white;

            $scope.managecolors.ground.color = $scope.managecolors.ground.selected ? $scope.white : $scope.backcolor;
            $scope.managecolors.ground.backcolor = $scope.managecolors.ground.selected ? $scope.backcolor : $scope.white;

            $scope.managecolors.grass.color = $scope.managecolors.grass.selected ? $scope.white : $scope.backcolor;
            $scope.managecolors.grass.backcolor = $scope.managecolors.grass.selected ? $scope.backcolor : $scope.white;

            $scope.managecolors.anyground.color = $scope.managecolors.anyground.selected ? $scope.white : $scope.backcolor;
            $scope.managecolors.anyground.backcolor = $scope.managecolors.anyground.selected ? $scope.backcolor : $scope.white;


        }

        $scope.updatecolors();

        $scope.choice = {
            sort: 'price'
        };
        $scope.tempchoice = {
            sort: 'price'
        };

        // .fromTemplate() method
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
        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {

        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
        });


        $scope.slider6 = {
            minValue: 1,
            maxValue: 23,
            options: {
                floor: 0,
                showSelectionBar: true,
                readOnly: false,
                disabled: false,
                getSelectionBarColor: function (value) {
                    return 'dark#28b041';
                },
                getPointerColor: function (value) {
                    return 'lightgrey';

                },
                ceil: 23,
                draggableRange: true

            }
        };

        //alert(TeamStore.GetAccountInfo().code);
        // set the rate and max variables
        $scope.rating = {};
        $scope.rating.rate = 3;
        $scope.rating.max = 5;

        $scope.readOnly = true;

        var freestadiums = [];


        //$scope.search.date = "2013-01-08";
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(21);
        tomorrow.setMinutes(0);
        tomorrow.setMilliseconds(0);
        tomorrow.setSeconds(0);

        $scope.search = {
            date: tomorrow,
            text: "Tomorrow, 9:00PM - 5 Vs 5 ",
            players: 5
        };




        $scope.search.date = tomorrow;

        $scope.allfreestadiums = [];


        $scope.checkfree = function () {

            $ionicScrollDelegate.scrollTop();

            $scope.allfreestadiums = [];
            $scope.filteredStadiums = [];

            if (!$scope.nointernet) {

                if ($scope.search.date > new Date()) {
                    //here
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    //works
                    ReservationFact.FindFreeStadiums($scope.search, function (leagues) {

                        $ionicLoading.hide();
                        $scope.globalstadiums = leagues;

                        $scope.globalstadiums.forEach(element => {
                            element.datetime.forEach(item => {
                                item.datetimeto = new Date();

                                item.datetimeto.setFullYear(item.datetime.getFullYear());
                                item.datetimeto.setDate(item.datetime.getDate());
                                item.datetimeto.setMonth(item.datetime.getMonth());
                                item.datetimeto.setHours(item.datetime.getHours() + 1);
                                item.datetimeto.setMinutes(item.datetime.getMinutes() + 30);

                                //(item.datetime).setHours(item.datetime.getHours() + 60000);

                            });
                        });

                        if (leagues.length == 0) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'No results',
                                template: 'No Available Stadiums'
                            });
                        }

                        firebase.database().ref('/playersinfo/' + firebase.auth().currentUser.uid).once('value', function (profileInfoSnapshot) {

                            firebase.database().ref('/promotions').once('value', function (Promotions) {

                                var PromotionsList = Promotions.val();

                                $scope.globalstadiums.forEach(element => {

                                    if (PromotionsList.hasOwnProperty(element.stadiumkey)) {

                                        var StadiumPromotions = PromotionsList[element.stadiumkey];

                                        if (StadiumPromotions.hasOwnProperty(element.ministadiumkey)) {

                                            var MiniStadiumPromotions = StadiumPromotions[element.ministadiumkey]

                                            for (var item in MiniStadiumPromotions) {

                                                var PromotionItem = MiniStadiumPromotions[item];

                                                element.datetime.forEach(bookdate => {

                                                    var starttime = new Date();
                                                    var endtime = new Date();

                                                    bookdate.haspromotion = false;

                                                    if (PromotionItem.weekly) {

                                                        var PromotionStartDate = new Date(PromotionItem.DateIssued);

                                                        if (PromotionItem.daynumber == 7) {
                                                            if ((bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() >= PromotionItem.starthour * 60 + PromotionItem.startminute)
                                                                && (bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() <= PromotionItem.endhour * 60 + PromotionItem.endminute)) {
                                                                bookdate.haspromotion = true;
                                                                bookdate.newprice = PromotionItem.newprice;
                                                            }
                                                        }

                                                        else
                                                            if (bookdate.datetime.getDay() == PromotionItem.daynumber) {
                                                                if ((bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() >= PromotionItem.starthour * 60 + PromotionItem.startminute)
                                                                    && (bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() <= PromotionItem.endhour * 60 + PromotionItem.endminute)) {
                                                                    bookdate.haspromotion = true;
                                                                    bookdate.newprice = PromotionItem.newprice;
                                                                }
                                                            }

                                                    }
                                                    else {
                                                        var PromotionStartDate = new Date(PromotionItem.DateIssued);

                                                        if (PromotionItem.daynumber == 7) {

                                                            var timeDiff = Math.abs(bookdate.datetime - PromotionStartDate);
                                                            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                                                            if (diffDays <= 7) {
                                                                if ((bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() >= PromotionItem.starthour * 60 + PromotionItem.startminute)
                                                                    && (bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() <= PromotionItem.endhour * 60 + PromotionItem.endminute)) {
                                                                    bookdate.haspromotion = true;
                                                                    bookdate.newprice = PromotionItem.newprice;
                                                                }
                                                            }

                                                        }

                                                        else if (bookdate.datetime.getDay() == PromotionItem.daynumber) {
                                                            var starttime = new Date(PromotionItem.starttime);
                                                            var endtime = new Date(PromotionItem.endtime);

                                                            if (bookdate.datetime >= starttime && bookdate.datetime <= endtime) {
                                                                bookdate.haspromotion = true;
                                                                bookdate.newprice = PromotionItem.newprice;

                                                            }

                                                        }

                                                    };
                                                })
                                            }

                                        }
                                    }

                                });
                                if ($scope.gotlocation) {
                                    /** Converts numeric degrees to radians */

                                    for (var i = 0; i < leagues.length; i++) {
                                        var lat1 = $scope.latitude;
                                        var lon1 = $scope.longitude;

                                        var lat2 = $scope.globalstadiums[i].latitude;
                                        var lon2 = $scope.globalstadiums[i].longitude;


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
                                        var d = R * c; // Distance in km

                                        $scope.globalstadiums[i].distance = d;
                                        // LOGIC FOR POINTS START
                                        var distancePoint = $scope.globalstadiums[i].distance * 1.5;
                                        var ratingPoint = (5 - (parseInt($scope.globalstadiums[i].rating))) * 3;
                                        var diff = Math.abs(new Date($scope.globalstadiums[i].datetime[1].datetime) - new Date());
                                        var minutes = Math.floor((diff / 1000) / 60);
                                        var timePoint = (minutes / 30) * 5;
                                        var favouritePoint = 0;
                                        var favstadiumname = profileInfoSnapshot.child("favstadiumname").val();
                                        if (favstadiumname === $scope.globalstadiums[i].stadiumname) {
                                            favouritePoint = -10;
                                        }
                                        var totlPoints = Math.floor(distancePoint + ratingPoint + timePoint + favouritePoint);
                                        $scope.globalstadiums[i].points = -totlPoints;

                                    }
                                    $scope.allfreestadiums = $scope.globalstadiums;
                                    $scope.filteredStadiums = $scope.allfreestadiums;
                                    $scope.$apply();

                                    // LOGIC FOR POINTS ENDS
                                }
                                else {

                                    for (var i = 0; i < leagues.length; i++) {

                                        $scope.globalstadiums[i].distance = 0;
                                        // LOGIC FOR POINTS START
                                        var distancePoint = 0;
                                        var ratingPoint = (5 - (parseInt($scope.globalstadiums[i].rating))) * 3;
                                        var diff = Math.abs(new Date($scope.globalstadiums[i].datetime[1].datetime) - new Date());
                                        var minutes = Math.floor((diff / 1000) / 60);
                                        var timePoint = (minutes / 30) * 5;
                                        var favouritePoint = 0;
                                        var favstadiumname = profileInfoSnapshot.child("favstadiumname").val();
                                        if (favstadiumname === $scope.globalstadiums[i].stadiumname) {
                                            favouritePoint = -10;
                                        }
                                        var totlPoints = Math.floor(distancePoint + ratingPoint + timePoint + favouritePoint);
                                        $scope.globalstadiums[i].points = -totlPoints;

                                        $scope.allfreestadiums = $scope.globalstadiums;
                                        $scope.filteredStadiums = $scope.allfreestadiums;
                                        $scope.$apply();
                                    }
                                }

                            })



                        });

                        $scope.popupopen = false;
                    }, function (error) {
                        $ionicLoading.hide();
                    })
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Refresh',
                        template: "The Time You're Searching For Is Before Now. Please Try Another Time."
                    });
                }
            }

        }

        if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
                return this * Math.PI / 180;
            }
        }

        //here
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        //$scope.checkfree();

        //works

        navigator.geolocation.getCurrentPosition(function (position) {

            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;

            $scope.gotlocation = true;

            // Simple GET request example:
            $http({
                method: 'GET',
                url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
            }).then(function successCallback(response) {

                $scope.checkfree();

            }, function errorCallback(response) {


            });


        }, function (error) {

            $scope.checkfree();
        }, {
                enableHighAccuracy: false,
                timeout: 2500,
                maximumAge: 0
            });



        /*setInterval(function () {
            if ($state.current.name == 'app.homepage') {
                if (!$scope.popupopen) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Refresh',
                        template: 'Please Refresh Page'
                    });
        
                    $scope.popupopen = true;
                    alertPopup.then(function (res) {
                        $scope.checkfree();
                    });
                }
            }
        }, 600000)*/

        $scope.reserve = function (search, stadiums, item) {

            if (!$scope.nointernet && item.available) {

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

                    var currentplayer = snapshot.val();

                    var Tokens = [];
                    var StadiumTokens = [];

                    /// PLAYER TOKENS
                    if (currentplayer.hasOwnProperty("devicetoken")) {
                        for (var k in currentplayer.devicetoken) {
                            if (currentplayer.devicetoken.hasOwnProperty(k)) {
                                Tokens.push(k);
                            }
                        }
                    }
                    // STADIUM TOKENS
                    if (stadiums.hasOwnProperty("devicetoken")) {
                        for (var k in stadiums.devicetoken) {
                            if (stadiums.devicetoken.hasOwnProperty(k)) {
                                StadiumTokens.push(k);
                            }
                        }
                    }

                    if (!currentplayer.isMobileVerified) {

                        SMSService.verifyUserMobile($scope, $scope.reserve, [search, stadiums])

                    } else {
                        try {

                            if (item.newprice == undefined)
                                item.newprice = stadiums.price;
                            else
                                stadiums.price = item.newprice;

                            var confirmPopup = $ionicPopup.confirm({
                                cssClass: 'custom-class',
                                title: 'Reserve Stadium',
                                template: 'Are you sure you want to reserve the stadium on '
                                    + item.datetime.toLocaleString()
                                    + " for " + item.newprice + " L.L." + '</br>'
                            });




                            confirmPopup.then(function (res) {
                                if (res) {
                                    var newDate = new Date();
                                    ReservationFact.GetNumReservationsByDate(newDate, function (result) {
                                        if (result < 2) {
                                            $scope.search.date = item.datetime;
                                            $ionicLoading.show({
                                                content: 'Loading',
                                                animation: 'fade-in',
                                                showBackdrop: true,
                                                maxWidth: 200,
                                                showDelay: 0
                                            });
                                            ReservationFact.RegisterFreeStadiums($scope.search, currentplayer, stadiums)
                                                .then(function (value) {

                                                    var updates = {};
                                                    var OriginalBookDate = new Date($scope.search.date);
                                                    var notificationID = null;
                                                    var year = OriginalBookDate.getFullYear();
                                                    var month = OriginalBookDate.getMonth();
                                                    var day = OriginalBookDate.getDate();

                                                    var hour = OriginalBookDate.getHours();
                                                    var minute = OriginalBookDate.getMinutes();
                                                    var subkey = stadiums.ministadiumkey;
                                                    var newkey = subkey + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString();

                                                    var path = '/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + stadiums.ministadiumkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey;

                                                    if (currentplayer.settings.reminder_3hours) {
                                                        //schedule 3 hour reminder
                                                        //creating One Signal scheduled notifications
                                                        var diff = -180;	//reminder before match
                                                        var matchReminderDate = new Date($scope.search.date.getTime() + diff * 60000);
                                                        LoginStore.SendNotification("Your Game Will Start In 3 Hours", Tokens, matchReminderDate).then(function (res) {

                                                            if (res.status == 200) {
                                                                var notificationID = res.data.id;

                                                                var p = path + '/reminderNotificationID'
                                                                updates[p] = notificationID;
                                                                firebase.database().ref().update(updates);
                                                            }
                                                        });
                                                    }

                                                    LoginStore.SendNotification("New Booking on " + $scope.search.date.toString(), StadiumTokens, undefined).then(function (res) {
                                                        console.log(res);
                                                    });;

                                                    var userid = firebase.auth().currentUser.uid;
                                                    firebase.database().ref('/players/' + userid + "/rated/" +
                                                        $scope.search.stadiumkey + $scope.search.ministadiumkey)
                                                        .once('value', function (snapshot) {

                                                            if (!snapshot.exists()) {


                                                                updates['/players/' + userid + "/rated/" + stadiums.stadiumkey + stadiums.ministadiumkey] = {
                                                                    rated: 0,
                                                                    rate: 0,
                                                                    stadiumkey: stadiums.stadiumkey,
                                                                    ministadiumkey: stadiums.ministadiumkey,
                                                                    date: OriginalBookDate
                                                                };

                                                                updates['stadiums/' + stadiums.stadiumkey + '/ministadiums/' + stadiums.ministadiumkey + "/rated/" + userid] = {
                                                                    rated: 0,
                                                                    rate: 0,
                                                                    stadiumkey: stadiums.stadiumkey,
                                                                    ministadiumkey: stadiums.ministadiumkey,
                                                                    date: OriginalBookDate

                                                                };

                                                                if (currentplayer.settings.notification) {
                                                                    //schedule aftermatch notification
                                                                    diff = 10; 	//delay in minutes													
                                                                    var afterMatchNotificationDate = new Date(OriginalBookDate + diff * 60000);

                                                                    LoginStore.SendNotification("How Was Your Match? Rate Your Experience", Tokens, afterMatchNotificationDate).then(function (res) {

                                                                        if (res.status == 200) {
                                                                            var notificationID = res.data.id;

                                                                            var p = path + '/afterMatchNotificationID'
                                                                            updates[p] = notificationID;
                                                                            firebase.database().ref().update(updates);
                                                                        }
                                                                    });
                                                                }

                                                                firebase.database().ref().update(updates);
                                                            }

                                                        })

                                                    $scope.search.date.setDate($scope.search.date.getDate() + 1);
                                                    $scope.search.date.setHours(21);
                                                    $scope.search.date.setMinutes(0);
                                                    $scope.search.date.setMilliseconds(0);
                                                    $scope.search.date.setSeconds(0);

                                                    $scope.search.date = new Date();

                                                    $ionicLoading.hide();

                                                    var alertPopup = $ionicPopup.alert({
                                                        title: 'Success',
                                                        template: 'Successfully Reserved'
                                                    }).then(function (res) {

                                                        $ionicHistory.nextViewOptions({
                                                            disableBack: true
                                                        });
                                                        $state.go("app.bookings");
                                                    });


                                                }, function (error) {
                                                    $ionicLoading.hide();
                                                    var alertPopup = $ionicPopup.alert({
                                                        title: 'Error',
                                                        template: 'Stadium Not Available. Please Try Again'
                                                    });

                                                    alertPopup.then(function (res) {
                                                        // Custom functionality....
                                                    });
                                                    //$scope.allfreestadiums.

                                                })
                                        }

                                        else {
                                            $ionicLoading.hide();
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Error',
                                                template: 'You Cannot Reserve More Than 2 Times a day !'
                                            }).then(function () {

                                            });
                                        }

                                    }, function (error) {
                                    })

                                } else {



                                }

                            });


                        }
                        catch (error) {
                        }
                    }
                });
            }
        };


        $scope.updatefilter = function () {

            $scope.managecolors.sortby = $scope.managecolors.sortbyfilter;

            $scope.closePopover();
            $ionicLoading.show({
                content: 'Applying Filter',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $scope.allfreestadiums = [];

            for (var i = 0; i < $scope.globalstadiums.length; i++) {
                if ($scope.globalstadiums[i].type && $scope.globalstadiums[i].typefloor) {
                    if (($scope.managecolors.anydoor.selected
                        || $scope.globalstadiums[i].type.toLowerCase() == "indoor" && $scope.managecolors.indoor.selected
                        || $scope.globalstadiums[i].type.toLowerCase() == "outdoor" && $scope.managecolors.outdoor.selected)
                        && ($scope.managecolors.anyground.selected
                            || ($scope.globalstadiums[i].typefloor.toLowerCase() == "grass" && $scope.managecolors.grass.selected)
                            || $scope.globalstadiums[i].typefloor.toLowerCase() == "ground" && $scope.managecolors.ground.selected)
                        && ($scope.globalstadiums[i].price <= $scope.managecolors.priceto && $scope.globalstadiums[i].price >= $scope.managecolors.pricefrom)

                        && ($scope.globalstadiums[i].distance <= $scope.managecolors.distanceto && $scope.globalstadiums[i].price >= $scope.managecolors.distancefrom)) {
                        $scope.allfreestadiums.push($scope.globalstadiums[i]);
                    }
                }
            }
            $scope.filteredStadiums = $scope.allfreestadiums;
            //$scope.$apply();
            $ionicLoading.hide();

        }

        $scope.cancelfilter = function () {
            $scope.closePopover();
        }

        setTimeout(() => {
            var connectedRef = firebase.database().ref(".info/connected");
            connectedRef.on("value", function (snap) {
                if (snap.val() === true) {
                    $scope.nointernet = false;
                }
                else {
                    $ionicLoading.hide();
                    $scope.nointernet = true;
                }
            });
        }, 6000)

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

    .controller('stadiumdetailscontroller', function ($scope, LoginStore, $ionicPlatform, $ionicHistory, pickerView, $stateParams, $ionicPopover, ReservationFact, $ionicPopup, $ionicLoading, $timeout, $state, $cordovaDatePicker, SMSService) {

        //alert(JSON.stringify(firebase.database.ServerValue.TIMESTAMP));

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $scope.rating = {};
        $scope.rating.rate = 3;
        $scope.rating.max = 5;

        $scope.CurrentStadium = $stateParams.stadiumid;
        $scope.search = $stateParams.search;

        $scope.Photos = [];

        if ($scope.CurrentStadium.photo != null || $scope.CurrentStadium.photo != undefined) {
            if ($scope.CurrentStadium.photo != '') {
                $scope.Photos.push({ URL: $scope.CurrentStadium.photo });
            }
        }
        if ($scope.CurrentStadium.photo1 != null || $scope.CurrentStadium.photo1 != undefined) {
            if ($scope.CurrentStadium.photo1 != '') {
                $scope.Photos.push({ URL: $scope.CurrentStadium.photo1 });
            }
        }
        if ($scope.CurrentStadium.photo2 != null || $scope.CurrentStadium.photo2 != undefined) {
            if ($scope.CurrentStadium.photo2 != '') {
                $scope.Photos.push({ URL: $scope.CurrentStadium.photo2 });
            }
        }
        if ($scope.CurrentStadium.photo3 != null || $scope.CurrentStadium.photo3 != undefined) {
            if ($scope.CurrentStadium.photo3 != '') {
                $scope.Photos.push({ URL: $scope.CurrentStadium.photo3 });
            }
        }
        if ($scope.CurrentStadium.photo4 != null || $scope.CurrentStadium.photo4 != undefined) {
            if ($scope.CurrentStadium.photo4 != '') {
                $scope.Photos.push({ URL: $scope.CurrentStadium.photo4 });
            }
        }

        var uluru = { lat: $scope.CurrentStadium.cordovalatitude, lng: $scope.CurrentStadium.cordovalongitude };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: uluru
        });
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });

        $scope.LoadPage = function () {
            try {
                //works

                ReservationFact.GetStadiumsByID($scope.CurrentStadium.stadiumkey, function (leagues) {
                    $ionicLoading.hide();
                    $scope.stadiums = leagues;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                })
            }
            catch (error) {

            }
        }

        $ionicPlatform.registerBackButtonAction(function (e) {

            if (pickerView.isShowing()) {
                e.preventDefault();
                pickerView.close();
            }
            else {
                $ionicHistory.goBack();
            }

        }, 100);

        $scope.openPickerView = function openPickerView() {

            var picker = pickerView.show({
                titleText: '', // default empty string
                doneButtonText: 'Search Stadiums', // dafault 'Done'
                cancelButtonText: 'Close', // default 'Cancel'
                items: [{
                    values: dateArrayThingy,
                    defaultIndex: 1
                }, {
                    values: [' 7:00 AM ', ' 7:30 AM ', ' 8:00 AM ', ' 8:30 AM ', ' 9:00 AM ', '9:30 AM ', ' 10:00 AM ', ' 10:30 AM', ' 11:00 AM ', ' 11:30 AM ', ' 12:00 AM ', ' 12:30 PM ', ' 1:00 PM ', ' 1:30 PM ', ' 2:00 PM ', ' 2:30 PM ', ' 3:00 PM ', ' 3:30 PM ', ' 4:00 PM ', ' 4:30 PM ', ' 5:00 PM ', ' 5:30 PM ', ' 6:00 PM ', ' 6:30 PM ', ' 7:00 PM ', ' 7:30 PM ', ' 8:00 PM', ' 8:30 PM ', ' 9:00 PM ', ' 9:30 PM ', ' 10:00 PM ', ' 10:30 PM ', ' 11:00 PM', '11:30 PM '],
                    defaultIndex: 27
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
                        $scope.search.players = $scope.CurrentStadium.players;
                        console.log($scope.search.date);
                        $scope.search.text = output.join(" - ");
                        $scope.checkfree();
                    }
                });
            }
        };

        $scope.checkfree = function () {

            if (!$scope.nointernet) {

                //here
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                //works
                ReservationFact.FindFreeStadiumsById($scope.search, $scope.CurrentStadium, function (leagues) {

                    $ionicLoading.hide();
                    $scope.globalstadiums = leagues;

                    $scope.globalstadiums.forEach(element => {
                        element.datetime.forEach(item => {

                            item.datetimeto = new Date();

                            item.datetimeto.setFullYear(item.datetime.getFullYear());
                            item.datetimeto.setDate(item.datetime.getDate());
                            item.datetimeto.setMonth(item.datetime.getMonth());
                            item.datetimeto.setHours(item.datetime.getHours() + 1);
                            item.datetimeto.setMinutes(item.datetime.getMinutes() + 30);

                            //(item.datetime).setHours(item.datetime.getHours() + 60000);

                        });
                    });


                    firebase.database().ref('/playersinfo/' + firebase.auth().currentUser.uid).once('value', function (profileInfoSnapshot) {

                        firebase.database().ref('/promotions').once('value', function (Promotions) {

                            var PromotionsList = Promotions.val();

                            $scope.globalstadiums.forEach(element => {

                                if (PromotionsList.hasOwnProperty(element.stadiumkey)) {

                                    var StadiumPromotions = PromotionsList[element.stadiumkey];

                                    if (StadiumPromotions.hasOwnProperty(element.ministadiumkey)) {

                                        var MiniStadiumPromotions = StadiumPromotions[element.ministadiumkey]

                                        for (var item in MiniStadiumPromotions) {

                                            var PromotionItem = MiniStadiumPromotions[item];

                                            element.datetime.forEach(bookdate => {

                                                var starttime = new Date();
                                                var endtime = new Date();

                                                bookdate.haspromotion = false;

                                                if (PromotionItem.weekly) {

                                                    var PromotionStartDate = new Date(PromotionItem.DateIssued);

                                                    if (PromotionItem.daynumber == 7) {
                                                        if ((bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() >= PromotionItem.starthour * 60 + PromotionItem.startminute)
                                                            && (bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() <= PromotionItem.endhour * 60 + PromotionItem.endminute)) {
                                                            bookdate.haspromotion = true;
                                                            bookdate.newprice = PromotionItem.newprice;
                                                        }
                                                    }

                                                    else
                                                        if (bookdate.datetime.getDay() == PromotionItem.daynumber) {
                                                            if ((bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() >= PromotionItem.starthour * 60 + PromotionItem.startminute)
                                                                && (bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() <= PromotionItem.endhour * 60 + PromotionItem.endminute)) {
                                                                bookdate.haspromotion = true;
                                                                bookdate.newprice = PromotionItem.newprice;
                                                            }
                                                        }

                                                }
                                                else {
                                                    var PromotionStartDate = new Date(PromotionItem.DateIssued);

                                                    if (PromotionItem.daynumber == 7) {

                                                        var timeDiff = Math.abs(bookdate.datetime - PromotionStartDate);
                                                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                                                        if (diffDays <= 7) {
                                                            if ((bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() >= PromotionItem.starthour * 60 + PromotionItem.startminute)
                                                                && (bookdate.datetime.getHours() * 60 + bookdate.datetime.getMinutes() <= PromotionItem.endhour * 60 + PromotionItem.endminute)) {
                                                                bookdate.haspromotion = true;
                                                                bookdate.newprice = PromotionItem.newprice;
                                                            }
                                                        }

                                                    }

                                                    else if (bookdate.datetime.getDay() == PromotionItem.daynumber) {
                                                        var starttime = new Date(PromotionItem.starttime);
                                                        var endtime = new Date(PromotionItem.endtime);

                                                        if (bookdate.datetime >= starttime && bookdate.datetime <= endtime) {
                                                            bookdate.haspromotion = true;
                                                            bookdate.newprice = PromotionItem.newprice;

                                                        }

                                                    }

                                                };
                                            })
                                        }

                                    }
                                }

                            });
                            if ($scope.gotlocation) {
                                /** Converts numeric degrees to radians */

                                for (var i = 0; i < leagues.length; i++) {
                                    var lat1 = $scope.latitude;
                                    var lon1 = $scope.longitude;

                                    var lat2 = $scope.globalstadiums[i].latitude;
                                    var lon2 = $scope.globalstadiums[i].longitude;


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
                                    var d = R * c; // Distance in km

                                    $scope.globalstadiums[i].distance = d;
                                    // LOGIC FOR POINTS START
                                    var distancePoint = $scope.globalstadiums[i].distance * 1.5;
                                    var ratingPoint = (5 - (parseInt($scope.globalstadiums[i].rating))) * 3;
                                    var diff = Math.abs(new Date($scope.globalstadiums[i].datetime[1].datetime) - new Date());
                                    var minutes = Math.floor((diff / 1000) / 60);
                                    var timePoint = (minutes / 30) * 5;
                                    var favouritePoint = 0;
                                    var favstadiumname = profileInfoSnapshot.child("favstadiumname").val();
                                    if (favstadiumname === $scope.globalstadiums[i].stadiumname) {
                                        favouritePoint = -10;
                                    }
                                    var totlPoints = Math.floor(distancePoint + ratingPoint + timePoint + favouritePoint);
                                    $scope.globalstadiums[i].points = -totlPoints;

                                }

                                $scope.CurrentStadium.datetime = $scope.globalstadiums[0].datetime;

                                $scope.$apply();

                                // LOGIC FOR POINTS ENDS
                            }
                            else {

                                for (var i = 0; i < leagues.length; i++) {

                                    $scope.globalstadiums[i].distance = 0;
                                    // LOGIC FOR POINTS START
                                    var distancePoint = 0;
                                    var ratingPoint = (5 - (parseInt($scope.globalstadiums[i].rating))) * 3;
                                    var diff = Math.abs(new Date($scope.globalstadiums[i].datetime[1].datetime) - new Date());
                                    var minutes = Math.floor((diff / 1000) / 60);
                                    var timePoint = (minutes / 30) * 5;
                                    var favouritePoint = 0;
                                    var favstadiumname = profileInfoSnapshot.child("favstadiumname").val();
                                    if (favstadiumname === $scope.globalstadiums[i].stadiumname) {
                                        favouritePoint = -10;
                                    }
                                    var totlPoints = Math.floor(distancePoint + ratingPoint + timePoint + favouritePoint);
                                    $scope.globalstadiums[i].points = -totlPoints;

                                    $scope.CurrentStadium.datetime = $scope.globalstadiums[0].datetime;

                                    $scope.$apply();
                                }
                            }

                        })



                    });

                    $scope.popupopen = false;
                }, function (error) {
                    $ionicLoading.hide();
                })
            }
        }

        $scope.reserve = function (search, stadiums, item) {

            if (!$scope.nointernet && item.available) {

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

                    var currentplayer = snapshot.val();

                    var Tokens = [];
                    var StadiumTokens = [];

                    /// PLAYER TOKENS
                    if (currentplayer.hasOwnProperty("devicetoken")) {
                        for (var k in currentplayer.devicetoken) {
                            if (currentplayer.devicetoken.hasOwnProperty(k)) {
                                Tokens.push(k);
                            }
                        }
                    }

                    // STADIUM TOKENS
                    if (stadiums.hasOwnProperty("devicetoken")) {
                        for (var k in stadiums.devicetoken) {
                            if (stadiums.devicetoken.hasOwnProperty(k)) {
                                StadiumTokens.push(k);
                            }
                        }
                    }

                    if (!snapshot.val().isMobileVerified) {

                        SMSService.verifyUserMobile($scope, $scope.reserve, [search, stadiums])

                    } else {
                        try {

                            if (item.newprice == undefined)
                                item.newprice = stadiums.price;
                            else
                                stadiums.price = item.newprice;

                            var confirmPopup = $ionicPopup.confirm({
                                cssClass: 'custom-class',
                                title: 'Reserve Stadium',
                                template: 'Are you sure you want to reserve the stadium on '
                                    + item.datetime.toLocaleString()
                                    + " for " + item.newprice + " L.L." + '</br>'
                            });




                            confirmPopup.then(function (res) {
                                if (res) {
                                    var newDate = new Date();
                                    ReservationFact.GetNumReservationsByDate(newDate, function (result) {
                                        if (result < 2) {
                                            $scope.search.date = item.datetime;
                                            $ionicLoading.show({
                                                content: 'Loading',
                                                animation: 'fade-in',
                                                showBackdrop: true,
                                                maxWidth: 200,
                                                showDelay: 0
                                            });
                                            ReservationFact.RegisterFreeStadiums($scope.search, currentplayer, stadiums)
                                                .then(function (value) {

                                                    var OriginalBookDate = new Date($scope.search.date);

                                                    //creating One Signal scheduled notifications
                                                    var diff = -180;	//reminder before match
                                                    var matchReminderDate = new Date($scope.search.date.getTime() + diff * 60000);
                                                    LoginStore.SendNotification("Your Game Will Start In 3 Hours", Tokens, afterMatchNotificationDate).then(function (res) {
                                                        console.log(res);
                                                    });;

                                                    LoginStore.SendNotification("New Booking on " + $scope.search.date.toString(), StadiumTokens, undefined).then(function (res) {
                                                        console.log(res);
                                                    });;

                                                    diff = 10; 	//delay in minutes													
                                                    var afterMatchNotificationDate = new Date($scope.search.date.getTime() + diff * 60000);

                                                    LoginStore.SendNotification("How Was Your Match? Rate Your Experience", Tokens, afterMatchNotificationDate).then(function (res) {
                                                        console.log(res);
                                                    });;


                                                    var userid = firebase.auth().currentUser.uid;
                                                    firebase.database().ref('/players/' + userid + "/rated/" +
                                                        $scope.search.stadiumkey + $scope.search.ministadiumkey)
                                                        .once('value', function (snapshot) {

                                                            if (!snapshot.exists()) {

                                                                var updates = {};
                                                                updates['/players/' + userid + "/rated/" + stadiums.stadiumkey + stadiums.ministadiumkey] = {
                                                                    rated: 0,
                                                                    rate: 0,
                                                                    stadiumkey: stadiums.stadiumkey,
                                                                    ministadiumkey: stadiums.ministadiumkey,
                                                                    date: OriginalBookDate
                                                                };

                                                                updates['stadiums/' + stadiums.stadiumkey + '/ministadiums/' + stadiums.ministadiumkey + "/rated/" + userid] = {
                                                                    rated: 0,
                                                                    rate: 0,
                                                                    stadiumkey: stadiums.stadiumkey,
                                                                    ministadiumkey: stadiums.ministadiumkey,
                                                                    date: OriginalBookDate

                                                                };

                                                                firebase.database().ref().update(updates);
                                                            }
                                                            else {
                                                                if (snapshot.child("rate").val() == 0) {
                                                                    if (currentplayer.settings.notification) {
                                                                        //schedule aftermatch notification
                                                                        diff = 10; 	//delay in minutes													
                                                                        var afterMatchNotificationDate = new Date($scope.search.date.getTime() + diff * 60000);

                                                                        LoginStore.SendNotification("How Was Your Match? Rate Your Experience", Tokens, afterMatchNotificationDate).then(function (res) {
                                                                            console.log(res);
                                                                        });;

                                                                    }
                                                                    if (currentplayer.settings.reminder_3hours) {
                                                                        //schedule 3 hour reminder
                                                                        //creating One Signal scheduled notifications
                                                                        var diff = -180;	//reminder before match
                                                                        var matchReminderDate = new Date($scope.search.date.getTime() + diff * 60000);
                                                                        LoginStore.SendNotification("Your Game Will Start In 3 Hours", Tokens, matchReminderDate).then(function (res) {
                                                                            console.log(res);
                                                                        });;
                                                                    }
                                                                }
                                                            }



                                                        })

                                                    $scope.search.date.setDate($scope.search.date.getDate() + 1);
                                                    $scope.search.date.setHours(21);
                                                    $scope.search.date.setMinutes(0);
                                                    $scope.search.date.setMilliseconds(0);
                                                    $scope.search.date.setSeconds(0);

                                                    $scope.search.date = new Date();

                                                    $ionicLoading.hide();

                                                    var alertPopup = $ionicPopup.alert({
                                                        title: 'Success',
                                                        template: 'Successfully Reserved'
                                                    }).then(function (res) {

                                                        $ionicHistory.nextViewOptions({
                                                            disableBack: true
                                                        });
                                                        $state.go("app.bookings");
                                                    });


                                                }, function (error) {
                                                    $ionicLoading.hide();
                                                    var alertPopup = $ionicPopup.alert({
                                                        title: 'Error',
                                                        template: 'Stadium Not Available. Please Try Again'
                                                    });

                                                    alertPopup.then(function (res) {
                                                        // Custom functionality....
                                                    });
                                                    //$scope.allfreestadiums.

                                                })
                                        }

                                        else {
                                            $ionicLoading.hide();
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Error',
                                                template: 'You Cannot Reserve More Than 2 Times a day !'
                                            }).then(function () {

                                            });
                                        }

                                    }, function (error) {
                                    })

                                } else {

                                }

                            });


                        }
                        catch (error) {
                        }
                    }
                });
            }
        };

        $scope.LoadPage();


    }).factory('pickerView', ['$compile', '$rootScope', '$timeout', '$q', '$ionicScrollDelegate', '$ionicBackdrop',
        function ($compile, $rootScope, $timeout, $q, $ionicScrollDelegate, $ionicBackdrop) {

            var i, j, k, tmpVar;

            var domBody, pickerCtnr, pickerInfo;

            var isInit, isShowing;

            var setElementRotate = function setElementRotate(elemList, ni) {
                if (ni < 0 || ni === undefined) { return; }

                if (ni - 2 >= 0)
                    angular.element(elemList[ni - 2]).removeClass('pre-select');
                if (ni - 1 >= 0)
                    angular.element(elemList[ni - 1]).removeClass('selected').addClass('pre-select');

                angular.element(elemList[ni]).removeClass('pre-select').addClass('selected');
                if (ni + 1 < elemList.length)
                    angular.element(elemList[ni + 1]).removeClass('selected').addClass('pre-select');
                if (ni + 2 < elemList.length)
                    angular.element(elemList[ni + 2]).removeClass('pre-select');
            };

            var init = function init() {
                if (isInit) { return; }

                var template =
                    '<div class="picker-view"> ' +
                    '<div class="picker-accessory-bar">' +
                    '<a class="button button-clear" on-tap="pickerEvent.onCancelBuuton()" ng-bind-html="pickerOptions.cancelButtonText"></a>' +
                    '<h3 class="picker-title" ng-bind-html="pickerOptions.titleText"></h3>' +
                    '<a class="button button-clear" on-tap="pickerEvent.onDoneBuuton()" ng-bind-html="pickerOptions.doneButtonText"></a>' +
                    '</div>' +
                    '<div class="picker-content">' +
                    '<ion-scroll ng-repeat="(idx, item) in pickerOptions.items track by $index" ' +
                    'class="picker-scroll" ' +
                    'delegate-handle="{{ \'pickerScroll\' + idx }}" ' +
                    'direction="y" ' +
                    'scrollbar-y="false" ' +
                    'has-bouncing="true" ' +
                    'overflow-scroll="false" ' +
                    'on-touch="pickerEvent.scrollTouch(idx)" ' +
                    'on-release="pickerEvent.scrollRelease(idx)" ' +
                    'on-scroll="pickerEvent.scrollPicking(event, scrollTop, idx)">' +

                    '<div ng-repeat="val in item.values track by $index"  ng-bind-html="val"></div>' +
                    '</ion-scroll>' +
                    '</div>' +
                    '</div>';

                pickerCtnr = $compile(template)($rootScope);
                pickerCtnr.addClass('hide');

                ['webkitAnimationStart', 'animationstart'].forEach(function runAnimStartHandle(eventKey) {
                    pickerCtnr[0].addEventListener(eventKey, function whenAnimationStart() {
                        if (pickerCtnr.hasClass('picker-view-slidein')) {
                            // Before Show Picker View
                            $ionicBackdrop.retain();
                            isShowing = true;
                        } else if (pickerCtnr.hasClass('picker-view-slideout')) {
                            // Before Hide Picker View
                            isShowing = false;
                        }
                    }, false);
                });

                ['webkitAnimationEnd', 'animationend'].forEach(function runAnimEndHandle(eventKey) {
                    pickerCtnr[0].addEventListener(eventKey, function whenAnimationEnd() {
                        if (pickerCtnr.hasClass('picker-view-slidein')) {
                            // After Show Picker View
                            pickerCtnr.removeClass('picker-view-slidein');
                        } else if (pickerCtnr.hasClass('picker-view-slideout')) {
                            // After Hide Picker View
                            pickerCtnr.addClass('hide').removeClass('picker-view-slideout');
                            $ionicBackdrop.release();
                        }
                    }, false);
                });

                if (!domBody) { domBody = angular.element(document.body); }
                domBody.append(pickerCtnr);
                isInit = true;
            };

            var dispose = function dispose() {
                pickerCtnr.remove();

                for (k in $rootScope.pickerOptions) { delete $rootScope.pickerOptions[k]; }
                delete $rootScope.pickerOptions;
                for (k in $rootScope.pickEvent) { delete $rootScope.pickEvent[k]; }
                delete $rootScope.pickEvent;

                pickerCtnr = pickerInfo = i = j = k = tmpVar = null;

                isInit = isShowing = false;
            };

            var close = function close() {
                if (!isShowing) { return; }

                pickerCtnr.addClass('picker-view-slideout');
            };

            var show = function show(opts) {
                if (!isInit || typeof opts !== 'object') { return undefined; }

                var pickerShowDefer = $q.defer();

                opts.titleText = opts.titleText || '';
                opts.doneButtonText = opts.doneButtonText || 'Done';
                opts.cancelButtonText = opts.cancelButtonText || 'Cancel';

                pickerInfo = [];
                for (i = 0; i < opts.items.length; i++) {
                    if (opts.items[i].defaultIndex === undefined) {
                        opts.items[i].defaultIndex = 0;
                    }

                    // push a empty string to last, because the scroll height problem
                    opts.items[i].values.push('&nbsp;');

                    pickerInfo.push({
                        scrollTopLast: undefined,
                        scrollMaxTop: undefined,
                        eachItemHeight: undefined,
                        nowSelectIndex: opts.items[i].defaultIndex,
                        output: opts.items[i].values[opts.items[i].defaultIndex],
                        isTouched: false,
                        isFixed: false,
                        scrollStopTimer: null
                    });
                }

                for (k in $rootScope.pickerOptions) { delete $rootScope.pickerOptions[k]; }
                delete $rootScope.pickerOptions;
                for (k in $rootScope.pickEvent) { delete $rootScope.pickEvent[k]; }
                delete $rootScope.pickEvent;

                $rootScope.pickerOptions = opts;
                $rootScope.pickerEvent = {
                    onDoneBuuton: function onDoneBuuton() {
                        var pickerOutput = (function () {
                            var totalOutput = [];
                            for (i = 0; i < $rootScope.pickerOptions.items.length; i++) {
                                totalOutput.push(pickerInfo[i].output);
                            }
                            return totalOutput;
                        })();
                        pickerShowDefer.resolve(pickerOutput);
                        close();
                    },
                    onCancelBuuton: function onCancelBuuton() {
                        pickerShowDefer.resolve();
                        close();
                    },
                    scrollTouch: function scrollTouch(pickerIdx) {
                        pickerInfo[pickerIdx].isTouched = true;
                        pickerInfo[pickerIdx].isFixed = false;
                    },
                    scrollRelease: function scrollRelease(pickerIdx) {
                        pickerInfo[pickerIdx].isTouched = false;
                    },
                    scrollPicking: function scrollPicking(e, scrollTop, pickerIdx) {
                        if (!$rootScope.pickerOptions) { return; }

                        if (!pickerInfo[pickerIdx].isFixed) {
                            pickerInfo[pickerIdx].scrollTopLast = scrollTop;

                            // update the scrollMaxTop (only one times)
                            if (pickerInfo[pickerIdx].scrollMaxTop === undefined) {
                                pickerInfo[pickerIdx].scrollMaxTop = e.target.scrollHeight - e.target.clientHeight + e.target.firstElementChild.offsetTop;
                            }

                            // calculate Select Index
                            tmpVar = Math.round(pickerInfo[pickerIdx].scrollTopLast / pickerInfo[pickerIdx].eachItemHeight);

                            if (tmpVar < 0) {
                                tmpVar = 0;
                            } else if (tmpVar > e.target.firstElementChild.childElementCount - 2) {
                                tmpVar = e.target.firstElementChild.childElementCount - 2;
                            }

                            if (pickerInfo[pickerIdx].nowSelectIndex !== tmpVar) {
                                pickerInfo[pickerIdx].nowSelectIndex = tmpVar;
                                pickerInfo[pickerIdx].output = $rootScope.pickerOptions.items[pickerIdx].values[pickerInfo[pickerIdx].nowSelectIndex];

                                // update item states
                                setElementRotate(e.target.firstElementChild.children,
                                    pickerInfo[pickerIdx].nowSelectIndex);
                            }
                        }


                        if (pickerInfo[pickerIdx].scrollStopTimer) {
                            $timeout.cancel(pickerInfo[pickerIdx].scrollStopTimer);
                            pickerInfo[pickerIdx].scrollStopTimer = null;
                        }
                        if (!pickerInfo[pickerIdx].isFixed) {
                            pickerInfo[pickerIdx].scrollStopTimer = $timeout(function () {
                                $rootScope.pickerEvent.scrollPickStop(pickerIdx);
                            }, 80);
                        }
                    },
                    scrollPickStop: function scrollPickStop(pickerIdx) {
                        if (pickerInfo[pickerIdx].isTouched || pickerIdx === undefined) {
                            return;
                        }

                        pickerInfo[pickerIdx].isFixed = true;

                        // check each scroll position
                        for (j = $ionicScrollDelegate._instances.length - 1; j >= 1; j--) {
                            if ($ionicScrollDelegate._instances[j].$$delegateHandle !== ('pickerScroll' + pickerIdx)) { continue; }

                            // fixed current scroll position
                            tmpVar = pickerInfo[pickerIdx].eachItemHeight * pickerInfo[pickerIdx].nowSelectIndex;
                            if (tmpVar > pickerInfo[pickerIdx].scrollMaxTop) {
                                tmpVar = pickerInfo[pickerIdx].scrollMaxTop;
                            }
                            $ionicScrollDelegate._instances[j].scrollTo(0, tmpVar, true);
                            break;
                        }
                    }
                };

                (function listenScrollDelegateChanged(options) {
                    var waitScrollDelegateDefer = $q.defer();

                    var watchScrollDelegate = $rootScope.$watch(function getDelegate() {
                        return $ionicScrollDelegate._instances;
                    }, function delegateChanged(instances) {
                        watchScrollDelegate(); // remove watch callback
                        watchScrollDelegate = null;

                        var waitingScrollContentUpdate = function waitingScrollContentUpdate(prIdx, sDele) {
                            $timeout(function contentRefresh() {
                                watchScrollDelegate = $rootScope.$watch(function getUpdatedScrollView() {
                                    return sDele.getScrollView();
                                }, function scrollViewChanged(sView) {
                                    watchScrollDelegate();
                                    watchScrollDelegate = null;

                                    pickerInfo[prIdx].eachItemHeight = sView.__content.firstElementChild.clientHeight;

                                    // padding the first item
                                    sView.__container.style.paddingTop = (pickerInfo[prIdx].eachItemHeight * 2.6) + 'px';

                                    // scroll to default index (no animation)
                                    sDele.scrollTo(0, pickerInfo[prIdx].eachItemHeight * options.items[prIdx].defaultIndex, true);

                                    // update item states
                                    setElementRotate(sView.__content.children,
                                        options.items[prIdx].defaultIndex);
                                });
                            }, 20);
                        };

                        var dele;
                        for (i = 0; i < options.items.length; i++) {
                            dele = null;
                            for (j = instances.length - 1; j >= 1; j--) {
                                if (instances[j].$$delegateHandle === undefined) { continue; }

                                if (instances[j].$$delegateHandle === ('pickerScroll' + i)) {
                                    dele = instances[j];
                                    break;
                                }
                            }

                            if (dele) { waitingScrollContentUpdate(i, dele); }
                        }

                        waitScrollDelegateDefer.resolve();
                    });

                    return waitScrollDelegateDefer.promise;
                })(opts).then(function preparePickerViewFinish() {
                    if (!isShowing) {
                        pickerCtnr.removeClass('hide').addClass('picker-view-slidein');
                    }
                });

                pickerShowDefer.promise.close = close;
                return pickerShowDefer.promise;
            };

            var getIsInit = function getIsInit() { return isInit; };
            var getIsShowing = function getIsShowing() { return isShowing; };

            ionic.Platform.ready(init); // when DOM Ready, init Picker View

            return {
                init: init,
                dispose: dispose,
                show: show,
                close: close,

                isInit: getIsInit,
                isShowing: getIsShowing
            };
        }]);

var weekday = new Array(7);
weekday[0] = "Su,";
weekday[1] = "Mo,";
weekday[2] = "Tu,";
weekday[3] = "We,";
weekday[4] = "Th,";
weekday[5] = "Fr,";
weekday[6] = "Sa,";

var weekdayFull = new Array(7);
weekdayFull[0] = "Sunday";
weekdayFull[1] = "Monday";
weekdayFull[2] = "Tuesday";
weekdayFull[3] = "Wednesday";
weekdayFull[4] = "Thursday";
weekdayFull[5] = "Friday";
weekdayFull[6] = "Saturday";


monthChar = new Array(12);
monthChar[0] = "Jan";
monthChar[1] = "Feb";
monthChar[2] = "Mar";
monthChar[3] = "Apr";
monthChar[4] = "May";
monthChar[5] = "Jun";
monthChar[6] = "Jul";
monthChar[7] = "Aug";
monthChar[8] = "Sep";
monthChar[9] = "Oct";
monthChar[10] = "Nov";
monthChar[11] = "Dec";

var nesheDate = new Date();
var dateArrayThingy = new Array();
dateArrayThingy.push("Today");
dateArrayThingy.push("Tomorrow");
//alert(nesheDate.getDay());
nesheDate.setDate(nesheDate.getDate() + 1);
for (i = 0; i < 5; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    dateArrayThingy.push(weekdayFull[nesheDate.getDay()]);
}
for (i = 0; i < 100; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    //alert(weekday[nesheDate.getDay()]);
    var day = weekday[nesheDate.getDay()];
    var month = monthChar[nesheDate.getMonth()];
    var dayInMonth = nesheDate.getDate();
    dateArrayThingy.push(day + " " + month + " " + dayInMonth);
}

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
    for (var i = 0; i < 7; i++) {
        if (weekdayFull[selectedDate.getDay()] == selectedDay)
            return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
        selectedDate.setDate(selectedDate.getDate() + 1);
    }
}