angular.module('football.controllers', [])

    .factory('SMSService', function ($ionicPopup, $http, $q, $ionicLoading, LoginStore) {
        var accountSid = "AC4c662d337b7c4d408c5ec62bf16f2206";
        var authToken = "17dac42e587aea7dc1a4371fb303a417";

        var twilioURL = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";


        function generateCode(length, codeType) {
            if (typeof length === "undefined") {
                length = 5;
            }
            if (typeof codeType === "undefined") {
                codeType = 0;
            }
            var text = "";
            var possible = "0123456789";
            if (codeType === 1) {
                possible += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
            }

            for (var i = 0; i < length; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        var sendSMS = function (to, message) {
            return $http({
                method: 'POST',
                url: twilioURL,
                data: {
                    To: to,
                    From: "ARINA",
                    Body: message
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                headers: {
                    'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            // var deferred = $q.defer();
        };



        var verifyUserMobile = function ($scope, callback, argumentsArray) {

            $scope.smsVerification = {
                mobileNumber: "",
                codeNumber: ""
            };
            var confirmPopup = $ionicPopup.confirm({
                cssClass: 'custom-class',
                title: 'Mobile verification',
                template: 'You need to verify your mobile number to proceed. <br/> <div class="row"><div class="col col-20" style="padding-top: 13px;margin-top:10px">+961</div><div class="col"><input type="tel" placeholder="Enter Your Phone Number" ng-model="smsVerification.mobileNumber" style="background-color:white;color:#2ab041;padding: 0 5px;margin-top:10px"></div></div>',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Confirm</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.smsVerification.mobileNumber) {
                                e.preventDefault();
                            } else {
                                return "+961" + $scope.smsVerification.mobileNumber;
                            }
                        }
                    }
                ]
            });

            if (!$scope.nointernet) {
                confirmPopup.then(function (res) {
                    if (res) {
                        console.log($scope.smsVerification.mobileNumber);
                        firebase.database().ref('/playersinfo').orderByChild("telephone").equalTo($scope.smsVerification.mobileNumber).once('value').then(function (snapshot) {
                            console.log(snapshot.val());

                            if (!snapshot.val()) {

                                var code = generateCode(6);
                                console.log(code);
                                $ionicLoading.show({
                                    content: 'Loading',
                                    animation: 'fade-in',
                                    showBackdrop: true,
                                    maxWidth: 200,
                                    showDelay: 0
                                });


                                sendSMS(res, "Please enter the code: " + code + " to confirm your mobile number")
                                    .then(function (res) {
                                        $ionicLoading.hide();
                                        console.log(res);
                                        var tries = 0;
                                        var verifyPopup = $ionicPopup.confirm({
                                            cssClass: 'custom-class',
                                            title: 'Mobile verification',
                                            template: 'Enter the verification code we sent via `SMS` below to verify your mobile number <br/> <div class="row"><div class="col"><input type="text" placeholder="Enter the verification code" ng-model="smsVerification.codeNumber" style="background-color:white;color:#2ab041;padding: 0 5px;margin-top:10px"></div></div>',
                                            scope: $scope,
                                            buttons: [
                                                { text: 'Cancel' },
                                                {
                                                    text: '<b>Verify</b>',
                                                    type: 'button-positive',
                                                    onTap: function (e) {
                                                        if (!$scope.smsVerification.codeNumber) {
                                                            e.preventDefault();
                                                        } else if (code !== $scope.smsVerification.codeNumber && tries < 3) {
                                                            $ionicPopup.alert({
                                                                cssClass: 'custom-class',
                                                                template: "Invalid Code"
                                                            });
                                                            tries++;
                                                            e.preventDefault();
                                                        } else if (tries >= 3) {
                                                            $ionicPopup.alert({
                                                                cssClass: 'custom-class',
                                                                template: "Too many bad attempts. Try again"
                                                            });
                                                            return false;
                                                        } else {
                                                            return $scope.smsVerification.codeNumber;
                                                        }
                                                    }
                                                }
                                            ]
                                        })

                                        verifyPopup.then(function (res) {
                                            if (res) {
                                                var user = firebase.auth().currentUser;
                                                var id = user.uid;
                                                var updates = {};
                                                console.log($scope.smsVerification.mobileNumber);
                                                updates['players/' + id + '/isMobileVerified'] = true;
                                                updates['playersinfo/' + id + '/isMobileVerified'] = true;

                                                updates['players/' + id + '/telephone'] = $scope.smsVerification.mobileNumber;
                                                updates['playersinfo/' + id + '/telephone'] = $scope.smsVerification.mobileNumber;


                                                var alertPopup = $ionicPopup.alert({
                                                    title: 'Error',
                                                    template: 'Your Phone Number is Now Verified'
                                                });

                                                firebase.database().ref().update(updates).then(function () {
                                                    callback.apply($scope, argumentsArray)
                                                });
                                            }
                                        });

                                    }, function (err) {
                                        $ionicLoading.hide();
                                        console.log(err);

                                        if (err && err.data && err.data.message) {
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Error',
                                                template: err.data.message
                                            });
                                        }
                                    })
                            }
                            else {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Phone Exists',
                                    template: 'This number already exists - Please call us at (+961) 71-258379'
                                }).then(function () {

                                });
                            }
                        })


                    }
                });
            }
        };

        return {
            verifyUserMobile: verifyUserMobile
        }
    })
    .factory('FirebaseStorageService', function ($q) {
        return {
            saveUserProfilePicture: function (data, userId) {
                var deferred = $q.defer();

                data = data.substr("data:image/png;base64,".length);

                var storage = firebase.app().storage().ref();
                var name = userId + "/" + (new Date()).getTime() + ".png";
                var f = storage.child("playerimages/" + name);
                var task = f.putString(data, 'base64');

                task.on('state_changed', function (snapshot) {

                }, function (error) {
                    console.error("Unable to save image.");
                    console.error(error);
                    deferred.reject(error);
                }, function () {
                    var url = task.snapshot.downloadURL;
                    console.log("Saved to " + url);

                    var db = firebase.database();
                    var players = db.ref().child("players");
                    players.child(userId).child("photoURL").set(url);
                    deferred.resolve(url);
                });

                return deferred.promise;
            }
        }
    })
    .factory('ProfileStore1', function () {
        var TempItems = {};
        return {

            UpdateProfile: function (profile, withdetails) {
                try {
                    console.log("HERE");
                    console.log(profile);

                    var ageset = profile.age.getFullYear() == 1900 ? false : true;

                    var year = profile.age.getFullYear();
                    var month = profile.age.getMonth();
                    var day = profile.age.getDate();



                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    var updates = {};
                    updates['players/' + id + '/startmonday'] = profile.startmonday;
                    updates['players/' + id + '/startmondayend'] = profile.startmondayend;
                    updates['players/' + id + '/starttuesday'] = profile.starttuesday;
                    updates['players/' + id + '/starttuesdayend'] = profile.starttuesdayend;
                    updates['players/' + id + '/startwednesday'] = profile.startwednesday;
                    updates['players/' + id + '/startwednesdayend'] = profile.startwednesdayend;
                    updates['players/' + id + '/startthursday'] = profile.startthursday;
                    updates['players/' + id + '/startthursdayend'] = profile.startthursdayend;
                    updates['players/' + id + '/startfriday'] = profile.startfriday;
                    updates['players/' + id + '/startfridayend'] = profile.startfridayend;
                    updates['players/' + id + '/startsaturday'] = profile.startsaturday;
                    updates['players/' + id + '/startsaturdayend'] = profile.startsaturdayend;
                    updates['players/' + id + '/startsunday'] = profile.startsunday;
                    updates['players/' + id + '/startsundayend'] = profile.startsundayend;
                    updates['players/' + id + '/available'] = profile.available;
                    updates['players/' + id + '/skilllevel'] = profile.skilllevel;
                    updates['players/' + id + '/favstadiumname'] = profile.favstadiumname;
                    //updates['players/' + id + '/favstadiumphoto'] = profile.favstadiumphoto;
                    updates['players/' + id + '/isplayer'] = profile.isplayer;
                    updates['players/' + id + '/ageyear'] = year;
                    updates['players/' + id + '/agemonth'] = month;
                    updates['players/' + id + '/ageday'] = day;

                    updates['players/' + id + '/favlatitude'] = profile.favlatitude;
                    updates['players/' + id + '/favlongitude'] = profile.favlongitude;


                    //Age
                    if (withdetails) {
                        //updates['players/' + id + '/teamdisplayed'] = profile.teamdisplayed;
                        updates['players/' + id + '/teamdisplayedkey'] = profile.teamdisplayedkey;
                        updates['players/' + id + '/comments'] = profile.comments;
                        updates['players/' + id + '/isplayer'] = profile.isplayer;

                        updates['players/' + id + '/ageset'] = ageset;
                        updates['players/' + id + '/firstname'] = profile.firstname;
                        updates['players/' + id + '/lastname'] = profile.lastname;
                    }


                    updates['playersinfo/' + id + '/startmonday'] = profile.startmonday;
                    updates['playersinfo/' + id + '/startmondayend'] = profile.startmondayend;
                    updates['playersinfo/' + id + '/starttuesday'] = profile.starttuesday;
                    updates['playersinfo/' + id + '/starttuesdayend'] = profile.starttuesdayend;
                    updates['playersinfo/' + id + '/startwednesday'] = profile.startwednesday;
                    updates['playersinfo/' + id + '/startwednesdayend'] = profile.startwednesdayend;
                    updates['playersinfo/' + id + '/startthursday'] = profile.startthursday;
                    updates['playersinfo/' + id + '/startthursdayend'] = profile.startthursdayend;
                    updates['playersinfo/' + id + '/startfriday'] = profile.startfriday;
                    updates['playersinfo/' + id + '/startfridayend'] = profile.startfridayend;
                    updates['playersinfo/' + id + '/startsaturday'] = profile.startsaturday;
                    updates['playersinfo/' + id + '/startsaturdayend'] = profile.startsaturdayend;
                    updates['playersinfo/' + id + '/startsunday'] = profile.startsunday;
                    updates['playersinfo/' + id + '/startsundayend'] = profile.startsundayend;
                    updates['playersinfo/' + id + '/available'] = profile.available;
                    updates['playersinfo/' + id + '/skilllevel'] = profile.skilllevel;
                    updates['playersinfo/' + id + '/favstadiumname'] = profile.favstadiumname;
                    //updates['playersinfo/' + id + '/favstadiumphoto'] = profile.favstadiumphoto;
                    updates['playersinfo/' + id + '/isplayer'] = profile.isplayer;
                    updates['playersinfo/' + id + '/ageyear'] = year;
                    updates['playersinfo/' + id + '/agemonth'] = month;
                    updates['playersinfo/' + id + '/ageday'] = day;

                    updates['playersinfo/' + id + '/ageday'] = profile.favlatitude;;
                    updates['playersinfo/' + id + '/ageday'] = profile.favlongitude;

                    updates['playersinfo/' + id + '/favlatitude'] = profile.favlatitude;
                    updates['playersinfo/' + id + '/favlongitude'] = profile.favlongitude;

                    if (withdetails) {
                        //Age

                        updates['playersinfo/' + id + '/ageset'] = ageset;
                        //updates['playersinfo/' + id + '/teamdisplayed'] = profile.teamdisplayed;
                        updates['playersinfo/' + id + '/teamdisplayedkey'] = profile.teamdisplayedkey;
                        updates['playersinfo/' + id + '/firstname'] = profile.firstname;
                        updates['playersinfo/' + id + '/lastname'] = profile.lastname;
                        updates['playersinfo/' + id + '/isplayer'] = profile.isplayer;
                    }


                    return firebase.database().ref().update(updates);
                }
                catch (error) {

                }
            },
            SearchPlayers: function (team, callback) {
                var user = firebase.auth().currentUser;
                var id = user.uid;

                AllPlayers = [];

                try {
                    console.log(team);
                    firebase.database().ref('/players').once('value').then(function (snapshot) {

                        snapshot.forEach(function (childSnapshot) {

                            if (childSnapshot.key != id) {
                                var toadd = true;
                                var status = "Invite to Team";
                                var statuskey = 0;

                                var color = "#28b041";
                                var backcolor = "white";

                                if (childSnapshot.child("teaminvitations/" + team.key).exists()) {

                                    status = "Invitation Sent";
                                    statuskey = 1;

                                    var color = "white";
                                    var backcolor = "#28b041";
                                }
                                else {
                                    status = "Invite to Team";
                                    statuskey = 0;



                                    var color = "#28b041";
                                    var backcolor = "white";
                                }

                                if (toadd) {


                                    var age = new Date();

                                    age.setDate(childSnapshot.child("ageday").val());
                                    age.setFullYear(childSnapshot.child("ageyear").val());
                                    age.setMonth(childSnapshot.child("agemonth").val());


                                    var ageDifMs = Date.now() - age.getTime();
                                    var ageDate = new Date(ageDifMs); // miliseconds from epoch
                                    var num = Math.abs(ageDate.getUTCFullYear() - 1970);

                                    var Items = {
                                        "key": childSnapshot.key,
                                        "displayname": childSnapshot.child("displayname").val(),
                                        "enableinvitations": childSnapshot.child("enableinvitations").val(),
                                        "favouritesport": childSnapshot.child("favouritesport").val(),
                                        "firstname": childSnapshot.child("firstname").val(),
                                        "highestrating": childSnapshot.child("highestrating").val(),
                                        "lastname": childSnapshot.child("lastname").val(),
                                        "middlename": childSnapshot.child("middlename").val(),
                                        "playposition": childSnapshot.child("playposition").val(),
                                        "ranking": childSnapshot.child("ranking").val(),
                                        "status": status,
                                        "teams": childSnapshot.child("teams").val(),
                                        "telephone": childSnapshot.child("telephone").val(),
                                        "winstreak": childSnapshot.child("winstreak").val(),
                                        "photo": childSnapshot.child("photoURL").val() == "" ? "img/PlayerProfile.png" : childSnapshot.child("photoURL").val(),
                                        "devicetoken": childSnapshot.child("devicetoken").val(),
                                        "age": num,
                                        "color": color,
                                        "backcolor": backcolor,
                                        "identity": childSnapshot.child("identity").val(),
                                        "settings": childSnapshot.child("settings").val(),
                                        "favstadium": childSnapshot.child("favstadium").val(),
                                        "favstadiumname": childSnapshot.child("favstadiumname").val()


                                    };

                                    AllPlayers.push(Items);
                                }
                            }
                        })

                        callback(AllPlayers);
                    })

                } catch (error) {

                }

            }

        }

    })
    .factory('HomeStore', function () {
        var myprofile = {};
        myprofile["key"] = "";
        myprofile['photo'] = "img/PlayerProfile.png";
        myprofile["displayname"] = "";
        myprofile["firstname"] = "";
        myprofile["lastname"] = "";
        myprofile["highestrating"] = "";
        myprofile["middlename"] = "";
        myprofile["playposition"] = "";
        myprofile["ranking"] = "";
        myprofile["status"] = "";
        myprofile["telephone"] = "";
        myprofile["winstreak"] = "";
        myprofile["challenges"] = "";
        myprofile["upcominteamgmatches"] = [];
        myprofile["teaminvitations"] = [];
        myprofile["gameinvitation"] = [];
        myprofile["myteams"] = [];
        myprofile["requestednumbers"] = [];
        myprofile["upcomingmatches"] = [];
        myprofile["teamdisplayed"] = "";
        myprofile["teamdisplayedkey"] = "";

        var profile = {};
        profile['photo'] = "img/PlayerProfile.png";
        profile["key"] = "";
        profile["displayname"] = "";
        profile["firstname"] = "";
        profile["lastname"] = "";
        profile["highestrating"] = "";
        profile["middlename"] = "";
        profile["playposition"] = "";
        profile["ranking"] = "";
        profile["status"] = "";
        profile["photo"] = "";
        profile["telephone"] = "";
        profile["winstreak"] = "";
        profile["teamdisplayed"] = "";
        profile["teamdisplayedkey"] = "";

        var TempItems = [];
        var RankedTeams = [];
        return {
            GetProfileInfo: function (currentdate, callback) {
                TempItems = [];
                var user = firebase.auth().currentUser;

                var id = user.uid;

                try {


                    firebase.database().ref('/players/' + id).on('value', function (snapshot) {

                        var totchallenges = [];
                        var upcomingmatches = [];
                        var teaminvitations = [];
                        var gameinvitation = [];
                        var myteams = [];
                        var requestednumbers = [];
                        var previousnumbers = [];
                        var upcomingsinglematches = [];

                        if (snapshot.child("challenges").exists()) {


                            snapshot.child("challenges").forEach(function (challenges) {

                                var challengedate = new Date();
                                var isadmin = challenges.child("admin").val() == id;

                                challengedate.setMinutes(challenges.child("minute").val());
                                challengedate.setFullYear(challenges.child("year").val());
                                challengedate.setMonth(challenges.child("month").val());
                                challengedate.setHours(challenges.child("hour").val());
                                challengedate.setDate(challenges.child("day").val());

                                var dateofchallenge = new Date();
                                dateofchallenge.setMinutes(challenges.child("dateofchallengeminute").val());
                                dateofchallenge.setFullYear(challenges.child("dateofchallengeyear").val());
                                dateofchallenge.setMonth(challenges.child("dateofchallengemonth").val());
                                dateofchallenge.setHours(challenges.child("dateofchallengehour").val());
                                dateofchallenge.setDate(challenges.child("dateofchallengeday").val());



                                var challengedata = {
                                    key: challenges.key,
                                    accepted: challenges.child("accepted").val(),
                                    day: challenges.child("day").val(),
                                    hour: challenges.child("hour").val(),
                                    minute: challenges.child("minute").val(),
                                    month: challenges.child("month").val(),
                                    stadiums: challenges.child("stadiums").val(),
                                    team1adminid: challenges.child("team1adminid").val(),
                                    team1key: challenges.child("team1key").val(),
                                    team1logo: challenges.child("team1logo").val(),
                                    team1name: challenges.child("team1name").val(),
                                    team1rank: challenges.child("team1rank").val(),
                                    team1jersey: challenges.child("team1jersey").val(),

                                    team2adminid: challenges.child("team2adminid").val(),
                                    team2key: challenges.child("team2key").val(),
                                    team2logo: challenges.child("team2logo").val(),
                                    team2name: challenges.child("team2name").val(),
                                    team2rank: challenges.child("team2rank").val(),
                                    team2jersey: challenges.child("team2jersey").val(),

                                    year: challenges.child("year").val(),
                                    date: challengedate,
                                    isadmin: isadmin,

                                    dateofchallenge: dateofchallenge,
                                    adminphoto: challenges.child("adminphoto").val() == "" ? "img/PlayerProfile.png" : challenges.child("adminphoto").val(),
                                    admintelephon: challenges.child("admintelephon").val(),
                                    adminname: challenges.child("adminname").val(),
                                    title: challenges.child("admin").val() == id ? "you challenged " + challenges.child("team2name").val() : challenges.child("team2name").val() + " challenged you",
                                    numplayers: challenges.child("numplayers").val()

                                }

                                switch (challengedata.team1rank) {
                                    case 1:
                                        challengedata.team1rankdescription = challengedata.team1rank + 'st';
                                        break;
                                    case 2:
                                        challengedata.team1rankdescription = challengedata.team1rank + 'nd';
                                        break;
                                    case 3:
                                        challengedata.team1rankdescription = challengedata.team1rank + 'rd';
                                        break;

                                    default:
                                        challengedata.team1rankdescription = challengedata.team1rank + 'th';
                                        break;
                                }

                                switch (challengedata.team2rank) {
                                    case 1:
                                        challengedata.team2rankdescription = challengedata.team2rank + 'st';
                                        break;
                                    case 2:
                                        challengedata.team2rankdescription = challengedata.team2rank + 'nd';
                                        break;
                                    case 3:
                                        challengedata.team2rankdescription = challengedata.team2rank + 'rd';
                                        break;

                                    default:
                                        challengedata.team2rankdescription = challengedata.team2rank + 'th';
                                        break;
                                }
                                totchallenges.push(challengedata);

                            })
                        }
                        if (snapshot.child("upcominteamgmatches").exists()) {
                            snapshot.child("upcominteamgmatches").forEach(function (challenges) {


                                var matchdate = new Date();


                                matchdate.setMinutes(challenges.child("minute").val());
                                matchdate.setFullYear(challenges.child("year").val());
                                matchdate.setMonth(challenges.child("month").val());
                                matchdate.setHours(challenges.child("hour").val());
                                matchdate.setDate(challenges.child("day").val());

                                if (currentdate <= matchdate) {
                                    var matchdata = {

                                        key: challenges.key,

                                        accepted: challenges.child("accepted").val(),
                                        day: challenges.child("day").val(),
                                        hour: challenges.child("hour").val(),
                                        minute: challenges.child("minute").val(),
                                        month: challenges.child("month").val(),

                                        team1adminid: challenges.child("team1adminid").val(),
                                        team1key: challenges.child("team1key").val(),
                                        team1logo: challenges.child("team1logo").val(),
                                        team1name: challenges.child("team1name").val(),
                                        team1rank: challenges.child("team1rank").val(),
                                        team2adminid: challenges.child("team2adminid").val(),
                                        team2key: challenges.child("team2key").val(),
                                        team2logo: challenges.child("team2logo").val(),
                                        team2name: challenges.child("team2name").val(),
                                        team2rank: challenges.child("team2rank").val(),
                                        year: challenges.child("year").val(),
                                        date: matchdate,

                                        stadiumkey: challenges.child("stadiumkey").val(),
                                        ministadiumkey: challenges.child("ministadiumkey").val(),
                                        photo: challenges.child("photo").val(),
                                        price: challenges.child("price").val(),
                                        stadiumdescription: challenges.child("stadiumdescription").val(),
                                        gamestyle: "teammatch",
                                        isadmin: challenges.child("team1adminid").val() == id || challenges.child("team2adminid").val() == id
                                    }
                                    upcomingmatches.push(matchdata);
                                }

                            })


                        }


                        if (snapshot.child("upcomingmatches").exists()) {
                            snapshot.child("upcomingmatches").forEach(function (game) {


                                var matchdate = new Date();


                                matchdate.setMinutes(game.child("minute").val());
                                matchdate.setFullYear(game.child("year").val());
                                matchdate.setMonth(game.child("month").val());
                                matchdate.setHours(game.child("hour").val());
                                matchdate.setDate(game.child("day").val());
                                if (currentdate <= matchdate) {
                                    var matchdata = {

                                        key: game.key,

                                        day: game.child("day").val(),
                                        hour: game.child("hour").val(),
                                        minute: game.child("minute").val(),
                                        month: game.child("month").val(),

                                        year: game.child("year").val(),
                                        date: matchdate,

                                        stadiumkey: game.child("stadiumkey").val(),
                                        ministadiumkey: game.child("ministadiumkey").val(),
                                        stadiumdescription: game.child("stadiumdescription").val(),
                                        photo: game.child("photo").val(),
                                        price: game.child("price").val(),
                                        stadiumdescription: game.child("stadiumdescription").val(),
                                        gamestyle: "alonematch"
                                    }
                                    upcomingsinglematches.push(matchdata);
                                }
                            })


                        }
                        if (snapshot.child("teaminvitations").exists()) {
                            snapshot.child("teaminvitations").forEach(function (challenges) {


                                var matchdate = new Date();


                                matchdate.setMinutes(challenges.child("minute").val());
                                matchdate.setFullYear(challenges.child("year").val());
                                matchdate.setMonth(challenges.child("month").val());
                                matchdate.setHours(challenges.child("hour").val());
                                matchdate.setDate(challenges.child("day").val());

                                var matchdata = {
                                    accepted: challenges.child("accepted").val(),
                                    day: challenges.child("day").val(),
                                    hour: challenges.child("hour").val(),
                                    minute: challenges.child("minute").val(),
                                    month: challenges.child("month").val(),
                                    year: challenges.child("year").val(),

                                    key: challenges.child("key").val(),
                                    teamname: challenges.child("teamname").val(),
                                    badge: challenges.child("badge").val(),
                                    homejersey: challenges.child("homejersey").val(),
                                    awayjersey: challenges.child("awayjersey").val(),

                                    status: challenges.child("status").val(),

                                    date: matchdate,

                                    adminkey: challenges.child("adminkey").val(),
                                    adminfirstname: challenges.child("adminfirstname").val(),
                                    adminlastname: challenges.child("adminlastname").val(),
                                    adminphoto: challenges.child("adminphoto").val() == "" ? "img/PlayerProfile.png" : challenges.child("adminphoto").val(),
                                    admintelephone: challenges.child("admintelephone").val(),

                                }
                                teaminvitations.push(matchdata);

                            })


                        }


                        if (snapshot.child("teams").exists()) {
                            snapshot.child("teams").forEach(function (teams) {

                                var matchdata = {
                                    key: teams.key,
                                    badge: teams.child("badge").val(),
                                    rank: teams.child("rank").val(),
                                    teamname: teams.child("teamname").val()

                                }
                                myteams.push(matchdata);

                            })


                        }

                        if (snapshot.child("myrequests").exists()) {
                            snapshot.child("myrequests").forEach(function (mrequest) {
                                if (mrequest.child("requeststatus").val() == 0) {


                                    var matchdata = {
                                        key: mrequest.key,
                                        firstname: mrequest.child("firstname").val(),
                                        lastname: mrequest.child("lastname").val(),
                                        photo: mrequest.child("requestorphoto").val() == "" ? "img/PlayerProfile.png" : mrequest.child("requestorphoto").val(),
                                        telephone: mrequest.child("requestortelephone").val()

                                    }
                                    requestednumbers.push(matchdata);
                                }
                            })





                        }

                        if (snapshot.child("previousrequests").exists()) {
                            snapshot.child("previousrequests").forEach(function (req) {

                                var color = "rgb(221,162,22)";
                                var text = "Pending";

                                if (req.child("requeststatus").val() == 1) {
                                    color = "#2ab041";
                                    text = req.child("telephone").val();
                                }

                                var matchdata = {
                                    key: req.key,
                                    firstname: req.child("firstname").val(),
                                    lastname: req.child("lastname").val(),
                                    photo: (req.child("photo").val() == "" || !req.child("photo").exists()) ? "img/PlayerProfile.png" : req.child("photo").val(),
                                    telephone: req.child("telephone").val(),
                                    status: req.child("requeststatus").val(),
                                    color: color,
                                    text: text

                                }
                                previousnumbers.push(matchdata);

                            })


                        }


                        if (snapshot.child("gameinvitation").exists()) {
                            snapshot.child("gameinvitation").forEach(function (challenges) {


                                var matchdate = new Date();


                                matchdate.setMinutes(challenges.child("minute").val());
                                matchdate.setFullYear(challenges.child("year").val());
                                matchdate.setMonth(challenges.child("month").val());
                                matchdate.setHours(challenges.child("hour").val());
                                matchdate.setDate(challenges.child("day").val());

                                var matchdata = {
                                    key: challenges.key,


                                    day: challenges.child("day").val(),
                                    hour: challenges.child("hour").val(),
                                    minute: challenges.child("minute").val(),
                                    month: challenges.child("month").val(),

                                    team1adminid: challenges.child("team1adminid").val(),
                                    team1key: challenges.child("team1key").val(),
                                    team1logo: challenges.child("team1logo").val(),
                                    team1name: challenges.child("team1name").val(),
                                    team1rank: challenges.child("team1rank").val(),

                                    team2adminid: challenges.child("team2adminid").val(),
                                    team2key: challenges.child("team2key").val(),
                                    team2logo: challenges.child("team2logo").val(),
                                    team2name: challenges.child("team2name").val(),
                                    team2rank: challenges.child("team2rank").val(),

                                    year: challenges.child("year").val(),
                                    date: matchdate,

                                    stadiums: challenges.child("stadium").val(),

                                    belonging: challenges.child("belonging").val(),

                                }
                                gameinvitation.push(matchdata);

                            })


                        }


                        myprofile["key"] = snapshot.key;
                        myprofile["photo"] = snapshot.child("photoURL").val();
                        myprofile["displayname"] = snapshot.child("displayname").val();
                        myprofile["firstname"] = snapshot.child("firstname").val();
                        myprofile["lastname"] = snapshot.child("lastname").val();
                        myprofile["highestrating"] = snapshot.child("highestrating").val();
                        myprofile["middlename"] = snapshot.child("middlename").val();
                        myprofile["playposition"] = snapshot.child("playposition").val();
                        myprofile["ranking"] = snapshot.child("ranking").val();
                        myprofile["status"] = snapshot.child("status").val();
                        myprofile["photo"] = snapshot.child("photoURL").val(),
                            myprofile["telephone"] = snapshot.child("telephone").val();
                        myprofile["winstreak"] = snapshot.child("winstreak").val();
                        myprofile["challenges"] = totchallenges;
                        myprofile["upcominteamgmatches"] = upcomingmatches;
                        myprofile["teaminvitations"] = teaminvitations;
                        myprofile["gameinvitation"] = gameinvitation;
                        myprofile["myteams"] = myteams;
                        myprofile["requestednumbers"] = requestednumbers;
                        myprofile["previousnumbers"] = previousnumbers;
                        myprofile["upcomingmatches"] = upcomingsinglematches;
                        myprofile["teamdisplayed"] = "none";
                        myprofile["teamdisplayedkey"] = snapshot.child("teamdisplayedkey").val();

                        callback(myprofile);
                    }, function (error) {

                    });
                } catch (error) {

                }
                // return myprofile;
            },

            GetProfileInfoByKey: function (key, callback) {
                TempItems = [];
                try {

                    firebase.database().ref('/playersinfo/' + key).on('value', function (snapshot) {
                        var age = new Date();

                        age.setDate(snapshot.child("ageday").val());
                        age.setFullYear(snapshot.child("ageyear").val());
                        age.setMonth(snapshot.child("agemonth").val());


                        var ageDifMs = Date.now() - age.getTime();
                        var ageDate = new Date(ageDifMs); // miliseconds from epoch
                        var num = Math.abs(ageDate.getUTCFullYear() - 1970);


                        var skilldescription = "newbie";
                        switch (snapshot.child("skilllevel").val()) {
                            case 0:
                                skilldescription = "newbie";
                                break;
                            case 1:
                                skilldescription = "not bad";
                                break;

                            case 2:
                                skilldescription = "solid";
                                break;
                            case 3:
                                skilldescription = "Pro";
                                break;

                            default:
                                break;
                        }

                        profile["key"] = snapshot.key;
                        profile["displayname"] = snapshot.child("displayname").val();
                        profile["firstname"] = snapshot.child("firstname").val();
                        profile["lastname"] = snapshot.child("lastname").val();
                        profile["highestrating"] = snapshot.child("highestrating").val();
                        profile["middlename"] = snapshot.child("middlename").val();
                        profile["playposition"] = snapshot.child("playposition").val();
                        profile["ranking"] = snapshot.child("ranking").val();
                        profile["isMobileVerified"] = snapshot.child("isMobileVerified").val();
                        profile["status"] = snapshot.child("status").val();
                        profile["photo"] = snapshot.child("photoURL").val();
                        profile["telephone"] = snapshot.child("telephone").val();
                        profile["winstreak"] = snapshot.child("winstreak").val();
                        profile["teamdisplayed"] = "none";
                        profile["teamdisplayedkey"] = snapshot.child("teamdisplayedkey").val();


                        profile["startmonday"] = snapshot.child("startmonday").val();
                        profile["startmondayend"] = snapshot.child("startmondayend").val();
                        profile["starttuesday"] = snapshot.child("starttuesday").val();
                        profile["starttuesdayend"] = snapshot.child("starttuesdayend").val();
                        profile["startwednesday"] = snapshot.child("startwednesday").val();
                        profile["startwednesdayend"] = snapshot.child("startwednesdayend").val();
                        profile["startthursday"] = snapshot.child("startthursday").val();
                        profile["startthursdayend"] = snapshot.child("startthursdayend").val();
                        profile["startfriday"] = snapshot.child("startfriday").val();
                        profile["startfridayend"] = snapshot.child("startfridayend").val();
                        profile["startsaturday"] = snapshot.child("startsaturday").val();
                        profile["startsaturdayend"] = snapshot.child("startsaturdayend").val();
                        profile["startsunday"] = snapshot.child("startsunday").val();
                        profile["startsundayend"] = snapshot.child("startsundayend").val();


                        //Age
                        profile["ageyear"] = snapshot.child("ageyear").val();
                        profile["agemonth"] = snapshot.child("agemonth").val();
                        profile["ageday"] = snapshot.child("ageday").val();
                        profile["ageset"] = snapshot.child("ageset").val();
                        profile["age"] = age;
                        profile["agenum"] = num;
                        profile["identity"] = snapshot.child("identity").val();
                        profile["available"] = snapshot.child("available").val();
                        profile["availablepng"] = snapshot.child("available").val() ? "available" : "busy";
                        profile["isplayer"] = snapshot.child("isplayer").val();

                        profile["teamdisplayedkey"] = snapshot.child("teamdisplayedkey").val();
                        //"teamdisplayed": snapshot.child("teamdisplayed").val(),
                        profile["skilllevel"] = snapshot.child("skilllevel").val();
                        profile["skilldescription"] = skilldescription;
                        profile["favstadiumname"] = snapshot.child("favstadiumname").val();

                        //"distancetoplay": snapshot.child("identity").val(),
                        //"teamtoshow":snapshot.child("identity").val()



                        callback(profile);
                    }, function (error) {

                    });
                } catch (error) {

                }
                // return myprofile;
            },

            UpdateProfile: function (profile) {

                var profileuser = {

                    "availabledays": profile.availabledays,
                    "displayname": profile.displayname,
                    "enableinvitations": profile.enableinvitations,
                    "favouritesport": profile.child("favouritesport").val(),
                    "firstname": profile.child("firstname").val(),
                    "lastname": profile.lastname,
                    "middlename": profile.middlename,
                    "playposition": profile.playposition,
                    "ranking": profile.ranking,
                    "status": profile.status,
                    "teams": profile.teams,
                    "telephone": profile.telephone

                };


                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};
                updates['/players/' + uid] = profileuser;
                //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

                return firebase.database().ref().update(updates);
            },

            AcceptInvitation: function (challenge, stadium) {



                // Write the new post's data simultaneously in the posts list and the user's post list.
                //var updates = {};
                //updates['/players/' + uid] = profileuser;
                //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

                //return firebase.database().ref().update(updates);
            },
            DeleteChallenge: function (challenge) {

                console.log(challenge);

                try {

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    updates['/players/' + challenge.team1adminid + '/upcominteamgmatches/' + challenge.key] = null;
                    updates['/players/' + challenge.team2adminid + '/upcominteamgmatches/' + challenge.key] = null;

                    for (var i = 0; i < challenge.team1players; i++) {
                        updates['/players/' + challenge.team1players[i].key + '/upcominteamgmatches/' + challenge.key] = null;
                    }
                    for (var i = 0; i < challenge.team2players; i++) {
                        updates['/players/' + challenge.team2players[i].key + '/upcominteamgmatches/' + challenge.key] = null;
                    }

                    //should be already nulls;
                    updates['/players/' + challenge.team1adminid + '/challenges/' + challenge.key] = null;
                    updates['/players/' + challenge.team2adminid + '/challenges/' + challenge.key] = null;

                    //
                    updates['/teams/' + challenge.team1key + '/upcominteamgmatches/' + challenge.key] = null;
                    updates['/teams/' + challenge.team2key + '/upcominteamgmatches/' + challenge.key] = null;

                    updates['/stadiums/' + challenge.stadiums.stadiumkey + '/ministadiums/' + challenge.stadiums.ministadiumkey + '/schedules/' + challenge.stadiums.year + '/' + challenge.stadiums.month + '/' + challenge.stadiums.day + '/' + challenge.key] = null;
                    updates['/stadiums/' + challenge.stadiums.stadiumkey + '/ministadiumshistory/' + challenge.stadiums.ministadiumkey + '/schedules/' + challenge.stadiums.year + '/' + challenge.stadiums.month + '/' + challenge.stadiums.day + '/' + challenge.key] = null;


                    updates['/challenges/' + challenge.key] = null;
                    //updates['/user-posts/' + uid + '/' + newPostKey] = postData;
                    console.log(updates);
                    return firebase.database().ref().update(updates);
                }
                catch (error) {

                }
            },

            RegisterTeamMatch: function (search, user, stadiums, challenge) {


                try {


                    var year = search.date.getFullYear();
                    var month = search.date.getMonth();
                    var day = search.date.getDate();

                    var hour = search.date.getHours();
                    var minute = search.date.getMinutes();

                    var key = stadiums.stadiumkey;
                    var subkey = stadiums.ministadiumkey;

                    var newkey = subkey + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString();
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {

                    var mainkey = newkey;

                    var user = firebase.auth().currentUser;

                    var id = user.uid;

                    var postData = {
                        uid: id,
                        hour: hour,
                        minute: minute,
                        day: day,
                        discount: "0",
                        month: month,
                        nettotal: "",
                        price: stadiums.price,
                        percentage: "",
                        duration: 90,
                        type: "T",
                        year: year,
                        total: stadiums.price,
                        bookedadmin: false,
                        maindata: true,
                        references: "",

                        challengekey: challenge.key,
                        accepted: challenge.accepted,
                        //stadium: challenge.stadium,
                        team1adminid: challenge.team1adminid,
                        team1key: challenge.team1key,
                        team1logo: challenge.team1logo,
                        team1name: challenge.team1name,
                        team1rank: challenge.team1rank,
                        team2adminid: challenge.team2adminid,
                        team2key: challenge.team2key,
                        team2logo: challenge.team2logo,
                        team2name: challenge.team2name,
                        team2rank: challenge.team2rank,
                        teamone: 0,
                        teamonescore: 0,
                        status: 0,
                        numplayers: challenge.numplayers

                    };

                    var extraslots = {
                        usercode: id,
                        type: "T",
                        maindata: false
                    };
                    var updates = {};

                    var numslots = 90 / 30;

                    var mainkey = newkey;
                    var references = [];

                    for (i = 1; i < numslots; i++) {
                        search.date.setMinutes(search.date.getMinutes() + 30);

                        newkey = subkey + search.date.getFullYear().toString() + search.date.getMonth().toString() + search.date.getDate().toString() + search.date.getHours().toString() + search.date.getMinutes().toString();
                        var refdata = {
                            key: newkey
                        }
                        references.push(refdata);

                        var extrakeys = [];
                        if (stadiums.iscombined) {
                            for (var key in stadiums.combined) {
                                extrakeys.push(key);
                            }
                            console.log(extrakeys);
                            extrakeys.forEach(function (element) {
                                updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                                updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                            }, this);
                        }

                        updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                        updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;


                    }
                    postData.references = references;

                    var postDataPlayer = {
                        stadiumkey: stadiums.stadiumkey,
                        ministadiumkey: stadiums.ministadiumkey,
                        photo: stadiums.photo,
                        price: stadiums.price,
                        stadiumdescription: stadiums.stadiumname,
                        hour: hour,
                        minute: minute,
                        day: day,
                        discount: "0",
                        month: month,
                        nettotal: "",
                        teamonescore: 0,
                        teamtwoscore: 0,
                        year: year,
                        bookedadmin: false,

                        challengekey: challenge.key,

                        accepted: challenge.accepted,
                        //stadium: challenge.stadium,
                        team1adminid: challenge.team1adminid,
                        team1key: challenge.team1key,
                        team1logo: challenge.team1logo,
                        team1name: challenge.team1name,
                        team1rank: challenge.team1rank,

                        team2adminid: challenge.team2adminid,
                        team2key: challenge.team2key,
                        team2logo: challenge.team2logo,
                        team2name: challenge.team2name,
                        team2rank: challenge.team2rank,
                        status: 0

                    };


                    if (id !== null || id == '' || id === undefined) {

                        var keys = [];
                        if (stadiums.iscombined) {
                            for (var itemkey in stadiums.combined) {
                                keys.push(itemkey);
                            }

                            keys.forEach(function (element) {
                                updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                                updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                            }, this);
                        }



                        updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                        updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;

                        //add to players upcoming matches

                        updates['/players/' + challenge.team1adminid + '/upcominteamgmatches/' + challenge.key] = postDataPlayer;

                        updates['/players/' + challenge.team2adminid + '/upcominteamgmatches/' + challenge.key] = postDataPlayer;

                        //add to teams upcoming matches
                        updates['/teams/' + challenge.team1key + '/upcominteamgmatches/' + challenge.key] = postDataPlayer;

                        updates['/teams/' + challenge.team2key + '/upcominteamgmatches/' + challenge.key] = postDataPlayer;


                        //delete from challenges
                        //updates['/challenges/' + challenge.key] = null;

                        updates['/players/' + challenge.team1adminid + '/challenges/' + challenge.key] = null;

                        updates['/players/' + challenge.team2adminid + '/challenges/' + challenge.key] = null;


                        updates['/challenges/' + challenge.key + '/gameaccepted'] = true;

                        updates['/challenges/' + challenge.key + '/stadiums'] = angular.copy(stadiums);

                        updates['/challenges/' + challenge.key + '/team1players/' + challenge.team1adminid] =
                            {
                                status: 5, //it means already accepted
                            }

                        updates['/challenges/' + challenge.key + '/team2players/' + challenge.team2adminid] =
                            {
                                status: 5, //it means already accepted
                            }


                    }

                    return firebase.database().ref().update(updates);

                } catch (error) {

                }
            },
            AcceptTeamInvitation: function (invitation, myprofile) {
                try {

                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {

                        updates['/players/' + id + '/teaminvitations/' + invitation.key] = null;

                        updates['/players/' + id + '/teams/' + invitation.key] = null;

                        updates['/teams/' + invitation.key + '/players/' + id] =
                            {
                                isadmin: false,
                                name: myprofile.displayname,
                                name: myprofile.displayname,
                                firstname: myprofile.firstname,
                                lastname: myprofile.lastname
                            };

                        updates['/teaminfo/' + invitation.key + '/players/' + id] =
                            {
                                isadmin: false,
                                firstname: myprofile.firstname,
                                lastname: myprofile.lastname
                            };

                        updates['/players/' + id + '/teams/' + invitation.key] =
                            {
                                key: invitation.key,
                                teamname: invitation.teamname,
                                badge: invitation.badge,

                                dateyear: invitation.year,
                                datemonth: invitation.month,
                                dateday: invitation.day,

                                datehour: invitation.hour,
                                dateminute: invitation.minute
                            };
                    }
                    return firebase.database().ref().update(updates);
                }
                catch (error) {

                }
            },
            AcceptMobileRequest: function (request, myprofile) {

                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (!(id == null || id == '' || id === undefined)) {

                        updates['/players/' + id + '/myrequests/' + request.key + '/requeststatus'] = 1;

                        updates['/players/' + id + '/previousrequests/' + request.key] = {
                            firstname: request.firstname,
                            lastname: request.lastname,
                            key: request.key,
                            telephone: request.telephone,
                            photo: request.photo,
                            requeststatus: 1

                        };

                        /*updates['/players/' + request.key + '/friends/' + id] =
                            {
                                firstname: request.firstname,
                                lastname: request.lastname,
                                key: request.key,
                                telephone: request.telephone,
                                photo: request.photo
                            };*/

                        updates['/players/' + request.key + '/previousrequests/' + id + '/requeststatus'] = 1;
                        updates['/players/' + request.key + '/previousrequests/' + id + '/telephone'] = myprofile.telephone;


                        console.log(request);
                        return firebase.database().ref().update(updates);
                    }
                }
                catch (error) {


                }
            },
            DeleteMobileRequest: function (request) {

                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {

                        //updates['/players/' + id + '/myrequests/' + request.key] = 2;
                        updates['/players/' + id + '/myrequests/' + request.key] = null;
                    }

                    return firebase.database().ref().update(updates);
                }
                catch (error) {

                }
            },
            DeleteOldChalleges: function (oldchallenges) {

                try {

                    var updates = {};
                    for (var i = 0; i < oldchallenges.length; i++) {
                        updates['/players/' + oldchallenges.team1adminid + '/challenges/' + oldchallenges.key] = null;
                        updates['/players/' + oldchallenges.team2adminid + '/challenges/' + oldchallenges.key] = null;
                    }

                    return firebase.database().ref().update(updates);
                }
                catch (error) {

                }
            },
            DeleteInvitation: function (invitation) {

                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {

                        //updates['/players/' + id + '/teaminvitations/' + invitation.key + '/requeststatus'] = null; //cz ari
                        updates['/players/' + id + '/teaminvitations/' + invitation.key] = null; //cz ari

                    }


                    return firebase.database().ref().update(updates);
                }
                catch (error) {

                }
            },
            GetFirstFour: function (callback) {
                var user = firebase.auth().currentUser;
                var id = user.uid;

                firebase.database().ref('/teampoints').orderByChild("rating").limitToFirst(4).on('value', function (snapshot) {
                    RankedTeams = [];
                    snapshot.forEach(function (childSnapshot) {

                        var Items = {
                            "key": childSnapshot.key,
                            "teamname": childSnapshot.child("name").val(),
                            'badge': childSnapshot.child("badge").val(),
                            'rank': childSnapshot.child("rank").val()

                        };

                        RankedTeams.push(Items);
                    });
                    callback(RankedTeams);
                });
            },
            AccepGameInvitation: function (gameinvitation) {

                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {
                        var postDataPlayer = {
                            stadiumkey: gameinvitation.stadiums.stadiumkey,
                            ministadiumkey: gameinvitation.stadiums.ministadiumkey,
                            photo: gameinvitation.stadiums.photo,
                            price: gameinvitation.stadiums.price,
                            stadiumdescription: gameinvitation.stadiums.stadiumname,
                            hour: gameinvitation.hour,
                            minute: gameinvitation.minute,
                            day: gameinvitation.day,
                            discount: "0",
                            month: gameinvitation.month,
                            nettotal: "",
                            teamonescore: 0,
                            teamtwoscore: 0,
                            year: gameinvitation.year,

                            challengekey: gameinvitation.key,

                            //accepted: challenge.accepted,
                            //stadium: challenge.stadium,
                            team1adminid: gameinvitation.team1adminid,
                            team1key: gameinvitation.team1key,
                            team1logo: gameinvitation.team1logo,
                            team1name: gameinvitation.team1name,
                            team1rank: gameinvitation.team1rank,
                            team2adminid: gameinvitation.team2adminid,
                            team2key: gameinvitation.team2key,
                            team2logo: gameinvitation.team2logo,
                            team2name: gameinvitation.team2name,
                            team2rank: gameinvitation.team2rank


                        };
                        //add to players upcoming matches

                        updates['/players/' + id + '/gameinvitation/' + gameinvitation.key] = null;

                        updates['/challenges/' + gameinvitation.key + '/' + gameinvitation.belonging + '/' + id + '/status'] = 5;

                        updates['/players/' + id + '/upcominteamgmatches/' + gameinvitation.key] = postDataPlayer;

                    }
                    return firebase.database().ref().update(updates);
                }
                catch (error) {


                }



            },
            DeleteGameInvitation: function (gameinvitation) {
                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {
                        //add to players upcoming matches

                        updates['/players/' + id + '/gameinvitation/' + gameinvitation.key] = null;

                        updates['/challenges/' + gameinvitation.key + '/' + gameinvitation.belonging + '/' + id + '/status'] = 3;
                    }
                    return firebase.database().ref().update(updates);
                }
                catch (error) {

                }
            }
        }

    })

    .factory('LoginStore', function ($http, $q) {
        var TempItems = [];
        var notificationtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMjMzM2FhYy1jNjBjLTQyNTItYjI1ZS05MmY0ZGQ5OGRhNmYifQ.QCuKlXbH3CczgW-bScCoPVVhPcdf_peZadTRIZFL4j0';
        var notificationurl = 'https://onesignal.com/api/v1/notifications';
        var notificationprofile = 'arinaprofile';
        //var appid = "3c52e01f-0945-4334-aff0-25ff0b5fb7ad";
        var appid = "233d6f63-8ead-4ee7-8e69-03f4088a075a";

        return {

            AddUser: function (newuser, registerdata) {
                try {

                    if (newuser != null) {

                        var date = new Date();

                        var char = newuser.email.charAt(0).charCodeAt(0);
                        var identity = char;
                        var identity = identity.toString() + date.getDay().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();

                        var usertoadd =
                        {
                            uid: newuser.uid,
                            email: newuser.email,
                            winstreak: 0,
                            userdescription: "",
                            telephone: "",
                            enableinvitations: true,
                            highestrating: 1500,
                            firstname: registerdata.firstname,
                            lastname: registerdata.lastname,
                            status: "0",
                            playposition: "Defender",
                            displayname: registerdata.displayname,
                            favouritesport: "football",
                            middlename: "",
                            ranking: 100,
                            cancelled: 0,
                            cancelledweather: 0,
                            didnotshowup: 0,
                            startmonday: 7,
                            startmondayend: 23,
                            starttuesday: 7,
                            starttuesdayend: 23,
                            startwednesday: 7,
                            startwednesdayend: 23,
                            startthursday: 7,
                            startthursdayend: 23,
                            startfriday: 7,
                            startfridayend: 23,
                            startsaturday: 7,
                            startsaturdayend: 23,
                            startsunday: 7,
                            startsundayend: 23,
                            favstadium: "",
                            favstadiumname: "",
                            favstadiumphoto: "",
                            photoURL: "",
                            comments: "",
                            ageset: 0,
                            ageyear: 1990,
                            agemonth: 1,
                            ageday: 1,
                            identity: identity,
                            playerstatus: true,
                            available: false,
                            isplayer: true,
                            teamdisplayed: "",
                            teamdisplayedkey: "none",

                            skillevel: "newbie",
                            isbanned: false,
                            isMobileVerified: false,
                            settings:
                            {
                                notification: true,
                                reminder_3hours: true,
                            },
                            favlatitude: 0,
                            favlongitude: 0

                        }

                        // Write the new post's data simultaneously in the posts list and the user's post list.
                        var updates = {};
                        updates['/players/' + usertoadd.uid + '/'] = usertoadd;
                        updates['/playersinfo/' + usertoadd.uid + '/'] = usertoadd;

                        return firebase.database().ref().update(updates);

                    }
                }
                catch (error) {

                }

            },
            GetUser: function (callback) {

                var exists = false;

                var user = firebase.auth().currentUser;

                var id = user.uid;

                try {
                    var query = firebase.database().ref('players/' + id);
                    query.once("value").then(function (snapshot) {

                        if (snapshot.exists()) {
                            exists = true;
                        }
                        callback(exists);

                    }, function (error) {

                    });


                }
                catch (error) {

                }

            },
            AddFbUser: function (newuser) {
                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;
                    if (newuser != null) {
                        var date = new Date();
                        var identity = "" + String.fromCharCode(newuser.email[0]);
                        identity = identity + date.getDay() + date.getSeconds() + date.getMilliseconds();
                        var usertoadd =
                        {
                            uid: id,
                            email: newuser.email == null ? "" : newuser.email,
                            winstreak: 0,
                            userdescription: "",
                            telephone: "",
                            enableinvitations: true,
                            highestrating: 1500,
                            firstname: newuser.displayName == null ? "" : newuser.displayName,
                            lastname: "",
                            status: "0",
                            playposition: "Defender",
                            displayname: newuser.displayName == null ? "" : newuser.displayName,
                            favouritesport: "football",
                            middlename: "",
                            ranking: 100,
                            cancelled: 0,
                            cancelledweather: 0,
                            didnotshowup: 0,
                            startmonday: 7,
                            startmondayend: 23,
                            starttuesday: 7,
                            starttuesdayend: 23,
                            startwednesday: 7,
                            startwednesdayend: 23,
                            startthursday: 7,
                            startthursdayend: 23,
                            startfriday: 7,
                            startfridayend: 23,
                            startsaturday: 7,
                            startsaturdayend: 23,
                            startsunday: 7,
                            startsundayend: 23,
                            favstadium: "",
                            favstadiumname: "",
                            favstadiumphoto: "",
                            photoURL: newuser.photoURL == null ? "" : newuser.photoURL,
                            comments: "",
                            ageset: 0,
                            ageyear: 1990,
                            agemonth: 1,
                            ageday: 1,
                            identity: identity,
                            playerstatus: true,

                            available: false,
                            isplayer: true,
                            teamdisplayed: "",
                            teamdisplayedkey: "none",
                            skillevel: "newbie",
                            isbanned: false,
                            isMobileVerified: false,
                            settings:
                            {
                                notification: true,
                                reminder_3hours: true,
                            },
                            favlatitude: 0,
                            favlongitude: 0

                        }

                        // Write the new post's data simultaneously in the posts list and the user's post list.
                        var updates = {};
                        updates['/players/' + usertoadd.uid + '/'] = usertoadd;
                        updates['/playersinfo/' + usertoadd.uid + '/'] = usertoadd;

                        return firebase.database().ref().update(updates);

                    }
                }
                catch (error) {

                }

            },
            PostError: function (error, linenumber, filename) {
                var user = firebase.auth().currentUser;
                if (!(user == undefined || user != null)) {
                    var id = user.uid;

                    var errortoadd =
                    {
                        uid: newuser.uid,
                        errorcode: error.code,
                        errordescription: error.message,
                        date: new Date(),
                        linenumber: linenumber,
                        filename: filename
                    };
                    var newPostKey = firebase.database().ref().child('errors').push().key;
                    var updates = {};
                    updates['/errors/' + newPostKey] = errortoadd;
                    return firebase.database().ref().update(updates);


                }
                return 0;

            },
            getRatingDelta: function (myRating, opponentRating, myGameResult) {

                if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
                    return null;
                }

                var myChanceToWin = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));

                return Math.round(32 * (myGameResult - myChanceToWin));
            },

            getNewRating: function (myRating, opponentRating, myGameResult) {
                return myRating + this.getRatingDelta(myRating, opponentRating, myGameResult);
            },
            SendNotification: function (message, devicetokens, atTime) {

                //  debugger;

                var notID = null;
                var message = {
                    app_id: "233d6f63-8ead-4ee7-8e69-03f4088a075a",
                    contents: { "en": message },
                    small_icon: "drawable-ldpi-icon.png",
                    large_icon: "drawable-xxxhdpi-icon.png",
                    include_player_ids: devicetokens
                };

                var headers = {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Basic MTg2NTRmZmUtOTBiYS00OGI3LWJmOTUtNzNiMzU1NTFkZGYy"
                };

                if (atTime === undefined) {
                    console.log("devliery time not passed");
                }
                else {
                    message.send_after = atTime;
                    //message.delayed_option =timezone;
                    //message.delivery_time_of_day=atTime;
                }

                var req = {
                    method: 'POST',
                    url: notificationurl,
                    headers: headers,
                    data: message,
                    headings: { "en": "English Title", "es": "Spanish Title" }

                }

                message.app_id = '3c52e01f-0945-4334-aff0-25ff0b5fb7ad';
                headers.Authorization = "Basic MzUzM2UzZTQtNWRkOS00ZjZiLWExZTctYTgyYTIwNjMzOGU5"

                var req1 = {
                    method: 'POST',
                    url: notificationurl,
                    headers: headers,
                    data: message,
                    headings: { "en": "English Title", "es": "Spanish Title" }

                }

                return $q.all([$http(req), $http(req1)]);
            },
            CancelNotification: function (notificationID) {

                var url = notificationurl + "/" + notificationID + "?app_id=" + appid;

                var headers = {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Basic MzUzM2UzZTQtNWRkOS00ZjZiLWExZTctYTgyYTIwNjMzOGU5"
                };

                var req = {
                    method: 'DELETE',
                    url: url,
                    headers: headers
                }

                return $http(req);
            },
            UpdateLastSeen: function () {

                var user = firebase.auth().currentUser;

                if (!(user === null || user == '' || user === undefined)) {

                    var updates = {};
                    var CurrentDate = new Date();

                    var year = CurrentDate.getFullYear();
                    var month = CurrentDate.getMonth();
                    var day = CurrentDate.getDate();

                    var hour = CurrentDate.getHours();
                    var minute = CurrentDate.getMinutes();

                    updates['/players/' + user.uid + '/lastseen/loginyear'] = year;
                    updates['/players/' + user.uid + '/lastseen/loginmonth'] = month;
                    updates['/players/' + user.uid + '/lastseen/loginday'] = day;
                    updates['/players/' + user.uid + '/lastseen/loginhour'] = hour;
                    updates['/players/' + user.uid + '/lastseen/loginminute'] = minute;

                    updates['/playersinfo/' + user.uid + '/lastseen/loginyear'] = year;
                    updates['/playersinfo/' + user.uid + '/lastseen/loginmonth'] = month;
                    updates['/playersinfo/' + user.uid + '/lastseen/loginday'] = day;
                    updates['/playersinfo/' + user.uid + '/lastseen/loginhour'] = hour;
                    updates['/playersinfo/' + user.uid + '/lastseen/loginminute'] = minute;

                    firebase.database().ref().update(updates);
                }
            }

        }

    })

    .controller('LoginController', function ($scope, $ionicModal, $ionicLoading, $ionicHistory, $ionicPopup, $timeout, $state, LoginStore, FirebaseStorageService) {





        $scope.loginData = {};
        $scope.myprofile = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.

            }, function (error) {
                // An error happened.

            });
            // $scope.modal.hide();
        };

        $scope.Loading = false;
        $scope.LoadingSigning = false;

        $scope.registerdata =
            {

                displayname: '',
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                confirmpassword: ''
            }

        $scope.registerusername = '';
        $scope.registerpassword = '';

        $scope.userImage = "img/PlayerProfile.png";
        $scope.chooseImage = function () {
            var options = {
                quality: 70,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.PNG,
                allowEdit: true,
                targetWidth: 400,
                targetHeight: 400,
                saveToPhotoAlbum: false
            };

            navigator.camera.getPicture(function (imageURI) {
                $scope.userImage = "data:image/png;base64," + imageURI;
                $scope.$apply();
            }, function (error) {

            }, options);
        };

        $scope.Register = function () {


            try {

                $scope.Loading = true;

                if ($scope.registerdata.firstname.trim() == '') {
                    var alertPopup = $ionicPopup.alert({
                        template: 'Please Enter a First Name'
                    });
                    $scope.Loading = false;
                    $scope.$apply();

                }
                else
                    if ($scope.registerdata.lastname.trim() == '') {
                        var alertPopup = $ionicPopup.alert({
                            template: 'Please Enter a Last Name'
                        });
                        $scope.Loading = false;
                        $scope.$apply();
                    }
                    else {

                        firebase.auth().createUserWithEmailAndPassword($scope.registerdata.email, $scope.registerdata.password).then(function (user) {
                            var newuser = firebase.auth().currentUser;
                            var name, email, photoUrl, uid;

                            if (user != null && newuser != null && newuser != undefined) {

                                LoginStore.GetUser(function (data) {
                                    if (data) {
                                        $ionicHistory.nextViewOptions({
                                            disableBack: true
                                        });
                                        $state.go("app.homepage");

                                    }
                                    else {

                                        LoginStore.AddUser(newuser, $scope.registerdata).then(function (success) {
                                            var user = firebase.auth().currentUser;

                                            if ($scope.userImage != "img/PlayerProfile.png")
                                                FirebaseStorageService.saveUserProfilePicture($scope.userImage, user.uid);

                                            user.sendEmailVerification().then(function () {

                                                var alertPopup = $ionicPopup.alert({
                                                    title: 'Account Registered',
                                                    template: 'Welcome To Arina. Thank you for Registering.'
                                                });

                                                alertPopup.then(function () {
                                                    $state.go('app.firsttimelogin');
                                                });
                                            }, function (error) {
                                                $scope.Loading = false;
                                            });
                                        }, function (error) {
                                            $scope.Loading = false;

                                            // An error happened.
                                        });
                                    }
                                });

                            }

                        }).catch(function (error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            $scope.Loading = false;
                            $scope.$apply();

                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: errorMessage
                            });

                            // ...
                        });
                    }
            } catch (error) {

                var errorCode = error.code;
                var errorMessage = error.message;

                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: errorMessage
                });

                $scope.Loading = false;
            }



        };



        $scope.toggle = false;
        $scope.LogIn = function (username) {

            var usere = firebase.auth().currentUser;
            $scope.LoadingSigning = true;

            if (!usere) {

                /*     $ionicLoading.show({
                         content: 'Loading',
                         animation: 'fade-in',
                         showBackdrop: true,
                         maxWidth: 200,
                         showDelay: 0
                     });*/



                firebase.auth().signInWithEmailAndPassword($scope.registerusername, $scope.registerpassword).then(function (user) {

                    LoginStore.GetUser(function (data) {
                        var user = firebase.auth().currentUser;
                        if (data) {
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $ionicLoading.hide();
                            $state.go("app.homepage");
                        }
                        else {


                            LoginStore.AddUser(user).then(function (result) {
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });

                                user.sendEmailVerification().then(function () {
                                    $ionicLoading.hide();
                                    $state.go('app.homepage');

                                }, function (error) {
                                    $state.go('app.homepage');
                                });

                            }, function (error) {
                                // An error happened.
                            });



                        }

                    });

                })
                    .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: errorMessage
                        });

                        $scope.Loading = false;
                        $scope.LoadingSigning = false;

                        $scope.$apply();

                    });
            }
            else {
                LoginStore.GetUser(function (data) {
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    if (data) {

                        $state.go('app.homepage');
                    }
                    else {
                        var user = firebase.auth().currentUser;

                        user.sendEmailVerification().then(function () {
                            LoginStore.AddUser(user).then(function (result) {

                                $state.go('app.homepage');

                            }, function (error) {

                            });

                        }, function (error) {
                            $scope.LoadingSigning = false;
                            // An error happened.
                        });

                    }

                });
            }
        };


        $scope.Switch = function () {

            $scope.toggle = !$scope.toggle;

        }

        $scope.FacebookLogin = function () {
            try {

                var auth = firebase.auth();

                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                facebookConnectPlugin.login(['email', 'public_profile', 'user_friends'], //first argument is an array of scope permissions
                    function (userData) {

                        if (userData.authResponse) {
                            facebookConnectPlugin.api('me/?fields=email,name,first_name,last_name', ["public_profile"],
                                function (infoesult) {

                                    facebookConnectPlugin.getAccessToken(function (token) {

                                        var credential = firebase.auth.FacebookAuthProvider.credential(token);
                                        firebase.auth().signInWithCredential(credential).then(function (result) {
                                            $scope.myprofile = result;
                                            var user = firebase.auth().currentUser;
                                            if (user) {

                                                LoginStore.GetUser(function (data) {
                                                    $ionicHistory.nextViewOptions({
                                                        disableBack: true
                                                    });
                                                    if (data) {

                                                        $ionicLoading.hide();
                                                        $state.go('app.homepage');
                                                    }
                                                    else {
                                                        LoginStore.AddFbUser($scope.myprofile).then(function (result) {

                                                            $ionicLoading.hide();
                                                            $state.go('app.homepage');
                                                        }, function (error) {
                                                            $ionicLoading.hide();

                                                        });
                                                    }
                                                });
                                            }
                                        }).catch(function (error) {

                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Error',
                                                template: error.message
                                            });

                                            $ionicLoading.hide();
                                            // ...
                                        });
                                    });

                                });
                        }

                    },
                    function (error) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: error.message
                        });
                        $ionicLoading.hide();
                    }
                )
            }
            catch (error) {

                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.message
                });
                $ionicLoading.hide();

            }

        };

        $scope.GoToRegister = function () {
            $state.go('registerpage');
        };
        $scope.GoToLoginPage = function () {
            $state.go('signin');
        };
        $scope.GoToForgetPass = function () {
            $state.go('loginforgotpass');
        };


    })

    .controller('FirstPageController', function ($scope, $ionicPopover, $ionicHistory, $ionicPopup, $ionicLoading, $state, $timeout) {

        $timeout(function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            var user = firebase.auth().currentUser;

            if (user) {

                $state.go('app.homepage');

            } else {
                $state.go('signin');
            }

        }, 2000);

    })

    //add $ionicPush
    .controller('MenuController', function ($scope, $state, $stateParams, $ionicPopup, $ionicLoading, LoginStore) {
        $scope.logout = function () {

            try {

                var user = firebase.auth().currentUser;

                if (!(user === null || user == '' || user === undefined)) {

                    /*LoginStore.UpdateLastSeen();
                    firebase.auth().signOut().then(function () {

                        $state.go('signin');

                    }, function (error) {

                    });*/
                    window.plugins.OneSignal.getIds(function (ids) {

                        var updates = {};

                        updates['/players/' + user.uid + '/devicetoken/' + ids.userId] = null;
                        updates['/playersinfo/' + user.uid + '/devicetoken/' + ids.userId] = null;

                        firebase.database().ref().update(updates).then(function () {

                            firebase.auth().signOut().then(function () {

                                $state.go('signin');

                            }, function (error) {

                            });
                        });
                    }, function (error) {
                        $state.go('signin');
                    });

                }

            }
            catch (err) {

            }
        }

    })

    .controller('LoginPassController', function ($scope, $state, $ionicPopup) {


        $scope.email =
            {
                address: ""
            }

        $scope.submit = function () {
            try {
                var auth = firebase.auth();
                var emailAddress = $scope.email.address;

                auth.sendPasswordResetEmail(emailAddress).then(function () {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Reset Password',
                        template: 'An email has been sent to your email to reset your password'
                    });

                    alertPopup.then(function () {
                        $state.go("signin");
                    });

                }, function (error) {

                });
            } catch (error) {

            }


        };
    })

    .controller('FirstTimeLoginController', function ($scope, $state, $ionicPopup, TeamStores, ProfileStore1, $ionicHistory, SMSService, $ionicLoading) {
        $scope.currentprofile =
            {
                startmonday: 7,
                startmondayend: 23,
                starttuesday: 7,
                starttuesdayend: 23,
                startwednesday: 7,
                startwednesdayend: 23,
                startthursday: 7,
                startthursdayend: 23,
                startfriday: 7,
                startfridayend: 23,
                startsaturday: 7,
                startsaturdayend: 23,
                startsunday: 7,
                startsundayend: 23,
                favstadium: "",
                favstadiumname: "",
                favstadiumphoto: "",
                available: false,
                skilllevel: "Newbie",
                isplayer: true,
                age: new Date(),
                favlatitude: 0,
                favlongitude: 0

            }


        $scope.currentprofile.age.setDate(1);
        $scope.currentprofile.age.setFullYear(1990);
        $scope.currentprofile.age.setMonth(1);

        $scope.isplayercolors = {
            player:
            {
                color: '#2ab041',
                backcolor: 'white'
            },
            goalkeeper:
            {
                color: '#2ab041',
                backcolor: 'white'
            }
        }

        if ($scope.currentprofile.isplayer) {
            $scope.isplayercolors.player.color = 'white';
            $scope.isplayercolors.player.backcolor = '#2ab041';

            $scope.isplayercolors.goalkeeper.color = '#2ab041';
            $scope.isplayercolors.goalkeeper.backcolor = 'white';
        }
        else {
            $scope.isplayercolors.player.color = '#2ab041';
            $scope.isplayercolors.player.backcolor = 'white';

            $scope.isplayercolors.goalkeeper.color = 'white';
            $scope.isplayercolors.goalkeeper.backcolor = '#2ab041';
        }


        $scope.gochoosestadium = function (team) {
            $state.go("app.choosestadium", {
                myteam: $scope.currentprofile
            })
        }

        $scope.switchcolors = function (x) {
            switch (x) {
                case 0:
                    $scope.currentprofile.isplayer = true;
                    $scope.isplayercolors.player.color = 'white';
                    $scope.isplayercolors.player.backcolor = '#2ab041';

                    $scope.isplayercolors.goalkeeper.color = '#2ab041';
                    $scope.isplayercolors.goalkeeper.backcolor = 'white';
                    break;
                case 1:
                    $scope.currentprofile.isplayer = false;
                    $scope.isplayercolors.player.color = '#2ab041';
                    $scope.isplayercolors.player.backcolor = 'white';

                    $scope.isplayercolors.goalkeeper.color = 'white';
                    $scope.isplayercolors.goalkeeper.backcolor = '#2ab041';
                    break;


            }
            $scope.$apply();
        }



        $scope.checkMobileNumber = function (e, verified) {
            console.log(111, verified);
            if (verified) {
                $scope.currentprofile.available = verified;
                $scope.$apply();
            }
            if ($scope.currentprofile.available && !verified) {
                e.preventDefault();
                $scope.currentprofile.available = !$scope.currentprofile.available;
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
                        SMSService.verifyUserMobile($scope, $scope.checkMobileNumber, [e, true])
                    } else {
                        $scope.currentprofile.available = !$scope.currentprofile.available;
                    }
                });
            }
        };

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


        $scope.slider1 = {
            minValue: 7,
            maxValue: 23,

            options: {
                floor: 7,
                showSelectionBar: true,
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

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
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';
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
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

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
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

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
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

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
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

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
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        $scope.UpdateUser = function (profile) {

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            ProfileStore1.UpdateProfile(profile, false).then(function (result) {

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                $ionicLoading.hide();
                $state.go("app.homepage");

            }, function (error) {
                $ionicLoading.hide();

            });

        };


    })

    .controller('RateStadiumController', function ($scope, $state, $ionicPopup) {



    });
