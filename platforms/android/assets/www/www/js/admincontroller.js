
angular.module('football.controllers')

.factory('AdminStore',function()
{
    var Availables = [];
    var SchedulesByDay = [];
    var MyStadiums = [];
    var MyMiniStadiums = [];
    var MyBalances = [];

 
    return {
        GetMyStadiums: function (callback) {
            MyStadiums = [];

            var user = firebase.auth().currentUser;

            var id = user.uid;
            //alert(id);
            firebase.database().ref('/admins/' + id + '/stadiums').once('value', function (snapshot) {

                // alert("test");
                snapshot.forEach(function (mainstadiumSnapshot) {
                    //alert(mainstadiumSnapshot.child("name").val());
                    var Data = {
                        "key": mainstadiumSnapshot.key,
                        "name": mainstadiumSnapshot.child("name").val(),
                        "photo": mainstadiumSnapshot.child("photo").val()

                    };
                    MyStadiums.push(Data);

                });

                callback(MyStadiums);
            }, function (error) {
                alert(error.message);
            });

            //alert(Availables.length());
            return Availables;
        },
        GetMyMiniStadiums: function (stadiumid, callback) {
           

            var user = firebase.auth().currentUser;

            var id = user.uid;
            //alert(id);
            firebase.database().ref('/stadiums/' + stadiumid + '/ministadiums').once('value', function (snapshot) {
                MyMiniStadiums = [];
                // alert("test");
                snapshot.forEach(function (mainstadiumSnapshot) {
                    //alert(mainstadiumSnapshot.child("name").val());
                    var Data = {
                        "key": mainstadiumSnapshot.key,

                        "name": mainstadiumSnapshot.child("description").val(),
                        "photo": mainstadiumSnapshot.child("photo").val(),
                        "endhour": mainstadiumSnapshot.child("endhour").val(),
                        "endminute": mainstadiumSnapshot.child("endminute").val(),
                        "price": mainstadiumSnapshot.child("price").val(),
                        "rating": mainstadiumSnapshot.child("rating").val(),
                        "starthour": mainstadiumSnapshot.child("starthour").val(),
                        "rating": mainstadiumSnapshot.child("rating").val(),
                        "startminute": mainstadiumSnapshot.child("startminute").val(),
                        "type": mainstadiumSnapshot.child("type").val()

                    };
                    MyMiniStadiums.push(Data);

                });

                callback(MyMiniStadiums);
            }, function (error) {
                alert(error.message);
            });

            //alert(Availables.length());
            return Availables;
        },
        GetMyStadiumsByDay: function (search, callback) {


            //alert(search.date.getMonth());
            //alert("TEST");
            SchedulesByDay = [];
            var user = firebase.auth().currentUser;

            var id = user.uid;

            //alert(id);

            var year = search.date.getFullYear();
            var month = search.date.getMonth();
            var day = search.date.getDate();

            firebase.database().ref('/stadiums').orderByChild("admin").equalTo(id).on('value', function (snapshot) {
                SchedulesByDay = [];
                snapshot.forEach(function (ministadiums) {
                    //var mininame = ministadiums.child("name").val();
                    ministadiums.child("ministadiums").forEach(function (miniministadiums) {


                        if (miniministadiums.child('schedules/' + year + '/' + month + '/' + day).exists()) {
                            miniministadiums.child('schedules/' + year + '/' + month + '/' + day).forEach(function (minischedule) {

                                var Data =
                                    {
                                        "key": ministadiums.key,
                                        "name": ministadiums.child("name").val(),

                                        "minikey": miniministadiums.key,
                                        "mininame": miniministadiums.child("description").val(),


                                        //"day": miniministadiums.child('schedules/' + year + '/' + month + '/' + day ).child("day").val(),
                                        //"month": miniministadiums.child('schedules/' + year + '/' + month + '/' + day).child("month").val(),
                                        //"year": miniministadiums.child('schedules/' + year + '/' + month + '/' + day).child("year").val(),

                                        "starthour": minischedule.child('hour').val(),
                                        "startminute": minischedule.child('minute').val() == 0 ? "00" : minischedule.child('minute').val(),


                                        "user": minischedule.child("usercode").val(),
                                        //"telephone": miniministadiums.child("telephone").val(),
                                        "price": minischedule.child("price").val()


                                    };

                                SchedulesByDay.push(Data);

                            });
                        }
                    });

                });
                callback(SchedulesByDay);
            }, function (error) {
                alert(error.message);
            });

        },
        GetMyBalances: function (callback) {


            //alert(search.date.getMonth());
            alert("TEST");
            MyBalances = [];
            var user = firebase.auth().currentUser;
            var id = user.uid;

            //alert(id);
            try {



                firebase.database().ref('/stadiums').orderByChild("admin").equalTo(id).on('value', function (snapshot) {
                    MyBalances = [];
                    snapshot.forEach(function (ministadiums) {
                        //var mininame = ministadiums.child("name").val();
                        ministadiums.child("ministadiums").forEach(function (miniministadiums) {


                            if (miniministadiums.child('schedules').exists()) {
                                miniministadiums.child('schedules').forEach(function (yearschedule) {

                                    yearschedule.forEach(function (monthschedule) {
                                        //alert(monthschedule.key);

                                        monthschedule.forEach(function (dayschedule) {
                                            // alert(dayschedule.key);
                                            dayschedule.forEach(function (schedule) {
                                                //alert("TEST2");
                                                var Data =
                                                 {
                                                     "key": ministadiums.key,
                                                     "minikey": miniministadiums.key,

                                                     "reservationnum": schedule.key,
                                                     "type": schedule.child("type").val(),

                                                     "year": schedule.child("year").val(),
                                                     "month": (schedule.child("month").val() + 1),
                                                     "day": schedule.child("day").val(),
                                                     "hour": schedule.child("hour").val(),
                                                     "minute": schedule.child("minute").val() == 0 ? "00" : schedule.child("minute").val(),
                                                     //"telephone": miniministadiums.child("telephone").val(),
                                                     "price": schedule.child("price").val(),
                                                     "percentage": schedule.child("percentage").val(),
                                                     "total": schedule.child("total").val(),


                                                 };

                                                MyBalances.push(Data);
                                            });
                                        });

                                    });
                                });
                            }//if


                        });
                    });
                    callback(MyBalances);
                }, function (error) {
                    alert(error.message);
                });
            }
            catch (error) {
                alert(error.message);
            }

        },
        AddStadium: function (stadiums) {


            //alert(user.teamname);
            // Get a key for a new Post.

            var user = firebase.auth().currentUser;
            var id = user.uid;


            var stadium = {

                admin: id,
                name: stadiums.name,
                telephone: stadiums.telephone != null ? stadiums.telephone : "",
                city: stadiums.city != null ? stadiums.city : "",
                address1: stadiums.address1 != null ? stadiums.address1 : "",
                address2: stadiums.address2 != null ? stadiums.address2 : "",
                email: stadiums.email != null ? stadiums.email : "",
                description: stadiums.description != null ? stadiums.description : "",
                cancelationpolicy: stadiums.cancelationpolicy != null ? stadiums.city : "",
                rating: 0,
                water: true,
                photo: ""

            };
            var newPostKey = firebase.database().ref().child('stadiums').push().key;


            //alert(newPostKey);
            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/stadiums/' + stadiums.name] = stadium;
            updates['/admins/' + id + '/stadiums/' + stadiums.name] = stadium;

            return firebase.database().ref().update(updates);
        },
        AddMiniStadium: function (key, stadiums) {


            //alert(user.teamname);
            // Get a key for a new Post.
            try {



                var user = firebase.auth().currentUser;
                var id = user.uid;


                var stadium = {

                    description: stadiums.name,
                    width: stadiums.width != null ? stadiums.width : "",
                    length: stadiums.heigth != null ? stadiums.heigth : "",

                    price: stadiums.price != null ? stadiums.price : "",
                    type: stadiums.type != null ? stadiums.type : "",
                    typefloor: stadiums.typefloor != null ? stadiums.typefloor : "",

                    photo: stadiums.photo != null ? stadiums.photo : "",
                    rating: "0",
                    numplayers : stadiums.numplayers

                };


                //var newPostKey = firebase.database().ref().child('stadiums/' + key + 'ministadiums').push().key;


                //alert(newPostKey);
                // Write the new post's data simultaneously in the posts list and the user's post list.
                alert(key);
                alert(stadiums.name);
                var updates = {};
                updates['/stadiums/' + key + '/ministadiums/' + stadiums.name] = stadium;

                return firebase.database().ref().update(updates);
            }

            catch (error) {
                alert(error.message);
            }
        }
    }
})


