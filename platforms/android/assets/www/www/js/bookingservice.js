angular.module('football.controllers')

    .factory('BookingStore', function () {
        var Temp = [];

        return {
            GetMyUpcomingBookings: function (callback) {

                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    if (id !== null || id == '' || id === undefined) {

                        firebase.database().ref('/players/' + id + '/upcomingmatches').on('value', function (snapshot) {
                            Temp = [];
                            snapshot.forEach(function (childSnapshot) {

                                var gameedate = new Date();

                                gameedate.setMinutes(childSnapshot.child("minute").val());
                                gameedate.setFullYear(childSnapshot.child("year").val());
                                gameedate.setMonth(childSnapshot.child("month").val());
                                gameedate.setHours(childSnapshot.child("hour").val());
                                gameedate.setDate(childSnapshot.child("day").val());

                                var mybookings = {
                                    "key": childSnapshot.key,
                                    "stadiumkey": childSnapshot.child("stadiumkey").val(),
                                    "ministadiumkey": childSnapshot.child("ministadiumkey").val(),
                                    "day": childSnapshot.child("day").val(),
                                    "month": childSnapshot.child("month").val(),
                                    "year": childSnapshot.child("year").val(),
                                    "minute": childSnapshot.child("minute").val(),
                                    "hour": childSnapshot.child("hour").val(),
                                    "price": childSnapshot.child("price").val(),
                                    "photo": childSnapshot.child("photo").val(),
                                    "stadiumdescription": childSnapshot.child("stadiumdescription").val(),
                                    "date": gameedate,
                                    "duration": childSnapshot.child("stadiumdescription").val(),
                                    "phone": childSnapshot.child("duration").val(),
                                    "telephone": childSnapshot.child("telephone").val(),
                                    "reservationnumber": childSnapshot.child("reservationnumber").val()

                                };

                                Temp.push(mybookings)
                            });
                            callback(Temp);
                        });
                    }
                    else {
                        callback(Temp);
                    }

                }
                catch (error) {
                    alert(error.message);
                }
            },

            GetMyPastBookins: function (user) {
                Temp = [];
                firebase.database().ref('/players/' + user.usercode + '/upcomingmatches').on('value', function (snapshot) {
                    var currentdate = new Date();

                    snapshot.forEach(function (childSnapshot) {
                        var mybookings = {
                            "key": childSnapshot.key,
                            "stadiumkey": childSnapshot.child("stadium").val(),
                            "ministadiumkey": childSnapshot.child("ministadium").val(),
                            "teamname": childSnapshot.child("teamname").val(),
                            "day": childSnapshot.child("day"),
                            "month": childSnapshot.child("month"),
                            "year": childSnapshot.child("year"),
                            "hour": childSnapshot.child("hour"),
                            "minute": childSnapshot.child("minute"),
                            "time": childSnapshot.child("starthour"),
                            "price": childSnapshot.child("price")
                        };
                        var bookingdate = new Date(mybookings.year, mybookings.month, mybookings.day, mybookings.hour, mybookings.minute)

                        if (bookingdate < currentdate) {
                            Temp.push()
                        }

                    });
                });

                return Temp;
            },

            GetMyAllBookings: function (key) {
                Temp = [];
                firebase.database().ref('/players/' + user.usercode + '/upcomingmatches').on('value', function (snapshot) {

                    snapshot.forEach(function (childSnapshot) {
                        var mybookings = {
                            "key": childSnapshot.key,
                            "stadiumkey": childSnapshot.child("stadium").val(),
                            "ministadiumkey": childSnapshot.child("ministadium").val(),
                            "teamname": childSnapshot.child("teamname").val(),
                            "day": childSnapshot.child("day"),
                            "month": childSnapshot.child("month"),
                            "year": childSnapshot.child("year"),
                            "time": childSnapshot.child("starthour"),
                            "price": childSnapshot.child("price")
                        };

                        Temp.push(mybookings)
                    });
                });

                return Temp;
            },

            DeleteMyBookings: function (user, keys) {
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

            GetBookingbyID: function (filter, callback) {

                firebase.database().ref(
                    '/stadiums/' + filter.stadiumkey
                    + '/ministadiums/' + filter.ministadiumkey
                    + '/schedules/' + filter.year + '/' + filter.month + '/' + filter.day + '/' + filter.key)
                    .once('value')
                    .then(function (snapshot) {
                        var booking = snapshot.val();
                        booking.stadiumkey = filter.stadiumkey;
                        booking.ministadiumkey = filter.ministadiumkey;
                        booking.key = filter.key;
                        callback(booking);
                    })
            },

            DeleteBookingByID: function (booking) {
                console.log(booking);
                var updates = {};

                var user = firebase.auth().currentUser;

                var id = user.uid;

                updates['/stadiums/' + booking.stadiumkey
                    + '/ministadiums/' + booking.ministadiumkey
                    + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + booking.key] = null;

                updates['/stadiumshistory/' + booking.stadiumkey
                    + '/ministadiums/' + booking.ministadiumkey
                    + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + booking.key] = null;

                booking.references.forEach(function (element) {

                    updates['/stadiums/' + booking.stadiumkey
                        + '/ministadiums/' + booking.ministadiumkey
                        + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + element.key] = null;

                    updates['/stadiumshistory/' + booking.stadiumkey
                        + '/ministadiums/' + booking.ministadiumkey
                        + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + element.key] = null;

                }, this);

                updates['/players/' + booking.stadiumkey
                    + '/ministadiums/' + booking.ministadiumkey
                    + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + booking.key] = null;

                updates['/players/' + id + '/upcomingmatches/' + booking.key] = null;

                return firebase.database().ref().update(updates);
            }

        }

    })

