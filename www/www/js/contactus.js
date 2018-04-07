
angular.module('football.controllers')

.factory('TeamStore',function()
{
    var TempItems = [];
    var myaccount =
    {
        code : "00001"
    };

    return {
        SendContact: function (contactinfo) {
            TempItems = [];

            var contact = {
                date:contactinfo.date,
                message:contactinfo.message,
                usercode:contactinfo.usercode,
                firstname:contactinfo.firstname,
                lastname:contactinfo.lastname
            };
            // Get a key for a new Post.
            var newPostKey = firebase.database().ref().child('contactus').push().key;

            //alert(newPostKey);
            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/contactus/' + newPostKey] = contact;

            return firebase.database().ref().update(updates);

        },
        GetContact: function (contactinfo) {
            firebase.database().ref('/contactus').once('value').then(function (snapshot) {

                snapshot.forEach(function (childSnapshot) {
                    var Items = {
                        "date": childSnapshot.child("date").val(),
                        "message": childSnapshot.child("message").val(),
                        'usercode': childSnapshot.child("usercode").val(),
                        'firstname': childSnapshot.child("firstname").val(),
                        'lastname': childSnapshot.child("lastname").val()
                    };

                    TempItems.push(Items)
                });
            });

            return TempItems;
        }

}
          
})




.controller('TeamController', function ($scope, TeamStore, $ionicPopup) {




    var teams = TeamStore.GetMyTeams();

    $scope.test = teams;
    //alert(TeamStore.GetAccountInfo().code);

    $scope.addteam = function (user)

    {
       

        var team = {
            teamname: user.teamname,
            teamadmin: "0001",
            datecreated: new Date().getDate(),
            teamphoto: "http://www.vectorportal.com/img_novi/barcelona1_3472.jpg",
            rating:0

        };


        TeamStore.AddTeam(team);

        var alertPopup = $ionicPopup.alert({
            title: 'Add Team',
            template: 'Team Added Successfully'
        });
        $scope.test = TeamStore.GetMyTeams();


    };


})
        