.controller('AdminController', function ($scope,$ionicLoading, AdminStore, $ionicPopup) {


    $scope.$parent.$on("$ionicView.afterEnter", function (event, data) {

        try {


            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            AdminStore.GetMyStadiums(function (leagues) {
                $ionicLoading.hide();
                $scope.mystadiums = leagues;

                if (leagues.length == 0) {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Schedules Till Now'
                    });

                }

            }, function (error) {
                alert(error.message);
            })
        }
        catch (error) {
            alert(error.message);
        }

    });


 

})

.controller('AdminAddController', function ($scope, $ionicLoading,AdminStore, $ionicPopup) {



    $scope.addstadium = function (stadium) {

        alert(stadium.name);
        try
        {

        
            AdminStore.AddStadium(stadium)
                    .then(function (value) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'New Stadium Added'
                        });
                        $state.go("app.adminpage");
                    }, function (error) {
                        alert(error.message);

                        alertPopup.then(function (res) {
                            // Custom functionality....
                        });
                        //$scope.allfreestadiums.

                    })
        }
        catch(error)
        {
            alert(error.message);
        }
    };
})


.controller('AdminMiniController', function ($scope, $stateParams, $ionicLoading,AdminStore, $ionicPopup) {


    $scope.key = $stateParams.stadiumid;
    $scope.$parent.$on("$ionicView.afterEnter", function (event, data) {


        
        try {


            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            AdminStore.GetMyMiniStadiums($stateParams.stadiumid,function (leagues) {
                $ionicLoading.hide();
                $scope.myministadiums = leagues;

                if (leagues.length == 0) {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Mini Stadiums Found'
                    });

                    alert(JSON.stringify(leagues, null, 4));
                }

            }, function (error) {
                alert(error.message);
            })
        }
        catch (error) {
            alert(error.message);
        }

    });



})

