
angular.module('football.controllers')

    .controller('TeamController', function ($scope, $ionicHistory, $ionicPopup, $ionicLoading, $state, $stateParams, TeamStores, $timeout, SMSService) {

        $scope.showadd = true;
        $scope.notloaded = true;
        $scope.myteams = [];

        //works

        try {
            TeamStores.GetMyTeams(function (leagues) {


                $scope.myteams = leagues;
                console.log($scope.myteams);

                if (leagues.length == 0) {
                }
                else if (leagues.length > 5) {
                    $scope.showadd = false;

                }
                else {
                    $scope.myteams.forEach(function (element) {

                        firebase.database().ref('/teaminfo/' + element.key).once('value').then(function (snapshot) {
                            if (snapshot.exists()) {
                                element.members = snapshot.child("players").numChildren() - 1;

                                element.rank = snapshot.child("rank").val();
                                element.rating = snapshot.child("rating").val()

                                switch (element.rank) {
                                    case 1:
                                        element.rankdescription = element.rank + 'st';
                                        break;
                                    case 2:
                                        element.rankdescription = element.rank + 'nd';
                                        break;
                                    case 3:
                                        element.rankdescription = element.rank + 'rd';
                                        break;

                                    default:
                                        element.rankdescription = element.rank + 'th';
                                        break;
                                }

                            }
                            else {
                                element.members = "Not Found";
                                element.rank = "Not Found";
                                element.rating = "Not Found";
                            }

                        })

                    }, this);
                }

                $scope.notloaded = false;

            })

        }
        catch (error) {
            alert(error.message);
        }

        $scope.gotoadd = function () {
            var userId = firebase.auth().currentUser.uid;
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            firebase.database().ref('/playersinfo/' + userId).once('value').then(function (snapshot) {
                $ionicLoading.hide();
                if (!snapshot.val().isMobileVerified) {
                    SMSService.verifyUserMobile($scope, $scope.gotoadd, [])
                } else {
                    $state.go("app.teamadd", {
                        newuser: {
                            teamname: "",
                            pteamsize: "5",
                            favstadium: "",
                            favstadiumphoto: "",
                            favstadiumphoto: "",
                            favstadiumname: "",
                            homejersey: "Blue",
                            awayjersey: "White",
                            badge: "01",
                            five: false,
                            six: false,
                            seven: false,
                            eight: false,
                            nine: false,
                            ten: false,
                            eleven: false
                        }
                    });
                }
            });
        };

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {

            }
            else {
                $ionicLoading.hide();
            }
        });



    })

    .controller('TeamAddController', function ($scope, SearchStore, $cordovaToast, $ionicHistory, $ionicPopover, ReservationFact, $state, $ionicLoading, $ionicPopup, TeamStores) {
		
		
		
		
		
		
		
		
		
        $scope.teamsizecounter = 0;

        $scope.validate =
            {
                team: false,
                teamsize: false,
                teamsizemax: false,
                favsize: false
            }

        $scope.managecolors =
            {
                five:
                    {
                        color: "#28b041",
                        backcolor: "white"
                    },
                six:
                    {
                        color: "#28b041",
                        backcolor: "white"
                    },
                seven:
                    {
                        color: "#28b041",
                        backcolor: "white"
                    },
                eight:
                    {
                        color: "#28b041",
                        backcolor: "white"
                    },
                nine:
                    {
                        color: "#28b041",
                        backcolor: "white"
                    },
                ten:
                    {
                        color: "#28b041",
                        backcolor: "white"
                    },
                eleven:
                    {
                        color: "#28b041",
                        backcolor: "white"
                    }
            }
			
				console.log($scope.teamsizecounter);
            

        $scope.$on("$ionicView.afterEnter", function (event, data) {
            // handle event
            $scope.disabledbutton = false;
        });

        $scope.adduser = $state.params.newuser;

        $scope.gochoosestadium = function (adduser) {
            $scope.adduser = adduser;
            $state.go("app.choosestadium", {
                myteam: adduser
            })
        }
		
		if (!$scope.adduser.five) 
		{
			$scope.managecolors.five.color = "#28b041";
			$scope.managecolors.five.backcolor = "White";
			$scope.adduser.five = false;
		}
		else 
		{
			$scope.teamsizecounter++;
			$scope.managecolors.five.color = "white";
			$scope.managecolors.five.backcolor = "#28b041";
			$scope.adduser.five = true;
		}
		if (!$scope.adduser.six) 
		{
			$scope.managecolors.six.color = "#28b041";
			$scope.managecolors.six.backcolor = "White";
			$scope.adduser.six = false;
		}
		else 
		{
			$scope.teamsizecounter++;
			$scope.managecolors.six.color = "white";
			$scope.managecolors.six.backcolor = "#28b041";
			$scope.adduser.six = true;
		}
		if (!$scope.adduser.seven) 
		{
			$scope.managecolors.seven.color = "#28b041";
			$scope.managecolors.seven.backcolor = "White";
			$scope.adduser.seven = false;
		}
		else 
		{
			$scope.teamsizecounter++;
			$scope.managecolors.seven.color = "white";
			$scope.managecolors.seven.backcolor = "#28b041";
			$scope.adduser.seven = true;
		}
		if (!$scope.adduser.eight) 
		{
			$scope.managecolors.eight.color = "#28b041";
			$scope.managecolors.eight.backcolor = "White";
			$scope.adduser.eight = false;
		}
		else 
		{
			$scope.teamsizecounter++;
			$scope.managecolors.eight.color = "white";
			$scope.managecolors.eight.backcolor = "#28b041";
			$scope.adduser.eight = true;
		}
		if (!$scope.adduser.nine) 
		{
			$scope.managecolors.nine.color = "#28b041";
			$scope.managecolors.nine.backcolor = "White";
			$scope.adduser.nine = false;
		}
		else 
		{
			$scope.teamsizecounter++;
			$scope.managecolors.nine.color = "white";
			$scope.managecolors.nine.backcolor = "#28b041";
			$scope.adduser.nine = true;
		}
		if (!$scope.adduser.ten) 
		{
			$scope.managecolors.ten.color = "#28b041";
			$scope.managecolors.ten.backcolor = "White";
			$scope.adduser.ten = false;
		}
		else 
		{
			$scope.teamsizecounter++;
			$scope.managecolors.ten.color = "white";
			$scope.managecolors.ten.backcolor = "#28b041";
			$scope.adduser.ten = true;
		}
		if (!$scope.adduser.eleven) 
		{
			$scope.managecolors.eleven.color = "#28b041";
			$scope.managecolors.eleven.backcolor = "White";
			$scope.adduser.eleven = false;
		}
		else 
		{
			$scope.teamsizecounter++;
			$scope.managecolors.eleven.color = "white";
			$scope.managecolors.eleven.backcolor = "#28b041";
			$scope.adduser.eleven = true;
		}


        $scope.next = function (adduser) {
            try {

                //IF THE SAME TEAM NAME EXIST ERROR
                TeamStores.GetTeamByName($scope.adduser.teamname, function (exist) {

                    if (!exist) {
                        $scope.validate.teamsize = false;
                        $scope.validate.team = false;

                        var error = false;

                        $scope.disabledbutton = true;

                        var team = {
                            teamname: $scope.adduser.teamname,
                            teamadmin: "",
                            rating: 0,
                            pteamsize: $scope.adduser.pteamsize,
                            favstadium: $scope.adduser.favstadium,
                            homejersey: "",
                            awayjersey: "",
                            badge: false,
                            five: $scope.adduser.five,
                            six: $scope.adduser.six,
                            seven: $scope.adduser.seven,
                            eight: $scope.adduser.eight,
                            nine: $scope.adduser.nine,
                            ten: $scope.adduser.ten,
                            eleven: $scope.adduser.eleven,
                            photo: "",
                            favlatitude: $scope.adduser.favlatitude,
                            favlongitude: $scope.adduser.favlongitude

                        };

                        if (!(team.five || team.six || team.seven || team.eight || team.nine || team.ten || team.eleven)) {
                            $scope.validate.teamsize = true;
                            $scope.disabledbutton = false;
                            error = true;
                        }
                        if (team.teamname.length < 3 && team.teamname.length < 15) {
                            $scope.validate.team = true;
                            $scope.disabledbutton = false;
                            error = true;
                        }
                        if (team.favstadium == "") {
                            $scope.validate.favsize = true;
                            $scope.disabledbutton = false;
                            error = true;
                        }

                        var counter = 0;
                        counter = $scope.adduser.five ? counter + 1 : counter;
                        counter = $scope.adduser.six ? counter + 1 : counter;
                        counter = $scope.adduser.seven ? counter + 1 : counter;
                        counter = $scope.adduser.eight ? counter + 1 : counter;
                        counter = $scope.adduser.nine ? counter + 1 : counter;
                        counter = $scope.adduser.ten ? counter + 1 : counter;
                        counter = $scope.adduser.eleven ? counter + 1 : counter;

                        if (counter > 2 && !$scope.validate.teamsize) {
                            $scope.validate.teamsizemax = true;
                            error = true;
                        }

                        if (!error) {
                            $scope.validate.teamsize = false;
                            $scope.validate.team = false;
                            $scope.validate.teamsizemax = false;
                            $scope.$apply;
                            console.log(team);

                            $state.go("app.teamadd1", {
                                team1: team,
                                myprofile: $scope.myprofile
                            });
                        }
                        else {
                            $scope.disabledbutton = false;
                            $scope.$apply;
                        }

                    }
                    else {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Team Exists',
                            template: 'Change Team Name'
                        }).then(function () {

                        });
                    }


                });
            }

            catch (error) {
                alert(error.message);
                $scope.disabledbutton = false;
            }
        }


        $scope.updateteamsize = function (x) {


            var opposite = ($scope.adduser.five && x == 1)
                ||
                ($scope.adduser.six && x == 2)
                ||
                ($scope.adduser.seven && x == 3)
                ||
                ($scope.adduser.eight && x == 4)
                ||
                ($scope.adduser.nine && x == 5)
                ||
                ($scope.adduser.ten && x == 6)
                ||
                ($scope.adduser.eleven && x == 7);


            if ((!opposite && $scope.teamsizecounter < 2) || opposite) {

                if (opposite) {
                    $scope.teamsizecounter--;
                }
                else {
                    $scope.teamsizecounter++;
                }
                switch (x) {
                    case 1:
                        if ($scope.adduser.five) {
                            $scope.managecolors.five.color = "#28b041";
                            $scope.managecolors.five.backcolor = "White";
                            $scope.adduser.five = false;
                        }
                        else {
                            $scope.managecolors.five.color = "white";
                            $scope.managecolors.five.backcolor = "#28b041";
                            $scope.adduser.five = true;
                        }

                        break;
                    case 2:
                        if ($scope.adduser.six) {
                            $scope.managecolors.six.color = "#28b041";
                            $scope.managecolors.six.backcolor = "White";
                            $scope.adduser.six = false;
                        }
                        else {
                            $scope.managecolors.six.color = "white";
                            $scope.managecolors.six.backcolor = "#28b041";
                            $scope.adduser.six = true;
                        }
                        break;
                    case 3:
                        if ($scope.adduser.seven) {
                            $scope.managecolors.seven.color = "#28b041";
                            $scope.managecolors.seven.backcolor = "White";
                            $scope.adduser.seven = false;
                        }
                        else {
                            $scope.managecolors.seven.color = "white";
                            $scope.managecolors.seven.backcolor = "#28b041";
                            $scope.adduser.seven = true;
                        }
                        break;
                    case 4:
                        if ($scope.adduser.eight) {
                            $scope.managecolors.eight.color = "#28b041";
                            $scope.managecolors.eight.backcolor = "White";
                            $scope.adduser.eight = false;
                        }
                        else {
                            $scope.managecolors.eight.color = "white";
                            $scope.managecolors.eight.backcolor = "#28b041";
                            $scope.adduser.eight = true;
                        }
                        break;
                    case 5:
                        if ($scope.adduser.nine) {
                            $scope.managecolors.nine.color = "#28b041";
                            $scope.managecolors.nine.backcolor = "White";
                            $scope.adduser.nine = false;
                        }
                        else {
                            $scope.managecolors.nine.color = "white";
                            $scope.managecolors.nine.backcolor = "#28b041";
                            $scope.adduser.nine = true;
                        }
                        break;
                    case 6:
                        if ($scope.adduser.ten) {
                            $scope.managecolors.ten.color = "#28b041";
                            $scope.managecolors.ten.backcolor = "White";
                            $scope.adduser.ten = false;
                        }
                        else {
                            $scope.managecolors.ten.color = "white";
                            $scope.managecolors.ten.backcolor = "#28b041";
                            $scope.adduser.ten = true;
                        }
                        break;
                    case 7:
                        if ($scope.adduser.eleven) {
                            $scope.managecolors.eleven.color = "#28b041";
                            $scope.managecolors.eleven.backcolor = "White";
                            $scope.adduser.eleven = false;
                        }
                        else {
                            $scope.managecolors.eleven.color = "white";
                            $scope.managecolors.eleven.backcolor = "#28b041";
                            $scope.adduser.eleven = true;
                        }
                        break;
                }
				console.log($scope.teamsizecounter);
            }
            else {
                if ($scope.teamsizecounter == 2) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Wrong',
                        template: 'You cannot select more than 2'
                    }).then(function () {

                    });
                }

            }
        }

    })
    .controller('TeamAdd1Controller', function ($scope, $ionicHistory, SearchStore, $cordovaToast, $ionicPopover, ReservationFact, $state, $ionicLoading, $ionicPopup, TeamStores) {

        $scope.validate =
            {
                badge: ""
            }


        $scope.$on("$ionicView.afterEnter", function (event, data) {
            // handle event
            $scope.disabledbutton = false;
        });

        //Ari Default Badge on Load
        $scope.badge = "Logo";

        $scope.RefreshBadge = function (col) {
            $scope.badge = col;
        }

        $scope.next = function () {

            var error = false;
            var team = $state.params.team1;
            $scope.myprofile = $state.params.myprofile;
            team.badge = $scope.badge;
            $scope.validate.badge = false;

            if (team.badge.trim() == "Logo" || team.badge == null || team.badge == '' || team.badge === undefined) {
                $scope.disabledbutton = false;
                $scope.validate.badge = true;
                error = true;
            }
            if (!error) {
                $state.go("app.teamadd2", {
                    team2: team,
                    myprofile: $scope.myprofile
                });

            }



        }

    })
    .controller('TeamAdd2Controller', function ($scope, SearchStore, LeaderBoardStore, $ionicHistory, $cordovaToast, $ionicPopover, ReservationFact, $state, $ionicLoading, $ionicPopup, TeamStores) {

        $scope.adduser =
            {
                homejersey: "Blue",
                awayjersey: "White",
            }
        $scope.validate =
            {
                samecolor: false
            }

        $scope.$on("$ionicView.afterEnter", function (event, data) {
            // handle event
            $scope.disabledbutton = false;
        });

        $scope.oldteam = $state.params.team2;


        $scope.add = function () {

            var error = false;
            $scope.disabledbutton = true;
            try {



                var team = $state.params.team2;
                $scope.myprofile = $state.params.myprofile;
                team.awayjersey = $scope.adduser.awayjersey;
                team.homejersey = $scope.adduser.homejersey;

                if (team.homejersey == team.awayjersey) {

                    $scope.disabledbutton = false;
                    $scope.validate.samecolor = true;
                    error = true;
                }
                if (!error) {

                    $scope.validate.samecolor = false;

                    SearchStore.GetMyProfileInfo(function (profile) {

                        $ionicLoading.show({
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            maxWidth: 200,
                            showDelay: 0
                        });

                        TeamStores.AddNewTeam(team, profile)
                            .then(function (value) {
                                LeaderBoardStore.GetAllLeaderboard(function (leagues) {

                                    $scope.notloaded = false;
                                    $scope.rankedteams = leagues.reverse();

                                    LeaderBoardStore.UpdateRatings($scope.rankedteams).then(function (result) {
                                        $ionicLoading.hide();
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Success',
                                            template: 'Team Added'
                                        }).then(function () {
                                            $scope.adduser =
                                                {
                                                    homejersey: "Blue",
                                                    awayjersey: "White"
                                                }
                                            $ionicHistory.nextViewOptions({
                                                disableBack: true
                                            });
                                            $state.go("app.teammanagement");

                                        }, function (error) {
                                            alert(error.message);
                                        })



                                    })

                                });

                            }, function (error) {
                                if (error.code == 'PERMISSION_DENIED') {
                                    alert("Team Name Already Taken")
                                }
                            })
                    })


                }



            }
            catch (error) {
                alert(error.message);
                $scope.disabledbutton = false;
            }



        };

        $scope.updatehomejersey = function (col) {


            switch (col) {
                case 1:
                    $scope.adduser.homejersey = "Red";
                    break;
                case 2:
                    $scope.adduser.homejersey = "Blue";
                    break;
                case 3:
                    $scope.adduser.homejersey = "Green";
                    break;
                case 4:
                    $scope.adduser.homejersey = "Black";
                    break;
                case 5:
                    $scope.adduser.homejersey = "Yellow";
                    break;
                case 6:
                    $scope.adduser.homejersey = "White";
                    break;
                case 7:
                    $scope.adduser.homejersey = "Red";
                    break;
            }

        }

        $scope.RefreshBadge = function (col) {
            $scope.adduser.badge = col;

        }



        $scope.updateawayjersey = function (col) {


            switch (col) {
                case 1:
                    $scope.adduser.awayjersey = "Red";
                    break;
                case 2:
                    $scope.adduser.awayjersey = "Blue";
                    break;
                case 3:
                    $scope.adduser.awayjersey = "Green";
                    break;
                case 4:
                    $scope.adduser.awayjersey = "Black";
                    break;
                case 5:
                    $scope.adduser.awayjersey = "Yellow";
                    break;
                case 6:
                    $scope.adduser.awayjersey = "White";
                    break;
                case 7:
                    $scope.adduser.awayjersey = "Red";
                    break;
            }

        }







    })

    .controller('TeamProfileController', function ($scope, ReservationFact, LoginStore , $ionicHistory, $ionicLoading, $timeout, $ionicPopup, $stateParams, $state, TeamStores) {

        $scope.doibelong = false;

        $scope.currentprofile = {};

        $scope.notloaded = false;

        $scope.tabs =
            {
                Available: true,
                Members: false,
                Statistics: false
            }
        $scope.colors =
            {
                Available: true,
                Members: false,
                Statistics: false
            }
        $scope.status =
            {
                Available: "solid",
                Members: "none",
                Statistics: "none"
            }


        $scope.stadiumdisplayed = {
            key: "",
            name: "",
            picture: ""
        }




        $scope.switchscreens = function (x) {
            switch (x) {
                case 1:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Available = true;

                    $scope.status.Available = "none";
                    $scope.status.Members = "none";
                    $scope.status.Statistics = "none";

                    $scope.status.Available = "solid";

                    break;

                case 2:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Statistics = true;

                    $scope.status.Available = "none";
                    $scope.status.Members = "none";
                    $scope.status.Statistics = "none";

                    $scope.status.Statistics = "solid";

                    break;

                case 3:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Members = true;

                    $scope.status.Available = "none";
                    $scope.status.Members = "none";
                    $scope.status.Statistics = "none";
                    $scope.status.Members = "solid";
                    break;
            }

        }

        $scope.stats =
            {
                win: 0,
                winstreak: 0
            }

        //here
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        //works

        try {
            TeamStores.GetTeamByKey($stateParams.teamid, function (myprofile) {


                $ionicLoading.hide();
                $scope.notloaded = true;
                if (myprofile !== null && myprofile !== undefined) {

                    $scope.currentprofile = myprofile;

                    $scope.currentprofile.upcomingmatches.forEach(function (element) {

                        if (element.status != undefined && element.status != null)
                            switch (element.status) {
                                case 1:
                                    $scope.stats.win++;
                                    break;

                                default:
                                    break;
                            }

                    }, this);

                    $scope.currentprofile.players.forEach(function (element) {
                        console.log(element);
                        firebase.database().ref('/playersinfo/' + element.key).on('value', function (snapshot) {
                            if (snapshot.exists()) {
                                console.log(snapshot.val());

                                element.photo = snapshot.child("photoURL").val() == "" ? 'img/PlayerProfile.png' : snapshot.child("photoURL").val();
                            }
                        })



                    }, this);


                    var teamsizestring = "";

                    teamsizestring = $scope.currentprofile.teamoffive ? teamsizestring + "5v5 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamofsix ? teamsizestring + "6v6 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamofseven ? teamsizestring + "7v7 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamofeight ? teamsizestring + "8v8 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamofnine ? teamsizestring + "9v9 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamoften ? teamsizestring + "10v10 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamofeleven ? teamsizestring + "11v11 ." : teamsizestring;

                    if (teamsizestring.length > 2) {
                        teamsizestring = teamsizestring.substr(0, teamsizestring.length - 1);
                    }

                    $scope.currentprofile.teamsizestring = teamsizestring;

                    var user = firebase.auth().currentUser;
                    if (!(user === null || user == '' || user === undefined)) {
                        var id = user.uid;
                        if (!(id === null || id == '' || id === undefined)) {

                            for (var j = 0; j < $scope.currentprofile.players.length; j++) {
                                if ($scope.currentprofile.players[i] && $scope.currentprofile.players[i].hasOwnProperty('key') && $scope.currentprofile.players[i].key === id) {
                                    $scope.doibelong = true;
                                }

                            }
                        }
                    }

                    //////
                    if (myprofile.favstadium !== "") {
                        ReservationFact.GetStadiumsByID(myprofile.favstadium, function (favstadium) {
                            console.log(favstadium);
                            if (favstadium !== null || favstadium !== undefined) {


                                $scope.stadiumdisplayed.name = favstadium.stadiumname;
                                $scope.stadiumdisplayed.picture = favstadium.photo;
                                $scope.stadiumdisplayed.key = favstadium.key;

                                $scope.currentprofile.favstadiumname = favstadium.stadiumname;

                            }
                            else {
                                $scope.stadiumdisplayed.name = "";
                                $scope.stadiumdisplayed.picture = "defaultteam";
                                $scope.stadiumdisplayed.key = "";
                            }

                            //$scope.currentprofile["teamdisplayed"] = $scope.stadiumdisplayed.name == "" ? "Select a Team" : $scope.teamdisplayed.name;



                        })
                    }
                    else {
                        $scope.teamdisplayed.name = "";
                        $scope.teamdisplayed.picture = "defaultteam";
                        $scope.teamdisplayed.rank = "";
                        $scope.teamdisplayed.key = "";
                    }

                }

                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Team no longer exists'
                    }).then(function () {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go("app.teammanagement");
                    });
                }
                //////



            })

        }
        catch (error) {
            alert(error.message);
        }


        //$scope.value = 150;



        $scope.goupdate = function () {
            $state.go('app.teamprofileedit',

                {
                    myteam: $scope.currentprofile
                });
        }



        $scope.doRefresh = function () {

            try {

                TeamStores.GetTeamByKey($stateParams.teamid, function (myprofile) {
                    $scope.currentprofile = myprofile;

                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');


                })
            } catch (error) {
                alert(error.message);
            }
        }

        $scope.GoMatchHistory = function () {

            $state.go('app.teamhistory',

                {
                    teammatches: $scope.currentprofile.upcomingmatches
                });
        }

        $scope.playeroperations = function (opercode, player) {
            var message = "";
            var noerror = true;

            firebase.database().ref('/playersinfo/' + player.key).once('value').then(function (snapshot) {

                if (snapshot.exists()) {
                    switch (opercode) {
                        case 1:
                            message = "Are you sure you want to promote the player?"
                            break;
                        case 2:
                            message = "Are you sure you want to demote the player?"
                            break;
                        case 3:
                            message = "Are you sure you want to remove the player from the team?"
                            break;
                        default:
                            break;
                    }

                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Confirm',
                        template: message
                    });

                    confirmPopup.then(function (res) {
                        if (res) {

                            if (!snapshot.child("isMobileVerified").val() && opercode == 1) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Forbidden',
                                    template: 'User is not verified'
                                });
                            }
                            else {
                                TeamStores.PromoteDeletePlayers($scope.currentprofile, player, opercode).then(function () {
                                    switch (opercode) {
                                        case 1:
                                            player.isadmin = true;
                                            break;
                                        case 2:
                                            player.isadmin = false;
                                            break;
                                        case 3:
                                            $scope.currentprofile.players = $scope.currentprofile.players.filter(function (el) {
                                                return el.key !== player.key;

                                            });
                                            break;
                                        default:
                                            break;
                                    }
                                    $scope.$digest();

                                }, function (error) {
                                    alert(error.message);
                                });
                            }

                        }
                    })
                }
            })



        }

        $scope.Invite = function () {


            try {
                if ($scope.currentprofile.players.length < 14) 
				{
					var Tokens = [];

                    /// PLAYERs TOKENS
					
					for(p in $scope.currentprofile.players)
					{
						if (p.hasOwnProperty("devicetoken")) 
						{
							for (var k in p.devicetoken) {
								if (p.hasOwnProperty(k)) 
								{
									Tokens.push(k);
								}
							}
						}
					}
					
                    $state.go('app.inviteteamplayers',
                        {
                            myteam: $scope.currentprofile
                        }).then(function()
						{
							LoginStore.SendNotification("You have been invited to a team ", Tokens, undefined);
						});
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Forbidden',
                        template: 'You cannot have more than 15 players. Remove some players to add new ones.'
                    });
                }
            }
            catch (error) {
                alert(error.message);
            }
        }

        $scope.Challengeteam = function () {
            try {
                $state.go('app.challengeteam',

                    {
                        myteam: $scope.currentprofile
                    });
            }
            catch (error) {
                alert(error.message);
            }
        }

        $scope.LeaveTeam = function () {
            try {
                var existsadmin = false;
                var amiadmin = false;

                var template = 'Are you sure you want to leave the team?';

                var counter = 0;

                var user = firebase.auth().currentUser;
                var id = user.uid;

                TeamStores.GetTeamByKey($stateParams.teamid, function (result) {

                    for (var i = 0; i < result.players.length; i++) {
                        if (result.players[i].itsme && result.players[i].isadmin) {
                            amiadmin = true;
                        };
                        if (result.players[i].isadmin) {
                            amiadmin = true;
                            counter++;
                        };
                    }

                    if (counter > 0) {
                        if (amiadmin && counter == 1) {

                            template = 'Are you sure you want to leave the team? Note: Team will be deleted afterwards';

                            var confirmPopup = $ionicPopup.confirm({
                                title: 'Leave Team',
                                template: template
                            });

                            confirmPopup.then(function (res) {
                                if (res) {
                                    TeamStores.LeaveTeam(result)
                                        .then(function (value) {

                                            TeamStores.DeleteTeamByKey(result)
                                                .then(function (value) {

                                                    var alertPopup = $ionicPopup.alert({
                                                        title: 'Success',
                                                        template: 'You Left the Team'
                                                    }).then(function () {
                                                        $ionicHistory.nextViewOptions({
                                                            disableBack: true
                                                        });
                                                        $state.go("app.teammanagement");
                                                    });

                                                }, function (error) {
                                                    alert(error.message);
                                                })

                                        }, function (error) {
                                            alert(error.message);
                                        })
                                }


                            })
                        }
                        else if (amiadmin && counter > 1) {
                            template = 'Are you sure you want to leave the team?';

                            var confirmPopup = $ionicPopup.confirm({
                                title: 'Leave Team',
                                template: template
                            });

                            confirmPopup.then(function (res) {
                                var updates = {};
                                for (var i = 0; i < result.players.length; i++) {
                                    if (result.players[i].isadmin && result.players[i].key != id) {

                                        updates['team/' + result.key + '/teamadmin'] = result.players[i].key;
                                        updates['teamsinfo/' + result.key + '/teamadmin'] = result.players[i].key;
                                    }

                                };

                                firebase.database().ref().update(updates).then(function () {
                                    TeamStores.LeaveTeam(result)
                                        .then(function (value) {
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Success',
                                                template: 'You Left the Team'
                                            }).then(function () {
                                                $ionicHistory.nextViewOptions({
                                                    disableBack: true
                                                });
                                                $state.go("app.teammanagement");
                                            });

                                        }, function (error) {
                                            alert(error.message);
                                        })
                                });
                            })
                        }
                        else {

                            template = 'Are you sure you want to leave the team?';

                            var confirmPopup = $ionicPopup.confirm({
                                title: 'Leave Team',
                                template: template
                            });

                            confirmPopup.then(function (res) {
                                if (res) {
                                    TeamStores.LeaveTeam(result)
                                        .then(function (value) {
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Success',
                                                template: 'You Left the Team'
                                            }).then(function () {
                                                $ionicHistory.nextViewOptions({
                                                    disableBack: true
                                                });
                                                $state.go("app.teammanagement");
                                            });

                                        }, function (error) {
                                            alert(error.message);
                                        })
                                }


                            })
                        }
                    }


                }, function (error) {
                    alert(error.message);
                })



            }
            catch (error) {
                alert(error.message);
            }
        }
        $scope.gogamedetails = function (gameid) {
            $state.go('app.gamedetails',
                {
                    gameid: gameid
                })
        }

    })

    .controller('TeamHistoryController', function ($scope, $ionicHistory, $ionicLoading, $ionicPopup, $stateParams, $state) 
	{
        $scope.teammatches = $state.params.teammatches;
        console.log($scope.teammatches);
    })

    .controller('TeamEditController', function ($scope, $ionicHistory, $ionicPopover, $ionicLoading, $timeout, $ionicPopup, $stateParams, $state, TeamStores) {



        $scope.currentprofile = $state.params.myteam;
		$scope.currentprofile = $stateParams.myteam;

        // .fromTemplate() method
        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('my-popover.html', {
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



        $scope.$on("$ionicView.afterEnter", function (event, data) {
            // handle event
            $scope.disabledbutton = false;
        });


        $scope.slider1 = {
            minValue: 7,
            maxValue: 23,

            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        $scope.slider2 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };


        $scope.slider3 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };


        $scope.slider4 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };


        $scope.slider5 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        $scope.slider6 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        $scope.slider7 = {
            minValue: 7,
            maxValue: 23,

            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        try {


            $scope.slider1.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider1.options.disabled = $scope.currentprofile.admiadmin;

            $scope.slider2.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider2.options.disabled = $scope.currentprofile.admiadmin;

            $scope.slider3.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider3.options.disabled = $scope.currentprofile.admiadmin;

            $scope.slider4.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider4.options.disabled = $scope.currentprofile.admiadmin;

            $scope.slider5.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider5.options.disabled = $scope.currentprofile.admiadmin;

            $scope.slider6.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider6.options.disabled = $scope.currentprofile.admiadmin;


            $scope.slider7.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider7.options.disabled = $scope.currentprofile.admiadmin;

        }
        catch (error) {
            alert(error.message);
        }

        $scope.UpdateTeam = function (profile) {


            TeamStores.UpdateTeamByKey(profile).then(function (result) {

                $ionicHistory.goBack();

            }, function (error) {
                alert(error.message);
            });

        }



        $scope.deleteteam = function (team) {
            try {

                var stringpopup = 'Are you sure you want to delete this team?'


                var confirmPopup = $ionicPopup.confirm({
                    title: 'DeleteTeam',
                    template: stringpopup
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        TeamStores.DeleteTeamByKey(team)
                            .then(function (value) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Successfully Deleted Team'
                                }).then(function () {
                                    $ionicHistory.nextViewOptions({
                                        disableBack: true
                                    });
                                    $state.go("app.homepage");
                                });


                            }, function (error) {
                                alert(error.message);
                            })
                    }


                })

            }
            catch (error) {
                alert(error.message);
            }

        }
        $scope.RefreshBadge = function (col) {
            $scope.currentprofile.badge = col;

        }
        $scope.gochoosestadium = function (team) {
            $state.go("app.choosestadium", {
                myteam: team
            })
        }



    })

    .controller('InvitePlayersController', function ($scope, $http, LoginStore, ProfileStore1, $ionicPopup, $ionicHistory, HomeStore, $ionicLoading, $state, $stateParams, SearchStore, TeamStores, $timeout, $ionicFilterBar) {

        $scope.notloaded = true;

        $scope.myteam = $state.params.myteam;


        ProfileStore1.SearchPlayers($scope.myteam, function (leagues) {

            $scope.allplayers = leagues;


            $scope.filteredPlayers = $scope.allplayers.filter(p=>p.key.charAt(0)!='-');


            var date = new Date();
            HomeStore.GetProfileInfo(date, function (players) {
                $scope.profile = players;
                $scope.notloaded = false;
                $scope.$apply();

            }, function (error) {
                $scope.notloaded = false;
                $scope.$apply();
            })

        }, function (error) {
            $scope.notloaded = false;
            $scope.$apply();
        }
        )

        $scope.InvitePlayerToTeam = function (player) {

            if (player.color != "white") {
                TeamStores.InvitePlayerToTeam($scope.myteam, player, $scope.profile).then(function () {
                    player.status = "Invitation Sent";
                    if (player.devicetoken != undefined && player.devicetoken != "") {
                        if (player.settings.notification) {

                            var Tokens = [];
                            if (player.hasOwnProperty("devicetoken")) {
                                for (var k in player.devicetoken) {
                                    if (player.devicetoken.hasOwnProperty(k)) {
                                        Tokens.push(k);
                                    }
                                }
                                LoginStore.SendNotification("Would you like to join " + $scope.myteam.teamname + '?', Tokens).then(function (res) {

                                })
                            }
                        }

                    }
                    player.color = "white";
                    player.backcolor = "#28b041";
                    $scope.$apply();

                }, function (error) {
                    alert(error.message)
                })
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


        $scope.filteredPlayers = $scope.allplayers;
        //$scope.$digest();
        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.allplayers,
                update: function (filteredItems, filterText) {
                    if (filterText != "" && filterText != null) {
                        console.log("filterText is: " + filterText)
                        $scope.filteredPlayers = filteredItems;
                    }
                    else {
                        console.log("filterText empty is: " + filterText)
                        $scope.filteredPlayers = $scope.allplayers;
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

    .controller('ChooseStadiumController', function ($scope, $ionicHistory, $ionicPopover, $ionicLoading, $timeout, $stateParams, $state, TeamStores, ReservationFact, $ionicFilterBar) {

        $scope.notloaded = true;
        ReservationFact.GetAllStadiums(function (result) {
            $scope.stadiums = result;
            $scope.notloaded = false;
            $scope.filteredStadiums = $scope.stadiums
        }, function (error) {

        })


        $scope.goback = function (stadium) {

			console.log($stateParams);
			$stateParams.myteam.favstadium = stadium.key;
            $stateParams.myteam.favstadiumphoto = stadium.photo;
            $stateParams.myteam.favstadiumname = stadium.name;
                  
            $stateParams.myteam.favlatitude = stadium.latitude;
            $stateParams.myteam.favlongitude = stadium.longitude;
			
            $state.params.myteam.favstadium = stadium.key;
            $state.params.myteam.favstadiumphoto = stadium.photo;
            $state.params.myteam.favstadiumname = stadium.name;

            $state.params.myteam.favlatitude = stadium.latitude;
            $state.params.myteam.favlongitude = stadium.longitude;

            $ionicHistory.goBack();
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


        $scope.filteredStadiums = $scope.stadiums;
        //$scope.$digest();
        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.stadiums,
                update: function (filteredItems, filterText) {
                    if (filterText != "" && filterText != null) {
                        console.log("filterText is: " + filterText)
                        $scope.filteredStadiums = filteredItems;
                    }
                    else {
                        console.log("filterText empty is: " + filterText)
                        $scope.filteredStadiums = $scope.stadiums;
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

    .controller('TeamViewController', function ($scope, ReservationFact, $ionicHistory, $ionicLoading, $timeout, $ionicPopup, $stateParams, $state, TeamStores) {



        $scope.currentprofile = {};

        $scope.notloaded = false;

        // set the rate and max variables
        $scope.rating = {};
        $scope.rating.rate = 3;
        $scope.rating.max = 5;

        $scope.tabs =
            {
                Available: true,
                Members: false,
                Statistics: false
            }
        $scope.colors =
            {
                Available: true,
                Members: false,
                Statistics: false
            }
        $scope.status =
            {
                Available: "solid",
                Members: "none",
                Statistics: "none"
            }


        $scope.stadiumdisplayed = {
            key: "",
            name: "",
            picture: ""
        }




        $scope.switchscreens = function (x) {
            switch (x) {
                case 1:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Available = true;

                    $scope.status.Available = "none";
                    $scope.status.Members = "none";
                    $scope.status.Statistics = "none";

                    $scope.status.Available = "solid";

                    break;

                case 2:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Statistics = true;

                    $scope.status.Available = "none";
                    $scope.status.Members = "none";
                    $scope.status.Statistics = "none";

                    $scope.status.Statistics = "solid";

                    break;

                case 3:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Members = true;

                    $scope.status.Available = "none";
                    $scope.status.Members = "none";
                    $scope.status.Statistics = "none";
                    $scope.status.Members = "solid";
                    break;
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
        //works

        try {
            TeamStores.GetTeamByKey($stateParams.teamid, function (myprofile) {
                console.log(myprofile);
                $ionicLoading.hide();
                $scope.notloaded = true;
                if (myprofile !== null && myprofile !== undefined) {

                    $scope.currentprofile = myprofile;

                    $scope.currentprofile.players.forEach(function (element) {
                        firebase.database().ref('/playersinfo/' + element.key).on('value', function (snapshot) {
                            if (snapshot.exists()) {
                                element.photo = snapshot.child("photoURL").val() == "" ? 'img/PlayerProfile.png' : snapshot.child("photoURL").val();
                            }
                        })
                    }, this);

                    var teamsizestring = "";

                    teamsizestring = $scope.currentprofile.teamoffive ? teamsizestring + "5v5 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamofsix ? teamsizestring + "6v6 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamofseven ? teamsizestring + "7v7 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamofeight ? teamsizestring + "8v8 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamofnine ? teamsizestring + "9v9 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamoften ? teamsizestring + "10v10 ." : teamsizestring;
                    teamsizestring = $scope.currentprofile.teamofeleven ? teamsizestring + "11v11 ." : teamsizestring;

                    if (teamsizestring.length > 2) {
                        teamsizestring = teamsizestring.substr(0, teamsizestring.length - 1);
                    }

                    $scope.currentprofile.teamsizestring = teamsizestring;

                    var user = firebase.auth().currentUser;
                    if (!(user === null || user == '' || user === undefined)) {
                        var id = user.uid;
                        if (!(id === null || id == '' || id === undefined)) {

                            for (var j = 0; j < $scope.currentprofile.players.length; j++) {
                                if ($scope.currentprofile.players[i] && $scope.currentprofile.players[i].hasOwnProperty('key') && $scope.currentprofile.players[i].key === id) {
                                    $scope.doibelong = true;
                                }

                            }
                        }
                    }

                    if (myprofile.favstadium !== "") {
                        ReservationFact.GetStadiumsByID(myprofile.favstadium, function (favstadium) {
                            console.log(favstadium);
                            if (favstadium !== null || favstadium !== undefined) {

                                $scope.stadiumdisplayed.name = favstadium.stadiumname;
                                $scope.stadiumdisplayed.picture = favstadium.photo;
                                $scope.stadiumdisplayed.key = favstadium.key;

                                $scope.currentprofile.favstadiumname = favstadium.stadiumname;

                            }
                            else {
                                $scope.stadiumdisplayed.name = "";
                                $scope.stadiumdisplayed.picture = "defaultteam";
                                $scope.stadiumdisplayed.key = "";
                            }

                        })
                    }
                    else {
                        $scope.teamdisplayed.name = "";
                        $scope.teamdisplayed.picture = "defaultteam";
                        $scope.teamdisplayed.rank = "";
                        $scope.teamdisplayed.key = "";
                    }

                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Team no longer exists'
                    }).then(function () {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go("app.homepage");
                    });
                }
            })

        }
        catch (error) {
            alert(error.message);
        }

        $scope.goupdate = function () {
            $state.go('app.teamprofileedit',

                {
                    myteam: $scope.currentprofile
                });
        }

        $scope.doRefresh = function () {

            try {

                TeamStores.GetTeamByKey($stateParams.teamid, function (myprofile) {
                    $scope.currentprofile = myprofile;
                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');


                })
            } catch (error) {
                alert(error.message);
            }
        }

        $scope.Invite = function () {


            try {
                if ($scope.currentprofile.players.length < 14) {

                    $state.go('app.inviteteamplayers',

                        {
                            myteam: $scope.currentprofile
                        });
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Forbidden',
                        template: 'You cannot have more than 15 players. Remove some players to add new ones.'
                    });
                }
            }
            catch (error) {
                alert(error.message);
            }
        }

        $scope.Challengeteam = function () {
            try {
                $state.go('app.chooseyourteam',

                    {
                        otherteam: $scope.currentprofile
                    });
            }
            catch (error) {
                alert(error.message);
            }
        }

        $scope.LeaveTeam = function () {
            try {
                var existsadmin = false;
                var amiadmin = false;

                var template = 'Are you sure you want to leave the team?';

                var counter = 0;

                var user = firebase.auth().currentUser;
                var id = user.uid;

                TeamStores.GetTeamByKey($stateParams.teamid, function (result) {

                    for (var i = 0; i < result.players.length; i++) {
                        if (result.players[i].itsme && result.players[i].isadmin) {
                            amiadmin = true;
                        };
                        if (result.players[i].isadmin) {
                            amiadmin = true;
                            counter++;
                        };
                    }

                    if (counter > 0) {
                        if (amiadmin && counter == 1) {

                            template = 'Are you sure you want to leave the team? Note: Team will be deleted afterwards';

                            var confirmPopup = $ionicPopup.confirm({
                                title: 'Leave Team',
                                template: template
                            });

                            confirmPopup.then(function (res) {
                                if (res) {
                                    TeamStores.LeaveTeam(result)
                                        .then(function (value) {

                                            TeamStores.DeleteTeamByKey(result)
                                                .then(function (value) {

                                                    var alertPopup = $ionicPopup.alert({
                                                        title: 'Success',
                                                        template: 'You Left the Team'
                                                    }).then(function () {
                                                        $ionicHistory.nextViewOptions({
                                                            disableBack: true
                                                        });
                                                        $state.go("app.teammanagement");
                                                    });

                                                }, function (error) {
                                                    alert(error.message);
                                                })

                                        }, function (error) {
                                            alert(error.message);
                                        })
                                }


                            })
                        }
                        else {

                            template = 'Are you sure you want to leave the team?';

                            var confirmPopup = $ionicPopup.confirm({
                                title: 'Leave Team',
                                template: template
                            });

                            confirmPopup.then(function (res) {
                                if (res) {
                                    TeamStores.LeaveTeam(result)
                                        .then(function (value) {
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Success',
                                                template: 'You Left the Team'
                                            }).then(function () {
                                                $ionicHistory.nextViewOptions({
                                                    disableBack: true
                                                });
                                                $state.go("app.teammanagement");
                                            });

                                        }, function (error) {
                                            alert(error.message);
                                        })
                                }


                            })
                        }
                    }


                }, function (error) {
                    alert(error.message);
                })



            }
            catch (error) {
                alert(error.message);
            }
        }
        $scope.gogamedetails = function (gameid) {
            $state.go('app.gamedetails',
                {
                    gameid: gameid
                })
        }

    })




