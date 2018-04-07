
angular.module('football.controllers')

    .factory('SearchStore', function () {
        var TempItems = [];
        var AllPlayers = [];
        var AvailablePlayers = [];
        return {

            SearchAvailablePlayers: function (searchinfo, callback) {
                AvailablePlayers = [];

                var year = searchinfo.date.getFullYear();
                var month = searchinfo.date.getMonth();
                var day = searchinfo.date.getDate();

                var hour = searchinfo.date.getHours();
                var minute = searchinfo.date.getMinutes();

                var weekday = searchinfo.date.getDay();

                var startat = "";
                var startend = "";

                var user = firebase.auth().currentUser;
                var id = user.uid;

                switch (weekday) {
                    case 0:
                        startat = "startsunday";
                        startend = "startsundayend";
                        break;
                    case 1:
                        startat = "startmonday";
                        startend = "startmondayend";
                        break;
                    case 2:
                        startat = "starttuesday";
                        startend = "starttuesdayend";
                        break;
                    case 3:
                        startat = "startwednesday";
                        startend = "startwednesdayend";
                        break;
                    case 4:
                        startat = "startthursday";
                        startend = "startthursdayend";
                        break;
                    case 5:
                        startat = "startfriday";
                        startend = "startfridayend";
                        break;
                    case 6:
                        startat = "startsaturday";
                        startend = "startsaturdayend";
                        break;


                    default:
                        startat = "startmonday";
                        startend = "startmondayend";

                }



                firebase.database().ref('/players').orderByChild(startend).startAt(hour).on('value', function (snapshot) {
                    AvailablePlayers = [];

                    snapshot.forEach(function (childSnapshot) {


                        if (childSnapshot.key != firebase.auth().currentUser.uid) {


                            var status = 0;
                            var statusdesc = "Request Number";
                            var color = "#2ab042";
                            var backcolor = "white";



                            if (childSnapshot.child("available").val()) {

                                if (childSnapshot.child(startat).exists()) {
                                    if (childSnapshot.child(startat).val() <= hour && childSnapshot.child("enableinvitations").val()) {

                                        if (childSnapshot.child("myrequests/" + id).exists()) {

                                            switch (childSnapshot.child("myrequests/" + id + "/requeststatus").val()) {
                                                case 0:
                                                    statusdesc = "Number Requested";
                                                    break;
                                                case 1:
                                                    statusdesc = "Friend";
                                                    break;
                                                case 2:
                                                    statusdesc = "Number Requested";
                                                    break;

                                                default:
                                                    break;
                                            }
                                            status = 1;

                                            color = "white";
                                            backcolor = "#2ab042";
                                        }

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
                                            "devicetoken": childSnapshot.child("devicetoken").val(),
                                            "enableinvitations": childSnapshot.child("enableinvitations").val(),
                                            "favouritesport": childSnapshot.child("favouritesport").val(),
                                            "firstname": childSnapshot.child("firstname").val(),
                                            "highestrating": childSnapshot.child("highestrating").val(),
                                            "lastname": childSnapshot.child("lastname").val(),
                                            "playposition": childSnapshot.child("isplayer").val() ? "Player" : "Goalkeeper",
                                            "ranking": childSnapshot.child("ranking").val(),
                                            "status": childSnapshot.child("status").val(),
                                            "teams": childSnapshot.child("teams").val(),
                                            "telephone": childSnapshot.child("telephone").val(),
                                            "winstreak": childSnapshot.child("winstreak").val(),
                                            "favstadium": childSnapshot.child("favstadium").val(),
                                            "favstadiumphoto": childSnapshot.child("favstadiumphoto").val(),
                                            "age": num,
                                            "nummatches": childSnapshot.child("nummatches").val(),
                                            "status": status,
                                            "color": color,
                                            "backcolor": backcolor,
                                            "statusdesc": statusdesc,

                                            "skilllevel": childSnapshot.child("skilllevel").val(),
                                            "comments": childSnapshot.child("comments").val(),
                                            "photo": childSnapshot.child("photoURL").val() == "" ? "img/PlayerProfile.png" : childSnapshot.child("photoURL").val(),

                                            "teamdisplayedkey": childSnapshot.child("teamdisplayedkey").val(),
                                            "teambadge": "",
                                            "favlatitude": childSnapshot.child("favlatitude").val(),
                                            "favlongitude": childSnapshot.child("favlongitude").val()


                                        };

                                        Items.lastseen =
                                            {
                                                year: 0,
                                                month: 0,
                                                day: 0,
                                                hour: 0,
                                                minute: 0
                                            };

                                        if (childSnapshot.child("lastseen").exists()) {
                                            Items.lastseen.year = childSnapshot.val().lastseen.loginyear;
                                            Items.lastseen.month = childSnapshot.val().lastseen.loginmonth;
                                            Items.lastseen.day = childSnapshot.val().lastseen.loginday;
                                            Items.lastseen.hour = childSnapshot.val().lastseen.loginhour;
                                            Items.lastseen.minute = childSnapshot.val().lastseen.loginminute;

                                            Items.lastseen.date = new Date();
                                            Items.lastseen.date.setMinutes(childSnapshot.val().lastseen.loginminute);
                                            Items.lastseen.date.setFullYear(childSnapshot.val().lastseen.loginyear);
                                            Items.lastseen.date.setMonth(childSnapshot.val().lastseen.loginmonth);
                                            Items.lastseen.date.setHours(childSnapshot.val().lastseen.loginhour);
                                            Items.lastseen.date.setDate(childSnapshot.val().lastseen.loginday);

                                            var difference = (new Date() - Items.lastseen.date) / 1000 / 60;
                                            Items.seendifference = difference;

                                            if (difference < 20) {
                                                Items.lastseen.text = "Online";
                                            }
                                            else
                                                if (difference <= 60) {
                                                    Items.lastseen.text = Math.floor(difference) + " mins. ago";
                                                }
                                                else
                                                    if (difference <= 24 * 60) {
                                                        Items.lastseen.text = Math.floor(difference / 60) + " hrs. ago";
                                                    }
                                                    else
                                                        if (difference >= 24 * 60 && difference <= 48 * 60) {
                                                            Items.lastseen.text = "Yesterday";
                                                        }
                                                        else {
                                                            Items.lastseen.text = (Math.floor((difference / 60 / 24))) + " days ago";
                                                        }
                                        }



                                        AvailablePlayers.push(Items)
                                    }
                                }
                            }
                        }
                    });
                    //  alert(JSON.stringify(AvailablePlayers));
                    callback(AvailablePlayers);
                });
            },
            SearchAllPlayers: function (description) {
                TempItems = [];


                firebase.database().ref('/playersinfo').on('value', function (snapshot) {

                    snapshot.forEach(function (childSnapshot) {


                        if (childSnapshot.child("available").val()) {


                            var childdescription = childSnapshot.child("userdescription");

                            if (childdescription.trim().toString().includes(description.trim())) {

                                var Items = {
                                    "key": childSnapshot.val(),
                                    "availabledays": childSnapshot.child("availabledays").val(),
                                    "displayname": childSnapshot.child("displayname").val(),
                                    "enableinvitations": childSnapshot.child("enableinvitations").val(),
                                    "favouritesport": childSnapshot.child("favouritesport").val(),
                                    "firstname": childSnapshot.child("firstname").val(),
                                    "highestrating": childSnapshot.child("highestrating").val(),
                                    "lastname": childSnapshot.child("lastname").val(),
                                    "middlename": childSnapshot.child("middlename").val(),
                                    "playposition": childSnapshot.child("playposition").val(),
                                    "ranking": childSnapshot.child("ranking").val(),
                                    "status": childSnapshot.child("status").val(),
                                    "teams": childSnapshot.child("teams").val(),
                                    "telephone": childSnapshot.child("telephone").val(),
                                    "userdescription": childSnapshot.child("userdescription").val(),
                                    "winstreak": childSnapshot.child("winstreak").val(),
                                    "photo": childSnapshot.child("photoURL").val() == "" ? "img/PlayerProfile.png" : childSnapshot.child("photoURL").val(),

                                };

                                TempItems.push(Items);
                            }
                        }
                    });
                });

                return TempItems;
            },



            SearchStadiums: function (description) {
                TempItems = [];


                firebase.database().ref('/stadiumsinfo').on('value', function (snapshot) {

                    snapshot.forEach(function (childSnapshot) {

                        var childdescription = childSnapshot.child("name");

                        if (childdescription.trim().toString().includes(description.trim())) {

                            var Items = {
                                "key": childSnapshot.val(),
                                "description": childSnapshot.child("description").val(),
                                "indoor": childSnapshot.child("indoor").val(),
                                "locationarea": childSnapshot.child("locationarea").val(),
                                "locationcity": childSnapshot.child("locationcity").val(),
                                "locationtelephone": childSnapshot.child("locationtelephone").val(),
                                "name": childSnapshot.child("name").val(),
                                "outdoor": childSnapshot.child("outdoor").val(),
                                "photo": childSnapshot.child("photo").val(),
                                "rating": childSnapshot.child("rating").val(),
                                "water": childSnapshot.child("water").val()


                            };

                            TempItems.push(Items);
                        }
                    });
                });

                return TempItems;
            },
            SearchTeams: function (description) {
                TempItems = [];


                firebase.database().ref('/teamsinfo').on('value', function (snapshot) {

                    snapshot.forEach(function (childSnapshot) {

                        var childdescription = childSnapshot.child("teamname");

                        if (childdescription.trim().toString().includes(description.trim())) {

                            var Items = {
                                "key": childSnapshot.val(),
                                "description": childSnapshot.child("description").val(),
                                "indoor": childSnapshot.child("indoor").val(),
                                "locationarea": childSnapshot.child("locationarea").val(),
                                "locationcity": childSnapshot.child("locationcity").val(),
                                "locationtelephone": childSnapshot.child("locationtelephone").val(),
                                "name": childSnapshot.child("name").val(),
                                "outdoor": childSnapshot.child("outdoor").val(),
                                "photo": childSnapshot.child("photo").val(),
                                "rating": childSnapshot.child("rating").val(),
                                "water": childSnapshot.child("water").val()


                            };

                            TempItems.push(Items);
                        }
                    });
                });

                return TempItems;
            },
            RequestNumber: function (myprofile, player) {
                //alert(user.teamname);
                // Get a key for a new Post.
                var user = firebase.auth().currentUser;


                if (!(user === null || user == '' || user === undefined)) {
                    var id = user.uid;
                    if (!(id === null || id == '' || id === undefined)) {
                        try {
                            var requestdata = {
                                //badge:team.badge,
                                requesteduid: id,
                                requeststatus: 0,
                                requestorkey: myprofile.key,
                                firstname: myprofile.firstname,
                                lastname: myprofile.lastname,
                                requestorphoto: myprofile.photo,
                                requestortelephone: myprofile.telephone,

                            };

                            var requesttome = {
                                //badge:team.badge,
                                requeststatus: 0,
                                requestorkey: player.key,
                                firstname: player.firstname,
                                lastname: player.lastname,
                                photo:player.photo
                            };

                            var updates = {};
                            updates['/players/' + player.key + '/myrequests/' + id] = requestdata;

                            updates['/players/' + myprofile.key + '/previousrequests/' + player.key] = requesttome;

                            return firebase.database().ref().update(updates);
                        }

                        catch (error) {
                            alert(error.message);
                        }
                    }
                }
                else {
                    alert("Something wrong happened");
                }


            },
            GetMyProfileInfo: function (callback) {


                var user = firebase.auth().currentUser;
                var id = user.uid;

                try {


                    firebase.database().ref('/players/' + id).once('value').then(function (snapshot) {

                        TempItems = {};


                        var Items = {
                            "key": snapshot.key,
                            "displayname": snapshot.child("displayname").val(),
                            "enableinvitations": snapshot.child("enableinvitations").val(),
                            "firstname": snapshot.child("firstname").val(),
                            "lastname": snapshot.child("lastname").val(),
                            "middlename": snapshot.child("middlename").val(),
                            "playposition": snapshot.child("playposition").val(),
                            "ranking": snapshot.child("ranking").val(),
                            "status": snapshot.child("status").val(),
                            "telephone": snapshot.child("telephone").val(),
                            "photo": snapshot.child("photoURL").val(),
                            "favstadium": snapshot.child("favstadium").val()

                        };

                        TempItems = Items;
                        callback(TempItems);
                    });


                }
                catch (error) {
                    alert(error.message);
                }
            },
            

            //elasticSearch
            SearchElastic: function(category, term, callback)
            {
                var searchResult = [];
                var database = firebase.database();
                
                // skeleton of the JSON object we will write to DB
                var query = {
                    index: "firebase",
                    type: category
                };
                var f = {
                    filter_path: "hits.hits._source"
                }
                query.q = "*"+term+"*";
                query.filter_path = "hits.total,hits.hits._source, hits.hits._id";

                

                var ref = database.ref().child("search");
                var key = ref.child('request').push(query).key;

                //console.log('search', key, query);
                //$('#query').text(JSON.stringify(query, null, 2));
                ref.child('response/' + key).on('value',function (snap)
                {
                    if (!snap.exists()) { return; }

                    if (snap.val() != null) {
                        var dat = snap.val().hits.hits;
                        if(dat!=null)
                            dat.forEach(function (item, index) {
                                item._source.itemKey = item._id;
                            searchResult.push(item._source);
                        });
                        // when a value arrives from the database, stop listening
                        // and remove the temporary data from the database
                        //snap.ref.off('value', showResults);
                         snap.ref.remove();

                         callback(searchResult);
                    }
                })
            },
            SearchAllByField: function (table, fieldName, fieldValue, callback) {
                var searchResult = [];
                //var yarraw = firebase.database().ref('/players');//.orderByChild(fieldName).startAt(fieldValue);
                firebase.database().ref(table).orderByChild(fieldName).startAt(fieldValue).endAt(fieldValue).once('value').then(function (snapshot) {
                    //firebase.database().ref('players').once('value').then(function (snapshot) {

                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val() != null) {
                            var sr = childSnapshot.val();
                            sr.key = childSnapshot.getKey();
                            searchResult.push(sr);
                        }
                        //console.log(JSON.stringify(childSnapshot.val(),null,2));
                    });
                    callback(searchResult);
                });


            }

        }

    })