.controller('AdminAddMiniController', function ($scope,$stateParams,$ionicLoading, AdminStore, $ionicPopup) {

    //  alert("test");
    //alert($stateParams.stadiumid);

    $scope.ministadium =
        {
            name: "aaa",
            typefloor: "indoor",
            type: "grass",
            price: "30",
            photo: "",
            width: "",
            length: "",
            numplayers:""
        }

    $scope.addministadium = function () {
        try {

          //  alert(ministadium.typefloor);
          // alert($scope.ministadium.name);
            


            AdminStore.AddMiniStadium($stateParams.stadiumid, $scope.ministadium)
                    .then(function (value) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'New Stadium Added'
                        });
                        $state.go("app.adminpagedetails");
                    }, function (error) {
                        alert(error.message);

                        alertPopup.then(function (res) {
                            // Custom functionality....
                        });
                        //$scope.allfreestadiums.

                    })
        }
        catch (error) {
            alert(error.message);
        }
    };
})

.controller('AdminScheduleController', function ($scope, AdminStore, $ionicPopup, $ionicLoading, $timeout, $state) {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;

    $scope.search = {
        date: today
    }

    // alert("Initial");


    $scope.scheduleswithday = [];
    //alert($scope.search.date);



        try
        {
            var today = new Date();

            var onsearch = {
                date: today
            };

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            AdminStore.GetMyStadiumsByDay(onsearch, function (leagues) {
                $ionicLoading.hide();
                $scope.scheduleswithday = leagues;

                if (leagues.length == 0) {
                    
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Schedules Till Now'
                    });

                }

            }, function (error) {
                alert(error.message);
            })
        }
        catch(error)
        {
            alert(error.message);
        }
       


    $scope.ReloadPage = function () {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        AdminStore.GetMyStadiumsByDay($scope.search, function (leagues) {
            $ionicLoading.hide();
            $scope.scheduleswithday = leagues;
            
            if (leagues.length == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'No Schedules Till Now'
                });

            }
            //alert(leagues.length);
            //  alert(JSON.stringify(leagues, null, 4));

        }, function (error) {
            alert(error.message);
        })



        // alert("changed");
    };

    var indexedTeams = [];
    $scope.playersToFilter = function()
    {
        indexedTeams = [];
        return $scope.scheduleswithday;
    };

    $scope.filterTeams = function(player)
    {
        var teamIsNew = indexedTeams.indexOf(player.mininame) == -1;
        if(teamIsNew)
        {
            indexedTeams.push(player.mininame);
        }
        return teamIsNew;
    };

})

.controller('AdminBalanceController', function ($scope, AdminStore, $ionicPopup, $ionicLoading, $timeout, $state) {


    var user = firebase.auth().currentUser;
    var id = user.uid;

    $scope.mybalances = [];
    //alert($scope.search.date);



        try {

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            AdminStore.GetMyBalances(function (leagues) {
                $ionicLoading.hide();
                $scope.mybalances = leagues;

                if (leagues.length == 0) {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Schedules Till Now'
                    });

                }
                else
                {
                    var total =0;
                    for(var i = 0;i<leagues.length;i++)
                    {
                        total = total + leagues[i].total;
                    }
                    $scope.totalbalance = total;

                }
            }, function (error) {
                alert(error.message);
            })
        }
        catch (error) {
            alert(error.message);
        }

        //var commentsRef = firebase.database().ref('/stadiums');
        //commentsRef.on('child_added', function (data) {
        //    alert("WIHA");
        //});


})