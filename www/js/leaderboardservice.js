angular.module('football.controllers')


    .factory('LeaderBoardStore', function () {
        var RankedTeams = [];
        var TeamProfile = {};
        return {

            GetLeaderboard: function (limit, callback) {



                firebase.database().ref('/teampoints').orderByChild("rating").limitToFirst(limit).once('value').then(function (snapshot) {
                    RankedTeams = [];
                    var playerkeys = [];
                    snapshot.forEach(function (childSnapshot) {

                        if (childSnapshot.child("players").exists()) {
                            childSnapshot.child("players").forEach(function (players) {
                                var pl = {
                                    "key": players.key,

                                };
                                playerkeys.push(pl);
                            })
                        }

                        var Items = {
                            "key": childSnapshot.key,
                            "teamname": childSnapshot.child("name").val(),
                            'badge': childSnapshot.child("badge").val(),
                            'rank': childSnapshot.child("rank").val(),
                            'players': playerkeys

                        };

                        RankedTeams.push(Items);
                    });
                    callback(RankedTeams);
                });
            },
            GetAllLeaderboard: function (callback) {
                firebase.database().ref('/teampoints').orderByChild("rank").once('value').then(function (snapshot) {
                    var AllRankedTeams = [];
                    var playerkeys = [];
                    snapshot.forEach(function (childSnapshot) {
                        var playerkeys = [];
                        if (childSnapshot.child("players").exists()) {
                            childSnapshot.child("players").forEach(function (players) {
                                var pl = {
                                    "key": players.key,

                                };
                                playerkeys.push(pl);
                            })
                        }

                        var Items = {
                            "key": childSnapshot.key,
                            "teamname": childSnapshot.child("name").val(),
                            'badge': childSnapshot.child("badge").val(),
                            'rank': childSnapshot.child("rank").val(),
                            'players': playerkeys

                        };

                        AllRankedTeams.push(Items);
                    });
                    callback(AllRankedTeams);
                });
            },
            UpdateRatings: function (allteams) {
                console.log(allteams);
                var updates = {};
                var counter = 0;
                allteams.forEach(function (element) {
                    counter++;
                    
                    element.players.forEach(function (players) {
                        
                        updates['/players/' + players.key + '/teams/' + element.key + '/rank'] = counter;
                    }, this);

                    updates['/teampoints/' + element.key + '/rating'] = counter;
                    updates['/teams/' + element.key + '/rank'] = counter;
                    updates['/teaminfo/' + element.key + '/rank'] = counter;
                }, this);

                return firebase.database().ref().update(updates);
            }

        }

    })

