
angular.module('football.controllers')

.factory('TeamS',function()
{
    var TempItems = [];
    var myaccount
    {
        code : "00001";
    };

    return {
        GetAccountInfo: function () {
            alert(myaccount.code);
            return myaccount;
        },
        GetMyTeams: function () {
            TempItems = [];
            firebase.database().ref('/teams').on('value',function (snapshot) {
                var firstName = snapshot.child("barca/teamphoto").val(); // "Ada"
                //alert(firstName);
                

                snapshot.forEach(function (childSnapshot) {
                    var Items = {
                        "key" :childSnapshot.val(),
                        "teamname": childSnapshot.child("teamname").val(),
                        'teamphoto': childSnapshot.child("teamphoto").val(),
                        'datecreated': childSnapshot.child("datecreated").val()

                    };

                    TempItems.push(Items)
                });
            });

            return TempItems;
        },

        GetAllTeams: function () {
        firebase.database().ref('/teams').once('value').then(function (snapshot) {
            var firstName = snapshot.child("barca/teamphoto").val(); // "Ada"
            //alert(firstName);


            snapshot.forEach(function (childSnapshot) {
                var Items = {
                    "key" :childSnapshot.val(),
                    "teamname": childSnapshot.child("teamname").val(),
                    'teamphoto': childSnapshot.child("teamphoto").val(),
                    'datecreated': childSnapshot.child("datecreated").val()

                };

                TempItems.push(Items)
            });
        });

        return TempItems;
        },

        GetTeamByKey: function (key) {
            firebase.database().ref('/teams').once('value').then(function (snapshot) {
                var firstName = snapshot.child("barca/teamphoto").val(); // "Ada"
                //alert(firstName);


                snapshot.forEach(function (childSnapshot) {
                    var Items = {
                        "key": childSnapshot.val(),
                        "teamname": childSnapshot.child("teamname").val(),
                        'teamphoto': childSnapshot.child("teamphoto").val(),
                        'datecreated': childSnapshot.child("datecreated").val()

                    };

                    TempItems.push(Items)
                });
            });

            return TempItems;
        },

        DeleteTeamByKey: function (key) {
            firebase.database().ref('/teams').once('value').then(function (snapshot) {
                var firstName = snapshot.child("barca/teamphoto").val(); // "Ada"
                //alert(firstName);


                snapshot.forEach(function (childSnapshot) {
                    var Items = {
                        "key": childSnapshot.val(),
                        "teamname": childSnapshot.child("teamname").val(),
                        'teamphoto': childSnapshot.child("teamphoto").val(),
                        'datecreated': childSnapshot.child("datecreated").val()

                    };

                    TempItems.push(Items)
                });
            });

            return TempItems;
        },

        UpdateTeamByKey: function (key) {
            firebase.database().ref('/teams').once('value').then(function (snapshot) {
                var firstName = snapshot.child("barca/teamphoto").val(); // "Ada"
                //alert(firstName);


                snapshot.forEach(function (childSnapshot) {
                    var Items = {
                        "key": childSnapshot.val(),
                        "teamname": childSnapshot.child("teamname").val(),
                        'teamphoto': childSnapshot.child("teamphoto").val(),
                        'datecreated': childSnapshot.child("datecreated").val()

                    };

                    TempItems.push(Items)
                });
            });

            return TempItems;
        },

        AddTeam: function (user) {

            alert(user.teamname);
            // Get a key for a new Post.
            var newPostKey = firebase.database().ref().child('teams').push().key;


            alert(newPostKey);
            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/teams/' + newPostKey] = user;
            //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

            return firebase.database().ref().update(updates);
        }

}
          
})




.controller('stadiumcntl', function ($scope, TeamS, $ionicPopup) {




    var teams = TeamStore.GetMyTeams();

    $scope.test = teams;
    //alert(TeamStore.GetAccountInfo().code);

    $scope.addteam = function (user)

    {
       

        var team = {
           teamname: user.teamname,
           teamadmin: "0001",
           datecreated: new Date().getDate()

        };


        //TeamStore.AddTeam(team);


        $scope.data = {};

        // Custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type = "text" ng-model = "data.model">',
            title: 'Add Team',
            subTitle: 'You succesfully created a team',
            scope: $scope,
            
            buttons: [
               {
                   text: 'Cancel'
               },
               {
                   text: '<b>Save</b>',
                   type: 'button-positive',
                   onTap: function (e) {

                       if (!$scope.data.model) {
                           //don't allow the user to close unless he enters model...
                           e.preventDefault();
                       } else {
                           return $scope.data.model;
                       }
                   }
               }
            ],
            text: 'Team Successfully Added',
        });

        myPopup.then(function (res) {
            console.log('Tapped!', res);
        });
    };


})
        