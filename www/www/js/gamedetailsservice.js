
angular.module('football.controllers')

    .factory('GameDetailsStore', function () {
        var MyTeams = [];

        return {

            GetGamedetails: function (callback) {
                    firebase.database().ref('/teams/').once('value').then(function (snapshot) {
                    //alert(firstName);
                    AllITems = [];

                    snapshot.forEach(function (childSnapshot) {
                        var Items = {
                        "day": day,
                        "month": month,
                        "year": year,
                        "hour": hour,
                        "minute": minute,

                        "stadiums": stadiums,
                        "challengeradmin": id,
                        "challengeradminname": adminname,
                        "challengerteamname": name,
                        "challengerteamlogo": logo,

                        "team1name": teams[i].name,
                        "team1logo": teams[i].logo,
                        "team1rank": teams[i].rank,

                        "team2name": myteam.name,
                        "team2logo": myteam.logo,
                        "team2rank": myteam.rank,
                        "team2adminid": myteam.admin,
                        "team2adminname": myteam.adminname,
                        "team2adminmobile": myteam.adminmobile,
                        "accepted": false

                        };

                        AllITems.push(Items)
                    });
                    callback(AllITems);
                });

            },

            CancelGame: function (callback) {

            },

            AdminAcceptGame: function (key) {


            },

            PlayerAcceptGame: function (key) {


            },
            
            PlayerCancelGame: function (key) {


            },

            InvitePlayer: function (teams, stadiums, date, myteam, pitchdetails) {

  
               
               
                
            }



        }

    })

