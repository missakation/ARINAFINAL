angular.module('football.controllers')


    .factory('TeamStores', function () {
        var MyTeams = [];
        var TeamProfile = {};
        var TeamProfileInfo = {};
        return {

            GetMyTeams: function (callback) {
                var user = firebase.auth().currentUser;
                var id = user.uid;

                if (id !== null || id == '' || id === undefined) {


                    firebase.database().ref('/players/' + id + '/teams').on('value', function (snapshot) {
                        MyTeams = [];
                        if (snapshot.exists()) {


                            snapshot.forEach(function (childSnapshot) {

                                //firebase.database().ref('/teams/' + childSnapshot.key+'/players').once('value').then(function (teamdata) {

                                var datecreated = new Date();


                                datecreated.setMinutes(childSnapshot.child("dateminute").val());
                                datecreated.setFullYear(childSnapshot.child("dateyear").val());
                                datecreated.setMonth(childSnapshot.child("datemonth").val());
                                datecreated.setHours(childSnapshot.child("datehour").val());
                                datecreated.setDate(childSnapshot.child("dateday").val());


                                var Items = {
                                    "key": childSnapshot.key,
                                    "teamname": childSnapshot.child("teamname").val(),
                                    'teamphoto': childSnapshot.child("teamphoto").val(),
                                    'datecreated': datecreated,
                                    'badge': childSnapshot.child("badge").val(),
                                    //'members': teamdata.numChildren()-1,
                                    "members": 1,
                                    "teamadmin": childSnapshot.child("teamadmin").val(),
                                    "favstadium": childSnapshot.child("favstadium").val(),
                                    "rank": childSnapshot.child("rank").val(),
                                    "rating": childSnapshot.child("rating").val(),

                                };
                                MyTeams.push(Items);
                                //   })


                            });
                        }

                        callback(MyTeams);
                    });
                }
                else {
                    callback(MyTeams);
                }

            },

            GetAllTeams: function () {
                firebase.database().ref('/teams').once('value').then(function (snapshot) {
                    var firstName = snapshot.child("barca/teamphoto").val(); // "Ada"
                    //alert(firstName);
                    var members = 0;

                    snapshot.forEach(function (childSnapshot) {

                        var Items = {

                            "key": childSnapshot.val(),
                            "teamname": childSnapshot.child("teamname").val(),
                            'teamphoto': childSnapshot.child("teamphoto").val(),
                            'datecreated': datecreated
                            //'members': childSnapshot.child("players").numChildren()

                        };

                        TempItems.push(Items)
                    });
                });

                return TempItems;
            },

            GetRecommendedOpponents: function () {
                firebase.database().ref('/teams').once('value').then(function (snapshot) {
                    var firstName = snapshot.child("barca/teamphoto").val(); // "Ada"
                    //alert(firstName);
                    var members = 0;

                    snapshot.forEach(function (childSnapshot) {

                        var Items = {

                            "key": childSnapshot.val(),
                            "teamname": childSnapshot.child("teamname").val(),
                            'teamphoto': childSnapshot.child("teamphoto").val(),
                            'datecreated': datecreated
                            //'members': childSnapshot.child("players").numChildren()

                        };

                        TempItems.push(Items)
                    });
                });

                return TempItems;
            },

            AddNewTeam: function (newteam, profile) {
                //alert(user.teamname);
                // Get a key for a new Post.
                var user = firebase.auth().currentUser;
                var id = user.uid;



                var today = new Date();

                var year = today.getFullYear();
                var month = today.getMonth();
                var day = today.getDate();

                var hour = today.getHours();
                var minute = today.getMinutes();


                try {
                    var contact = {
                        //badge:team.badge,
                        available: true,
                        rating: 1500,
                        status: '1',
                        teamadmin: id,
                        teamadminphoto: profile.photo,
                        teamname: newteam.teamname,
                        yellowcard: 0,
                        pteamsize: newteam.pteamsize,
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
                        favstadium: newteam.favstadium,
                        favstadiumphoto: newteam.photo,
                        homejersey: newteam.homejersey,
                        awayjersey: newteam.awayjersey,
                        badge: newteam.badge,
                        rank: 0,
                        numberofgames: 0,
                        wins: 0,
                        winstreak: 0,

                        teamoffive: newteam.five,
                        teamofsix: newteam.six,
                        teamofseven: newteam.seven,
                        teamofeight: newteam.eight,
                        teamofnine: newteam.nine,
                        teamoften: newteam.ten,
                        teamofeleven: newteam.eleven,

                        dateyear: year,
                        datemonth: month,
                        dateday: day,

                        datehour: hour,
                        dateminute: minute,
                        players: {
                            firstone: true,
                        },
                        captain: {
                            firstone: true,
                        },
                        timestamp: firebase.database.ServerValue.TIMESTAMP,

                        comments: "",

                        favlatitude: newteam.favlatitude,
                        favlongitude: newteam.favlongitude,
                        reviewrating: 5,
                        

                    };

                    contact.players[id] = {
                        name: profile.displayname,
                        firstname: profile.firstname,
                        lastname: profile.lastname,
                        isadmin: true
                    };

                    contact.captain[id] =
                        {
                            name: profile.displayname,
                            firstname: profile.firstname,
                            lastname: profile.lastname,
                            isadmin: true
                        };


                    var playerside = {
                        //badge:team.badge,
                        available: true,
                        teamname: newteam.teamname,
                        badge: newteam.badge,
                        rank: 0,
                        rating: 1500,

                        dateyear: year,
                        datemonth: month,
                        dateday: day,

                        datehour: hour,
                        dateminute: minute,

                        favstadium: newteam.favstadium,
                        favstadiumphoto: newteam.photo,
                        homejersey: newteam.homejersey,
                        awayjersey: newteam.awayjersey,

                        players: {
                            firstone: true,
                        },
                        teamadmin: id

                    };

                    playerside.players[id] =
                        {
                            name: profile.displayname,
                            firstname: profile.firstname,
                            lastname: profile.lastname,
                            isadmin: "True",
                            teamadminphoto: profile.photo,
                        };




                    var newPostKey = firebase.database().ref().child('teams').push().key;
                    var teamstats = {
                        rank: 1500,
                        rating: 0,
                        numberofgames: 0,
                        wins: 0,
                        badge: newteam.badge,
                        name: newteam.teamname,
                        players: {}
                    }
                    teamstats.players[id] = {
                        id: id
                    };

                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {


                        updates['/teams/' + newPostKey] = contact;


                        updates['/players/' + id + '/teams/' + newPostKey] = playerside;


                        updates['/teampoints/' + newPostKey] = teamstats;

                        updates['/teaminfo/' + newPostKey] = contact;

                        updates['/teamnames/' + contact.teamname] = id;



                    }
                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(JSON.stringify(error));
                }


            },

            GetTeamByKey: function (key, callback) {
                try {


                    firebase.database().ref('/teams/' + key).on('value', function (snapshot) {
                        TeamProfile = {};
                        var upcomingmatches = [];
                        if (snapshot.exists()) {

                            var players = [];
                            var admins = [];

                            var amiadmin = false;
                            var user = firebase.auth().currentUser;
                            var id = user.uid;

                            if (id == snapshot.child("teamadmin").val()) {
                                amiadmin = true;
                            }

                            //get all the captains with ID and Name
                            if (snapshot.child("captain").exists()) {
                                snapshot.child("captain").forEach(function (pl) {

                                    var data = {

                                        key: pl.key,
                                        name: pl.child("name").val(),
                                        firstname: pl.child("firstname").val(),
                                        lastname: pl.child("lastname").val(),

                                    }
                                    admins.push(data);

                                })
                            }

                            //get all the players name with ID and Name
                            if (snapshot.child("players").exists()) {
                                if (snapshot.child("players/" + id).exists()) {
                                    if (snapshot.child("players/" + id + "/isadmin").val()) {
                                        amiadmin = true;
                                    }
                                }
                                snapshot.child("players").forEach(function (pl) {

                                    if (pl.key != "firstone") {
                                        var data = {

                                            key: pl.key,
                                            name: pl.child("name").val(),
                                            firstname: pl.child("firstname").val(),
                                            lastname: pl.child("lastname").val(),
                                            isadmin: pl.child("isadmin").val(),
                                            itsme: pl.key == id,
                                            //for game details
                                            status: 0

                                        }
                                        players.push(data);
                                    }


                                })
                            }

                            var teamcreateddate = new Date();
                            teamcreateddate.setMinutes(snapshot.child("dateminute").val());
                            teamcreateddate.setFullYear(snapshot.child("dateyear").val());
                            teamcreateddate.setMonth(snapshot.child("datemonth").val());
                            teamcreateddate.setHours(snapshot.child("datehour").val());
                            teamcreateddate.setDate(snapshot.child("dateday").val());

                            var numberofmatches = 0;

                            if (snapshot.child("upcominteamgmatches").exists()) {
                                numberofmatches = snapshot.child("upcominteamgmatches").numChildren();
                                snapshot.child("upcominteamgmatches").forEach(function (challenges) {


                                    var matchdate = new Date();


                                    matchdate.setMinutes(challenges.child("minute").val());
                                    matchdate.setFullYear(challenges.child("year").val());
                                    matchdate.setMonth(challenges.child("month").val());
                                    matchdate.setHours(challenges.child("hour").val());
                                    matchdate.setDate(challenges.child("day").val());

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
                                        status: challenges.child("status").val() //0 didnt begin 1 win 2 loss 3 draw
                                        

                                    }
                                    upcomingmatches.push(matchdata);

                                })
                            }
                            var Items = {
                                "key": snapshot.key,
                                "teamname": snapshot.child("teamname").val(),
                                'badge': snapshot.child("badge").val(),
                                'homejersey': snapshot.child("homejersey").val(),
                                'awayjersey': snapshot.child("awayjersey").val(),
                                // 'datecreated': childSnapshot.child("datecreated").val(),

                                "startmonday": snapshot.child("startmonday").val(),
                                "startmondayend": snapshot.child("startmondayend").val(),
                                "starttuesday": snapshot.child("starttuesday").val(),
                                "starttuesdayend": snapshot.child("starttuesdayend").val(),
                                "startwednesday": snapshot.child("startwednesday").val(),
                                "startwednesdayend": snapshot.child("startwednesdayend").val(),
                                "startthursday": snapshot.child("startthursday").val(),
                                "startthursdayend": snapshot.child("startthursdayend").val(),
                                "startfriday": snapshot.child("startfriday").val(),
                                "startfridayend": snapshot.child("startfridayend").val(),
                                "startsaturday": snapshot.child("startsaturday").val(),
                                "startsaturdayend": snapshot.child("startsaturdayend").val(),
                                "startsunday": snapshot.child("startsunday").val(),
                                "startsundayend": snapshot.child("startsundayend").val(),
                                "rating": snapshot.child("rating").val(),
                                "rank": snapshot.child("rank").val(),
                                "amiadmin": amiadmin,
                                "players": players,
                                "captain": admins,
                                "teamadmin": snapshot.child("teamadmin").val(),
                                "accepted": false,
                                "pending": false,
                                "invite": false,

                                "comments": snapshot.child("comments").val(),
                                "datecreated": teamcreateddate,
                                "upcomingmatches": upcomingmatches,
                                "favstadium": snapshot.child("favstadium").val(),
                                "favstadiumphoto": "",
                                "favstadiumname": "",

                                //STATS
                                "numberofmatches": numberofmatches,
                                "wins": 1,
                                "winstreak": 1,


                                "teamoffive": snapshot.child("teamoffive").val(),
                                "teamofsix": snapshot.child("teamofsix").val(),
                                "teamofseven": snapshot.child("teamofseven").val(),
                                "teamofeight": snapshot.child("teamofeight").val(),
                                "teamofnine": snapshot.child("teamofnine").val(),
                                "teamoften": snapshot.child("teamoften").val(),
                                "teamofeleven": snapshot.child("teamofeleven").val(),
                                "teamsizestring": "",

                                "available": snapshot.child("available").val(),
                                "availablepng": snapshot.child("available").val() ? "available" : "busy"

                            };
                            switch (Items.rank) {
                                case 1:
                                    Items.rankdescription = Items.rank + 'st';
                                    break;
                                case 2:
                                    Items.rankdescription = Items.rank + 'nd';
                                    break;
                                case 3:
                                    Items.rankdescription = Items.rank + 'rd';
                                    break;

                                default:
                                    Items.rankdescription = Items.rank + 'th';
                                    break;
                            }

                            TeamProfile = Items;

                        }
                        callback(TeamProfile);


                    });
                }
                catch (error) {
                    alert(error.message);
                }
            },
            GetTeamInfoByKey: function (key, callback) {
                try {


                    firebase.database().ref('/teaminfo/' + key).on('value', function (snapshot) {
                        TeamProfileInfo = {};

                        if (snapshot.exists()) {


                            var user = firebase.auth().currentUser;
                            var id = user.uid;


                            var Items = {
                                "key": snapshot.key,
                                "teamname": snapshot.child("teamname").val(),
                                'badge': snapshot.child("badge").val(),
                                'homejersey': snapshot.child("homejersey").val(),
                                'awayjersey': snapshot.child("awayjersey").val(),
                                "rating": snapshot.child("rating").val(),
                                "rank": snapshot.child("rank").val(),
                                "teamoffive": snapshot.child("teamoffive").val(),
                                "teamofsix": snapshot.child("teamofsix").val(),
                                "teamofseven": snapshot.child("teamofseven").val(),
                                "teamofeight": snapshot.child("teamofeight").val(),
                                "teamofnine": snapshot.child("teamofnine").val(),
                                "teamoften": snapshot.child("teamoften").val(),
                                "teamofeleven": snapshot.child("teamofeleven").val()

                            };
                            switch (Items.rank) {
                                case 1:
                                    Items.rankdescription = Items.rank + 'st';
                                    break;
                                case 2:
                                    Items.rankdescription = Items.rank + 'nd';
                                    break;
                                case 3:
                                    Items.rankdescription = Items.rank + 'rd';
                                    break;

                                default:
                                    Items.rankdescription = Items.rank + 'th';
                                    break;
                            }
                            TeamProfileInfo = Items;

                        }
                        callback(TeamProfileInfo);


                    });
                }
                catch (error) {
                    alert(error.message);
                }
            },

            GetPlayersByTeam: function (key, callback) {
                try {


                    firebase.database().ref('/teams/' + key + '/players').once('value').then(function (snapshot) {
                        var players = [];
                        if (snapshot.exists()) {

                            var players = [];

                            var user = firebase.auth().currentUser;
                            var id = user.uid;

                            //get all the players name with ID and Name
                            snapshot.forEach(function (pl) {

                                if (pl.key != "firstone") {
                                    var data = {

                                        key: pl.key,
                                        name: pl.child("name").val(),
                                        isadmin: pl.child("isadmin").val(),
                                        itsme: pl.key == id
                                    }
                                    players.push(data);
                                }


                            })

                        }
                        alert(JSON.stringify(players));
                        callback(players);


                    });
                }
                catch (error) {
                    alert(error.message);
                }
            },

            DeleteTeamByKey: function (team) {

                try {

                    var members = team.players;



                    var updates = {};
                    updates['/teams/' + team.key] = null;
                    updates['/teampoints/' + team.key] = null;
                    updates['/teaminfo/' + team.key] = null;

                    for (var i = 0; i < members.length; i++) {
                        updates['/players/' + members[i].key + '/teams/' + team.key] = null;
                    }
                    updates['/teamnames/' + team.teamname] = null;



                    // updates['/players/' + id + '/teams/' + newPostKey] = contact;
                    // updates['/teampoints/' + newPostKey] = teamstats;

                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }



                return TempItems;
            },

            UpdateTeamByKey: function (profile) {
                try {
                    var updates = {};
                    var id = profile.key;

                    //updates['teams/' + id + '/enableinvitations'] = profile.enableinvitations;
                    updates['teams/' + id + '/startmonday'] = profile.startmonday;
                    updates['teams/' + id + '/startmondayend'] = profile.startmondayend;
                    updates['teams/' + id + '/starttuesday'] = profile.starttuesday;
                    updates['teams/' + id + '/starttuesdayend'] = profile.starttuesdayend;
                    updates['teams/' + id + '/startwednesday'] = profile.startwednesday;
                    updates['teams/' + id + '/startwednesdayend'] = profile.startwednesdayend;
                    updates['teams/' + id + '/startthursday'] = profile.startthursday;
                    updates['teams/' + id + '/startthursdayend'] = profile.startthursdayend;
                    updates['teams/' + id + '/startfriday'] = profile.startfriday;
                    updates['teams/' + id + '/startfridayend'] = profile.startfridayend;
                    updates['teams/' + id + '/startsaturday'] = profile.startsaturday;
                    updates['teams/' + id + '/startsaturdayend'] = profile.startsaturdayend;
                    updates['teams/' + id + '/startsunday'] = profile.startsunday;
                    updates['teams/' + id + '/startsundayend'] = profile.startsundayend;
                    updates['teams/' + id + '/comments'] = profile.comments;
                    updates['teams/' + id + '/favstadium'] = profile.favstadium;
                    updates['teams/' + id + '/favstadiumphoto'] = profile.favstadiumphoto;
                    updates['teams/' + id + '/available'] = profile.available;

                    updates['teams/' + id + '/favlatitude'] = profile.favlatitude;
                    updates['teams/' + id + '/favlongitude'] = profile.favlongitude;




                    updates['teaminfo/' + id + '/startmonday'] = profile.startmonday;
                    updates['teaminfo/' + id + '/startmondayend'] = profile.startmondayend;
                    updates['teaminfo/' + id + '/starttuesday'] = profile.starttuesday;
                    updates['teaminfo/' + id + '/starttuesdayend'] = profile.starttuesdayend;
                    updates['teaminfo/' + id + '/startwednesday'] = profile.startwednesday;
                    updates['teaminfo/' + id + '/startwednesdayend'] = profile.startwednesdayend;
                    updates['teaminfo/' + id + '/startthursday'] = profile.startthursday;
                    updates['teaminfo/' + id + '/startthursdayend'] = profile.startthursdayend;
                    updates['teaminfo/' + id + '/startfriday'] = profile.startfriday;
                    updates['teaminfo/' + id + '/startfridayend'] = profile.startfridayend;
                    updates['teaminfo/' + id + '/startsaturday'] = profile.startsaturday;
                    updates['teaminfo/' + id + '/startsaturdayend'] = profile.startsaturdayend;
                    updates['teaminfo/' + id + '/startsunday'] = profile.startsunday;
                    updates['teaminfo/' + id + '/startsundayend'] = profile.startsundayend;
                    updates['teaminfo/' + id + '/comments'] = profile.comments;
                    updates['teaminfo/' + id + '/favstadium'] = profile.favstadium;
                    updates['teaminfo/' + id + '/favstadiumphoto'] = profile.favstadiumphoto;
                    updates['teaminfo/' + id + '/available'] = profile.available;

                    updates['teaminfo/' + id + '/favlatitude'] = profile.favlatitude;
                    updates['teaminfo/' + id + '/favlongitude'] = profile.favlongitude;


                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message)
                }

            },

            PromoteDeletePlayers: function (team, player, operation) {


                try {
                    var updates = {};

                    switch (operation) {
                        case 1: //promote
                            updates['/teams/' + team.key + '/players/' + player.key + '/isadmin'] = true;
                            break;
                        case 2: //demote
                            updates['/teams/' + team.key + '/players/' + player.key + '/isadmin'] = false;
                            break;
                        case 3: //remove
                            updates['/teams/' + team.key + '/players/' + player.key] = null;
                            updates['/teams/' + team.key + '/admins/' + player.key] = null;
                            updates['/players/' + player.key + '/teams/' + team.key] = null;
                            break;
                        case 4: //add
                            updates['/teams/' + team.key + '/players/' + player.key] = player;
                            break;

                        default:
                            break;
                    }

                    return firebase.database().ref().update(updates);

                } catch (error) {
                    alert(error.message);
                }

            },

            LeaveTeam: function (team) {

                var user = firebase.auth().currentUser;
                var id = user.uid;

                if (id !== null || id == '' || id === undefined) {
                    try {
                        var updates = {};

                        updates['/teams/' + team.key + '/players/' + id] = null;
                        updates['/teams/' + team.key + '/captain/' + id] = null;
                        updates['/players/' + id + '/teams/' + team.key] = null;

                        return firebase.database().ref().update(updates);

                    } catch (error) {
                        alert(error.message);
                    }

                }
            },

            InvitePlayerToTeam: function (team, player, admindetails) {

                try {

                    var updates = {};

                    var date = new Date();

                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDate();

                    var hour = date.getHours();
                    var minute = date.getMinutes();

                    var invitedata = {

                        "key": team.key,
                        "teamname": team.teamname,
                        'badge': team.badge,
                        'homejersey': team.homejersey,
                        'awayjersey': team.awayjersey,



                        "year": year,
                        "month": month,
                        "day": day,
                        "hour": hour,
                        "minute": minute,

                        "status": 0,

                        "dateyear": year,
                        "datemonth": month,
                        "dateday": day,

                        "datehour": hour,
                        "dateminute": minute,

                        "adminkey": admindetails.key,
                        "adminfirstname": admindetails.firstname,
                        "adminlastname": admindetails.lastname,
                        "adminphoto": admindetails.photo,
                        "admintelephone": admindetails.telephone


                    };


                    updates['/players/' + player.key + '/teaminvitations/' + team.key] = invitedata;

                    return firebase.database().ref().update(updates);

                } catch (error) {
                    alert(error.message);
                }

            },

            GetTeamByName: function (teamname, callback) {
                try {

                    firebase.database().ref("/teaminfo").orderByChild("teamname").equalTo(teamname).once('value').then(function (snapshot) {
                        var exists = false;

                        if (snapshot.exists()) {
                            exists = true;
                        }

                        callback(exists);


                    });
                }
                catch (error) {
                    alert(error.message);
                }
            }


        }

    })
