angular.module('football.controllers', [])


    .factory('LoginStore', function () {
        var TempItems = [];

        return {

            AddUser: function (newuser, registerdata) {
                try {
                    alert("test");
                    if (newuser != null) {
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
                                startmonday: 0,
                                startmondayend: 0,
                                starttuesday: 0,
                                starttuesdayend: 0,
                                startwednesday: 0,
                                startwednesdayend: 0,
                                startthursday: 0,
                                startthursdayend: 0,
                                startfriday: 0,
                                startfridayend: 0,
                                startsaturday: 0,
                                startsaturdayend: 0,
                                startsunday: 0,
                                startsundayend: 0,
                                favstadium: "",
                                favstadiumphoto: "",

                                agestatus: false,
                                ageyear: "",
                                agemonth: "",
                                ageday: ""

                            }
                        //alert(newPostKey);
                        // Write the new post's data simultaneously in the posts list and the user's post list.
                        var updates = {};
                        updates['/players/' + usertoadd.uid + '/'] = usertoadd;


                        return firebase.database().ref().update(updates);

                    }
                }
                catch (error) {
                    alert(error.message);
                }

            },
            GetUser: function (callback) {

                var exists = false;

                var user = firebase.auth().currentUser;

                var id = user.uid;
                alert(id);

                try {
                    var query = firebase.database().ref('users/' + id);
                    query.once("value").then(function (snapshot) {

                        if (snapshot.exists()) {
                            exists = true;
                        }
                        callback(exists);

                    }, function (error) {
                        alert(error.message);
                    });


                }
                catch (error) {
                    alert(error.message);
                }

            }
        }
        })



