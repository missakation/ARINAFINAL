
angular.module('football.controllers')

    .factory('ReservationFact', function ($q) {


        var TempItems = [];
        var Availables = [];
        var StadiumInfo = {};
        var AllStadiums = [];
        return {


            /*FindFreeStadiums: function (search, callback) {

                try {

                    var search2 = new Date();
                    var search3 = new Date();

                    search2.setMinutes(search.date.getMinutes());
                    search2.setFullYear(search.date.getFullYear());
                    search2.setMonth(search.date.getMonth());
                    search2.setHours(search.date.getHours());
                    search2.setDate(search.date.getDate());
                    search2.setSeconds(0);

                    search3.setMinutes(search.date.getMinutes());
                    search3.setFullYear(search.date.getFullYear());
                    search3.setMonth(search.date.getMonth());
                    search3.setHours(search.date.getHours());
                    search3.setDate(search.date.getDate());
                    search3.setSeconds(0);

                    search2.setMinutes(search2.getMinutes() + 30);
                    search3.setMinutes(search3.getMinutes() - 30);

                    var year = search.date.getFullYear();
                    var month = search.date.getMonth();
                    var day = search.date.getDate();

                    var hour1 = search.date.getHours();
                    var minute1 = search.date.getMinutes();

                    var hour2 = search2.getHours();
                    var minute2 = search2.getMinutes();

                    var hour3 = search3.getHours();
                    var minute3 = search3.getMinutes();


                    firebase.database().ref('/stadiums').once('value').then(function (snapshot) {
                        Availables = [];
                        snapshot.forEach(function (mainstadiumSnapshot) {

                            mainstadiumSnapshot.child("ministadiums").forEach(function (stadiumsnapshot) {

                                var OpeningHour = mainstadiumSnapshot.child("OpeningHour").val();
                                var ClosingHour = mainstadiumSnapshot.child("ClosingHour").val();

                                var OpeningMinute = mainstadiumSnapshot.child("OpeningMinute").val();
                                var ClosingMinute = mainstadiumSnapshot.child("ClosingMinute").val();


                                console.log(stadiumsnapshot.key);

                                var available1 = true;
                                var available2 = true;
                                var available3 = true;

                                var starthour = stadiumsnapshot.child("starthour").val();
                                var startminute = stadiumsnapshot.child("startminute").val();

                                var endhour = stadiumsnapshot.child("endhour").val();
                                var endminute = stadiumsnapshot.child("endminute").val();
                                var players = stadiumsnapshot.child("numplayers").val();
                                var players1 = stadiumsnapshot.child("numplayers1").val();



                                //console.log(players);
                                //console.log(search.players);
                                if (stadiumsnapshot.child('schedules/' + year + '/' + month + '/' + day).exists()) {
                                    var freetimes = [];

                                    stadiumsnapshot.child('schedules/' + year + '/' + month + '/' + day).forEach(function (minisnapshot) {

                                        if (minisnapshot.child("maindata").val()) {



                                            var temphour = minisnapshot.child("hour").val();
                                            var tempminute = minisnapshot.child("minute").val();


                                            //  if (temphour < starthour || temphour > (endhour - 2) || (Math.abs(temphour - hour) < 1.5)) {

                                            if ((Math.abs((temphour * 60 + tempminute) - (hour1 * 60 + minute1)) < 90)) {
                                                available1 = false;
                                            }

                                            if ((Math.abs((temphour * 60 + tempminute) - (hour2 * 60 + minute2)) < 90)) {
                                                available2 = false;
                                            }

                                            if ((Math.abs((temphour * 60 + tempminute) - (hour3 * 60 + minute3)) < 90)) {
                                                available3 = false;
                                            }


                                        }



                                    });

                                    var startdate = new Date();

                                    startdate.setMinutes(minute1);
                                    startdate.setFullYear(year);
                                    startdate.setMonth(month);
                                    startdate.setHours(hour1);
                                    startdate.setDate(day);

                                }

                                if ((available1 || available2 || available3) && (players == search.players || players1 == search.players)) {

                                    var rating = 0;
                                    var NumberOfChildren = 0;

                                    if (stadiumsnapshot.child("rated").exists()) {

                                        var RateList = stadiumsnapshot.child("rated").val();

                                        for (var k in RateList) {

                                            if (RateList[k].rated == 1) {
                                                rating += RateList[k].rate;
                                                NumberOfChildren += 1;
                                            }
                                        }

                                        if (NumberOfChildren != 0) {
                                            rating = rating / NumberOfChildren;
                                        }
                                    }

                                    console.log(RateList);

                                    var Data = {
                                        "admin": mainstadiumSnapshot.child("admin").val(),
                                        "stadiumkey": mainstadiumSnapshot.key,
                                        "ministadiumkey": stadiumsnapshot.key,
                                        "stadiumname": mainstadiumSnapshot.child("name").val(),
                                        "description": stadiumsnapshot.child("description").val(),

                                        "datetime": [

                                            {
                                                datetime: search3,
                                                available: available3
                                            },
                                            {
                                                datetime: search.date,
                                                available: available1
                                            },
                                            {
                                                datetime: search2,
                                                available: available2
                                            }],

                                        "price": stadiumsnapshot.child("price").val(),
                                        "photo": stadiumsnapshot.child("photo").val(),
                                        "type": stadiumsnapshot.child("type").val(),
                                        "typefloor": stadiumsnapshot.child("typefloor").val(),
                                        "distance": "5",
                                        "year": year,
                                        "month": month,
                                        "day": day,
                                        "players": stadiumsnapshot.child("numplayers").val(),
                                        "hour": hour1,
                                        "minute": minute1,
                                        "selected": "select",
                                        "color": "green",
                                        "backcolor": "white",
                                        "rating": rating,
                                        //"freetimes": freetimes,
                                        "SortPoints": 0,
                                        "latitude": mainstadiumSnapshot.child("cordovalatitude").val(),
                                        "longitude": mainstadiumSnapshot.child("cordovalongitude").val(),
                                        "iscombined": stadiumsnapshot.child("iscombined").val(),
                                        "combined": stadiumsnapshot.child("combined").val(),
                                        "city": mainstadiumSnapshot.child("city").val(),
                                        "telephone": mainstadiumSnapshot.child("telephone").val(),
                                        "devicetoken": mainstadiumSnapshot.child("devicetoken").val()

                                    };

                                    Availables.push(Data);
                                }
                            });

                        });
                        callback(Availables);
                    }, function (error) {
                        alert(error.message);
                    });

                }
                catch (error) {
                    alert(error);
                }


            },*/


            FindFreeStadiums: function (search, callback) {

                try {

                    var search2 = new Date();
                    var search3 = new Date();

                    search2.setMinutes(search.date.getMinutes());
                    search2.setFullYear(search.date.getFullYear());
                    search2.setMonth(search.date.getMonth());
                    search2.setHours(search.date.getHours());
                    search2.setDate(search.date.getDate());
                    search2.setSeconds(0);

                    search3.setMinutes(search.date.getMinutes());
                    search3.setFullYear(search.date.getFullYear());
                    search3.setMonth(search.date.getMonth());
                    search3.setHours(search.date.getHours());
                    search3.setDate(search.date.getDate());
                    search3.setSeconds(0);

                    search2.setMinutes(search2.getMinutes() + 30);
                    search3.setMinutes(search3.getMinutes() - 30);

                    var year = search.date.getFullYear();
                    var month = search.date.getMonth();
                    var day = search.date.getDate();

                    var hour1 = search.date.getHours();
                    var minute1 = search.date.getMinutes();

                    var hour2 = search2.getHours();
                    var minute2 = search2.getMinutes();

                    var hour3 = search3.getHours();
                    var minute3 = search3.getMinutes();


                    firebase.database().ref('/stadiums').once('value').then(function (snapshot) {
                        Availables = [];
                        snapshot.forEach(function (mainstadiumSnapshot) {

                            mainstadiumSnapshot.child("ministadiums").forEach(function (stadiumsnapshot) {

                                var OpeningHour = mainstadiumSnapshot.child("OpeningHour").val();
                                var ClosingHour = mainstadiumSnapshot.child("ClosingHour").val();
                                var OpeningMinute = mainstadiumSnapshot.child("OpeningMinute").val();
                                var ClosingMinute = mainstadiumSnapshot.child("ClosingMinute").val();


                                var RestrictedHour1 = mainstadiumSnapshot.child("RestrictedHour1").val();
                                var RestrictedMinute1 = mainstadiumSnapshot.child("RestrictedMinute1").val();
                                var RestrictedHour2 = mainstadiumSnapshot.child("RestrictedHour2").val();
                                var RestrictedMinute2 = mainstadiumSnapshot.child("RestrictedMinute2").val();


                                var available1 = true;
                                var available2 = true;
                                var available3 = true;

                                var starthour = stadiumsnapshot.child("starthour").val();
                                var startminute = stadiumsnapshot.child("startminute").val();

                                var endhour = stadiumsnapshot.child("endhour").val();
                                var endminute = stadiumsnapshot.child("endminute").val();
                                var players = stadiumsnapshot.child("numplayers").val();
                                var players1 = stadiumsnapshot.child("numplayers1").val();



                                //console.log(players);
                                //console.log(search.players);
                                if (stadiumsnapshot.child('schedules/' + year + '/' + month + '/' + day).exists()) {
                                    var freetimes = [];

                                    stadiumsnapshot.child('schedules/' + year + '/' + month + '/' + day).forEach(function (minisnapshot) {

                                        if (minisnapshot.child("maindata").val()) {



                                            var temphour = minisnapshot.child("hour").val();
                                            var tempminute = minisnapshot.child("minute").val();

                                            //if (temphour < starthour || temphour > (endhour - 2) || (Math.abs(temphour - hour) < 1.5)) {


                                            if ((Math.abs((temphour * 60 + tempminute) - (hour1 * 60 + minute1)) < 90)
                                                || ((hour1 + minute1 / 60 < OpeningHour + OpeningMinute / 60)
                                                    || (ClosingHour + ClosingMinute / 60) - (hour1 + minute1 / 60) < 1.5)
                                                || ((hour1 == RestrictedHour1 && minute1 == RestrictedMinute1) || (minute1 == RestrictedMinute2 && hour1 == RestrictedHour2))) {

                                                available1 = false;

                                            }

                                            if ((Math.abs((temphour * 60 + tempminute) - (hour2 * 60 + minute2)) < 90)
                                                || ((hour2 + minute2 / 60 < OpeningHour + OpeningMinute / 60)
                                                    || (ClosingHour + ClosingMinute / 60) - (hour2 + minute2 / 60) < 1.5)
                                                || ((hour2 == RestrictedHour1 && minute2 == RestrictedMinute1) || (minute2 == RestrictedMinute2 && hour2 == RestrictedHour2))) {
                                                available2 = false;
                                            }

                                            if ((Math.abs((temphour * 60 + tempminute) - (hour3 * 60 + minute3)) < 90)
                                                || ((hour3 + minute3 / 60 < OpeningHour + OpeningMinute / 60) || (ClosingHour + ClosingMinute / 60) - (hour3 + minute3 / 60) < 1.5)
                                                || ((hour3 == RestrictedHour1 && minute3 == RestrictedMinute1) || (minute3 == RestrictedMinute2 && hour3 == RestrictedHour2))) {
                                                available3 = false;
                                            }


                                        }


                                    });

                                    var startdate = new Date();

                                    startdate.setMinutes(minute1);
                                    startdate.setFullYear(year);
                                    startdate.setMonth(month);
                                    startdate.setHours(hour1);
                                    startdate.setDate(day);

                                }

                                if ((hour1 + minute1 / 60 < OpeningHour + OpeningMinute / 60)
                                    || ((ClosingHour + ClosingMinute / 60) - (hour1 + minute1 / 60) < 1.5)
                                    || ((hour1 == RestrictedHour1 && minute1 == RestrictedMinute1) || (minute1 == RestrictedMinute2 && hour1 == RestrictedHour2))) {
                                    available1 = false;
                                }

                                if (((hour2 + minute2 / 60 < OpeningHour + OpeningMinute / 60)
                                    || (ClosingHour + ClosingMinute / 60) - (hour2 + minute2 / 60) < 1.5)
                                    || ((hour2 == RestrictedHour1 && minute2 == RestrictedMinute1) || (minute2 == RestrictedMinute2 && hour2 == RestrictedHour2))) {
                                    available2 = false;
                                }

                                if (((hour3 + minute3 / 60 < OpeningHour + OpeningMinute / 60)
                                    || (ClosingHour + ClosingMinute / 60) - (hour3 + minute3 / 60) < 1.5)
                                    || ((hour3 == RestrictedHour1 && minute3 == RestrictedMinute1) || (minute3 == RestrictedMinute2 && hour3 == RestrictedHour2))) {
                                    available3 = false;
                                }

                                if ((available1 || available2 || available3) && (players == search.players || players1 == search.players)) {

                                    var rating = 0;
                                    var NumberOfChildren = 0;

                                    if (stadiumsnapshot.child("rated").exists()) {

                                        var RateList = stadiumsnapshot.child("rated").val();

                                        for (var k in RateList) {

                                            if (RateList[k].rated == 1) {
                                                rating += RateList[k].rate;
                                                NumberOfChildren += 1;
                                            }
                                        }

                                        if (NumberOfChildren != 0) {
                                            rating = rating / NumberOfChildren;
                                        }
                                    }

                                    console.log(RateList);

                                    var Data = {
                                        "admin": mainstadiumSnapshot.child("admin").val(),
                                        "stadiumkey": mainstadiumSnapshot.key,
                                        "ministadiumkey": stadiumsnapshot.key,
                                        "stadiumname": mainstadiumSnapshot.child("name").val(),
                                        "description": stadiumsnapshot.child("description").val(),

                                        "datetime": [

                                            {
                                                datetime: search3,
                                                available: available3
                                            },
                                            {
                                                datetime: search.date,
                                                available: available1
                                            },
                                            {
                                                datetime: search2,
                                                available: available2
                                            }],

                                        "price": stadiumsnapshot.child("price").val(),
                                        "photo": stadiumsnapshot.child("photo").val(),
                                        "photo1": stadiumsnapshot.child("photo1").val(),
                                        "photo2": stadiumsnapshot.child("photo2").val(),
                                        "photo3": stadiumsnapshot.child("photo3").val(),
                                        "photo4": stadiumsnapshot.child("photo4").val(),
                                        "type": stadiumsnapshot.child("type").val(),
                                        "typefloor": stadiumsnapshot.child("typefloor").val(),
                                        "distance": "5",
                                        "year": year,
                                        "month": month,
                                        "day": day,
                                        "players": stadiumsnapshot.child("numplayers").val(),
                                        "hour": hour1,
                                        "minute": minute1,
                                        "selected": "select",
                                        "color": "green",
                                        "backcolor": "white",
                                        "rating": rating,
                                        "numberofrating": NumberOfChildren,
                                        //"freetimes": freetimes,
                                        "SortPoints": 0,
                                        "latitude": mainstadiumSnapshot.child("cordovalatitude").val(),
                                        "longitude": mainstadiumSnapshot.child("cordovalongitude").val(),
                                        "iscombined": stadiumsnapshot.child("iscombined").val(),
                                        "combined": stadiumsnapshot.child("combined").val(),
                                        "city": mainstadiumSnapshot.child("city").val(),
                                        "telephone": mainstadiumSnapshot.child("telephone").val(),
                                        "devicetoken": mainstadiumSnapshot.child("devicetoken").val(),
                                        "OpeningHour": mainstadiumSnapshot.child("OpeningHour").val(),
                                        "ClosingHour": mainstadiumSnapshot.child("ClosingHour").val(),
                                        "OpeningMinute": mainstadiumSnapshot.child("OpeningMinute").val(),
                                        "ClosingMinute": mainstadiumSnapshot.child("ClosingMinute").val(),
                                        "RestrictedHour1": RestrictedHour1,
                                        "RestrictedMinute1": RestrictedMinute1,
                                        "RestrictedHour2": RestrictedHour2,
                                        "RestrictedMinute2": RestrictedMinute2,
                                        "specialfeatures": mainstadiumSnapshot.child("specialfeatures").val() != null ? mainstadiumSnapshot.child("specialfeatures").val().split("|") : "",
                                        "directions": mainstadiumSnapshot.child("directions").val(),
                                        "cancelationpolicy": mainstadiumSnapshot.child("cancelationpolicy").val(),
                                        "cordovalatitude": mainstadiumSnapshot.child("cordovalatitude").val(),
                                        "cordovalongitude": mainstadiumSnapshot.child("cordovalongitude").val()

                                    };

                                    Availables.push(Data);
                                }
                            });

                        });
                        callback(Availables);
                    }, function (error) {
                        alert(error.message);
                    });

                }
                catch (error) {
                    alert(error);
                }


            },

            RegisterFreeStadiums: function (search, bookeduser, stadiums) {
                //alert("here");
                var year = search.date.getFullYear();
                var month = search.date.getMonth();
                var day = search.date.getDate();

                var hour = search.date.getHours();
                var minute = search.date.getMinutes();


                //add duration

                var endyear = search.date.getFullYear();
                var endmonth = search.date.getMonth();
                var endday = search.date.getDate();

                var endhour = search.date.getHours();
                var endminute = search.date.getMinutes();




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
                    starthour: "",
                    startmin: "",
                    teamone: "",
                    teamonescore: "",
                    teamtwo: "",
                    teamtwoscore: "",
                    usercode: "",
                    percentage: "",
                    duration: 90,
                    type: "B",
                    year: year,
                    total: stadiums.price,
                    bookedadmin: false,
                    maindata: true,
                    name: bookeduser.firstname,
                    starthour: hour,
                    startminute: minute,
                    endhour: endhour,
                    endminute: endminute,
                    references: "",//the main info of the exact beginning time
                    telephone: stadiums.telephone,
                    combined: stadiums.combined,
                    reservationnumber: stadiums.stadiumname.charAt(0) + stadiums.ministadiumkey.charAt(0) + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString()


                };

                var extraslots = {
                    usercode: id,
                    type: "B",
                    maindata: false
                };
                var updates = {};

                var numslots = 90 / 30;

                var mainkey = newkey;
                var references = [];

                var _date = new Date();
                _date.setFullYear(search.date.getFullYear());
                _date.setMonth(search.date.getMonth());
                _date.setDate(search.date.getDate());

                _date.setHours(search.date.getHours());
                _date.setMinutes(search.date.getMinutes());

                for (i = 1; i < numslots; i++) {
                    _date.setMinutes(_date.getMinutes() + 30);

                    newkey = subkey + _date.getFullYear().toString() + _date.getMonth().toString() + _date.getDate().toString() + _date.getHours().toString() + _date.getMinutes().toString();
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

                var accountinfo = {
                    usercode: id,
                    hour: hour,
                    minute: minute,
                    day: day,
                    discount: "0",
                    month: month,
                    nettotal: "",
                    //  price: details.price,
                    starthour: "",
                    startmin: "",
                    year: year,
                    percentage: "0",
                    type: "B",
                    total: 0,
                    bookedadmin: true,
                    fullstartdate: _date,
                };

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
                    teamone: "",
                    teamonescore: 0,
                    teamtwo: "",
                    teamtwoscore: 0,
                    year: year,
                    bookedadmin: false,
                    telephone: stadiums.telephone,
                    combined: stadiums.combined,
                    reservationnumber: stadiums.stadiumname.charAt(0) + stadiums.ministadiumkey.charAt(0) + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString()

                };
                postDataPlayer.references = postData.references;

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

                updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;


                updates['/players/' + id + '/upcomingmatches/' + mainkey] = postDataPlayer;

                updates['/accounting/' + id + '/' + mainkey] = accountinfo;


                var reservedate = new Date();

                var reserveyear = reservedate.getFullYear();
                var reservemonth = reservedate.getMonth();
                var reserveday = reservedate.getDate();

                updates['/players/' + id + '/reserveyears/' + reserveyear + '/' + reservemonth + '/' + reserveday + '/' + mainkey] = true;


                return firebase.database().ref().update(updates);

            },
            GetStadiumsByID: function (id, callback) {
                try {

                    firebase.database().ref('/stadiumsinfo/' + id).on('value', function (snapshot) {
                        StadiumInfo = {};

                        var Data = {
                            "stadiumkey": snapshot.key,
                            "stadiumname": snapshot.child("name").val(),
                            "distance": "5",
                            "cancelationpolicy": snapshot.child("cancelationpolicy").val(),
                            "cordovaaccuracy": snapshot.child("cordovaaccuracy").val(),
                            "cordovaaltitude": snapshot.child("cordovaaltitude").val(),
                            "cordovaaltitudeAccuracy": snapshot.child("cordovaaltitudeAccuracy").val(),
                            "cordovaheading": snapshot.child("cordovaheading").val(),
                            "cordovalatitude": snapshot.child("cordovalatitude").val(),
                            "cordovalongitude": snapshot.child("cordovalongitude").val(),
                            "description": snapshot.child("description").val(),
                            "indoor": snapshot.child("indoor").val(),
                            "locationarea": snapshot.child("locationarea").val(),
                            "locationcity": snapshot.child("locationcity").val(),
                            "locationtelephone": snapshot.child("locationtelephone").val(),
                            "name": snapshot.child("name").val(),
                            "numberofstadium": snapshot.child("numberofstadium").val(),
                            "outdoor": snapshot.child("outdoor").val(),
                            "rating": snapshot.child("rating").val(),
                            "telephone": snapshot.child("telephone").val(),
                            "water": snapshot.child("water").val(),
                            "photo": snapshot.child("photo").val(),
                            "type": snapshot.child("type").val(),
                            "typefloor": snapshot.child("typefloor").val()

                        };
                        StadiumInfo = Data;
                        callback(StadiumInfo);

                    });



                }
                catch (error) {
                    alert(error);
                }
            },
            GetMiniStadiumsByID: function (id, callback) {
                //var q = $q.defer();
                try {
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiumsinfo/' + id).once('value', function (snapshot) {
                        StadiumInfo = {};

                        var Data = {
                            "stadiumkey": snapshot.key,
                            "stadiumname": snapshot.child("name").val(),
                            "distance": "5",
                            "cancelationpolicy": snapshot.child("cancelationpolicy").val(),
                            "cordovaaccuracy": snapshot.child("cordovaaccuracy").val(),
                            "cordovaaltitude": snapshot.child("cordovaaltitude").val(),
                            "cordovaaltitudeAccuracy": snapshot.child("cordovaaltitudeAccuracy").val(),
                            "cordovaheading": snapshot.child("cordovaheading").val(),
                            "cordovalatitude": snapshot.child("cordovalatitude").val(),
                            "cordovalongitude": snapshot.child("cordovalongitude").val(),
                            "description": snapshot.child("description").val(),
                            "email": snapshot.child("email").val(),
                            "indoor": snapshot.child("indoor").val(),
                            "locationarea": snapshot.child("locationarea").val(),
                            "locationcity": snapshot.child("locationcity").val(),
                            "locationtelephone": snapshot.child("locationtelephone").val(),
                            "name": snapshot.child("name").val(),
                            "numberofstadium": snapshot.child("numberofstadium").val(),
                            "outdoor": snapshot.child("outdoor").val(),
                            "rating": snapshot.child("rating").val(),
                            "telephone": snapshot.child("telephone").val(),
                            "water": snapshot.child("water").val()

                        };
                        StadiumInfo = Data;
                        callback(StadiumInfo);

                    });



                }
                catch (error) {
                    alert(error);
                }
            },
            FindFreeStadiumsById: function (search, Stadium, callback) {

                try {

                    var search2 = new Date();
                    var search3 = new Date();

                    search2.setMinutes(search.date.getMinutes());
                    search2.setFullYear(search.date.getFullYear());
                    search2.setMonth(search.date.getMonth());
                    search2.setHours(search.date.getHours());
                    search2.setDate(search.date.getDate());
                    search2.setSeconds(0);

                    search3.setMinutes(search.date.getMinutes());
                    search3.setFullYear(search.date.getFullYear());
                    search3.setMonth(search.date.getMonth());
                    search3.setHours(search.date.getHours());
                    search3.setDate(search.date.getDate());
                    search3.setSeconds(0);

                    search2.setMinutes(search2.getMinutes() + 30);
                    search3.setMinutes(search3.getMinutes() - 30);

                    var year = search.date.getFullYear();
                    var month = search.date.getMonth();
                    var day = search.date.getDate();

                    var hour1 = search.date.getHours();
                    var minute1 = search.date.getMinutes();

                    var hour2 = search2.getHours();
                    var minute2 = search2.getMinutes();

                    var hour3 = search3.getHours();
                    var minute3 = search3.getMinutes();


                    firebase.database().ref('/stadiums/' + Stadium.stadiumkey + '/ministadiums/' + Stadium.ministadiumkey).once('value').then(function (stadiumsnapshot) {
                        Availables = [];

                        var OpeningHour = Stadium.OpeningHour;
                        var ClosingHour = Stadium.ClosingHour;
                        var OpeningMinute = Stadium.OpeningMinute;
                        var ClosingMinute = Stadium.ClosingMinute;

                        var RestrictedHour1 = Stadium.RestrictedHour1;
                        var RestrictedMinute1 = Stadium.RestrictedMinute1;
                        var RestrictedHour2 = Stadium.RestrictedHour2;
                        var RestrictedMinute2 = Stadium.RestrictedMinute2;

                        var available1 = true;
                        var available2 = true;
                        var available3 = true;

                        var starthour = stadiumsnapshot.child("starthour").val();
                        var startminute = stadiumsnapshot.child("startminute").val();

                        var endhour = stadiumsnapshot.child("endhour").val();
                        var endminute = stadiumsnapshot.child("endminute").val();
                        var players = stadiumsnapshot.child("numplayers").val();
                        var players1 = stadiumsnapshot.child("numplayers1").val();



                        //console.log(players);
                        //console.log(search.players);
                        if (stadiumsnapshot.child('schedules/' + year + '/' + month + '/' + day).exists()) {
                            var freetimes = [];

                            stadiumsnapshot.child('schedules/' + year + '/' + month + '/' + day).forEach(function (minisnapshot) {

                                if (minisnapshot.child("maindata").val()) {

                                    var temphour = minisnapshot.child("hour").val();
                                    var tempminute = minisnapshot.child("minute").val();

                                    //  if (temphour < starthour || temphour > (endhour - 2) || (Math.abs(temphour - hour) < 1.5)) {

                                    //if ((temphour + tempminute / 60 >= OpeningHour + OpeningMinute / 60) && (ClosingHour + ClosingMinute / 60) - (temphour + tempminute / 60) > 1.5) {

                                    if ((Math.abs((temphour * 60 + tempminute) - (hour1 * 60 + minute1)) < 90)
                                        || ((hour1 + minute1 / 60 < OpeningHour + OpeningMinute / 60)
                                            || (ClosingHour + ClosingMinute / 60) - (hour1 + minute1 / 60) < 1.5)
                                        || ((hour1 == RestrictedHour1 && minute1 == RestrictedMinute1) || (minute1 == RestrictedMinute2 && hour1 == RestrictedHour2))) {

                                        available1 = false;

                                    }

                                    if ((Math.abs((temphour * 60 + tempminute) - (hour2 * 60 + minute2)) < 90)
                                        || ((hour2 + minute2 / 60 < OpeningHour + OpeningMinute / 60)
                                            || (ClosingHour + ClosingMinute / 60) - (hour2 + minute2 / 60) < 1.5)
                                        || ((hour2 == RestrictedHour1 && minute2 == RestrictedMinute1) || (minute2 == RestrictedMinute2 && hour2 == RestrictedHour2))) {
                                        available2 = false;
                                    }

                                    if ((Math.abs((temphour * 60 + tempminute) - (hour3 * 60 + minute3)) < 90)
                                        || ((hour3 + minute3 / 60 < OpeningHour + OpeningMinute / 60) || (ClosingHour + ClosingMinute / 60) - (hour3 + minute3 / 60) < 1.5)
                                        || ((hour3 == RestrictedHour1 && minute3 == RestrictedMinute1) || (minute3 == RestrictedMinute2 && hour3 == RestrictedHour2))) {
                                        available3 = false;
                                    }

                                    //}

                                }



                            });

                            var startdate = new Date();

                            startdate.setMinutes(minute1);
                            startdate.setFullYear(year);
                            startdate.setMonth(month);
                            startdate.setHours(hour1);
                            startdate.setDate(day);

                        }

                        // if ((available1 || available2 || available3) && (players == search.players || players1 == search.players)) {

                        if ((hour1 + minute1 / 60 < OpeningHour + OpeningMinute / 60)
                            || ((ClosingHour + ClosingMinute / 60) - (hour1 + minute1 / 60) < 1.5)
                            || ((hour1 == RestrictedHour1 && minute1 == RestrictedMinute1) || (minute1 == RestrictedMinute2 && hour1 == RestrictedHour2))) {
                            available1 = false;
                        }

                        if (((hour2 + minute2 / 60 < OpeningHour + OpeningMinute / 60)
                            || (ClosingHour + ClosingMinute / 60) - (hour2 + minute2 / 60) < 1.5)
                            || ((hour2 == RestrictedHour1 && minute2 == RestrictedMinute1) || (minute2 == RestrictedMinute2 && hour2 == RestrictedHour2))) {
                            available2 = false;
                        }

                        if (((hour3 + minute3 / 60 < OpeningHour + OpeningMinute / 60)
                            || (ClosingHour + ClosingMinute / 60) - (hour3 + minute3 / 60) < 1.5)
                            || ((hour3 == RestrictedHour1 && minute3 == RestrictedMinute1) || (minute3 == RestrictedMinute2 && hour3 == RestrictedHour2))) {
                            available3 = false;
                        }

                        var rating = 0;
                        var NumberOfChildren = 0;

                        if (stadiumsnapshot.child("rated").exists()) {

                            var RateList = stadiumsnapshot.child("rated").val();

                            for (var k in RateList) {

                                if (RateList[k].rated == 1) {
                                    rating += RateList[k].rate;
                                    NumberOfChildren += 1;
                                }
                            }

                            if (NumberOfChildren != 0) {
                                rating = rating / NumberOfChildren;
                            }
                        }

                        console.log(RateList);

                        var Data = {
                            "admin": Stadium.admin,
                            "stadiumkey": Stadium.stadiumkey,
                            "ministadiumkey": stadiumsnapshot.key,
                            "stadiumname": Stadium.stadiumname,
                            "description": stadiumsnapshot.child("description").val(),

                            "datetime": [

                                {
                                    datetime: search3,
                                    available: available3
                                },
                                {
                                    datetime: search.date,
                                    available: available1
                                },
                                {
                                    datetime: search2,
                                    available: available2
                                }],

                            "price": stadiumsnapshot.child("price").val(),
                            "photo": stadiumsnapshot.child("photo").val(),
                            "type": stadiumsnapshot.child("type").val(),
                            "typefloor": stadiumsnapshot.child("typefloor").val(),
                            "distance": "5",
                            "year": year,
                            "month": month,
                            "day": day,
                            "players": stadiumsnapshot.child("numplayers").val(),
                            "hour": hour1,
                            "minute": minute1,
                            "selected": "select",
                            "color": "green",
                            "backcolor": "white",
                            "rating": rating,
                            //"freetimes": freetimes,
                            "SortPoints": 0,
                            "latitude": Stadium.latitude,
                            "longitude": Stadium.longitude,
                            "iscombined": stadiumsnapshot.child("iscombined").val(),
                            "combined": stadiumsnapshot.child("combined").val(),
                            "city": Stadium.city,
                            "telephone": Stadium.telephone,
                            "devicetoken": Stadium.devicetoken

                        };

                        Availables.push(Data);
                        // }
                        callback(Availables);
                    }, function (error) {
                        console.log(error.message);
                    });

                }
                catch (error) {
                    alert(error);
                }


            },
            GetAllStadiums: function (callback) {
                //var q = $q.defer();
                try {
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiumsinfo').on('value', function (snapshot) {
                        AllStadiums = [];
                        snapshot.forEach(function (mainsnapshot) {

                            var Data = {
                                "key": mainsnapshot.key,
                                "name": mainsnapshot.child("name").val(),
                                "photo": mainsnapshot.child("photo").val(),
                                "area": mainsnapshot.child("locationarea").val(),
                                "latitude": mainsnapshot.child("cordovalatitude").val(),
                                "longitude": mainsnapshot.child("cordovalongitude").val()


                            };
                            AllStadiums.push(Data);
                        })
                        callback(AllStadiums);

                    });



                }
                catch (error) {
                    alert(error);
                }
            },
            GetAllMiniStadiums: function (callback) {
                //var q = $q.defer();
                try {
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiumsinfo').once('value', function (snapshot) {
                        AllStadiums = [];
                        snapshot.forEach(function (stadiumSnapshot) {
                            ministadiums = stadiumSnapshot.child("ministadiums");

                            ministadiums.forEach(function (minisnapshot) {
                                AllStadiums.push(minisnapshot.val());
                            })
                        })
                        callback(AllStadiums);

                    });
                }
                catch (error) {
                    alert(error);
                }
            },
            GetAllMiniStadiumsByStadName: function (stdName, callback) {
                //var q = $q.defer();
                try {
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiumsinfo').orderByChild("name").startAt(stdName).endAt(stdName).once('value', function (snapshot) {
                        AllStadiums = [];
                        snapshot.forEach(function (stadiumSnapshot) {
                            if (stadiumSnapshot != null && stadiumSnapshot.child("name").val() == stdName) {
                                ministadiums = stadiumSnapshot.child("ministadiums");

                                ministadiums.forEach(function (minisnapshot) {
                                    minStd = minisnapshot.val();
                                    minStd.name = stadiumSnapshot.child("name").val();
                                    minStd.key = minisnapshot.getKey();
                                    minStd.stadiumKey = stadiumSnapshot.getKey();
                                    AllStadiums.push(minStd);
                                })

                                callback(AllStadiums);
                            }
                        })
                    });
                }
                catch (error) {
                    alert(error);
                }
            },
            CheckIfFree: function (stadiums, date, callback) {
                try {
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDate();

                    var hour = date.getHours();
                    var minute = date.getMinutes();

                    var key = stadiums.stadiumkey;
                    var subkey = stadiums.ministadiumkey;

                    var newkey = subkey + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString();

                    var exists = false;

                    firebase.database().ref('/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey)
                        .once('value', function (snapshot) {
                            if (snapshot.exists()) {
                                exists = true;
                            }
                            callback(exists);
                        })
                }
                catch (error) {
                    alert(error.message);
                }

            },
            GetNumReservationsByDate: function (date, callback) {


                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();

                var hour = date.getHours();
                var minute = date.getMinutes();

                var user = firebase.auth().currentUser;

                var id = user.uid;

                firebase.database().ref('/players/' + id + '/reserveyears/' + year + '/' + month + '/' + day).once('value').then(function (snapshot) {

                    if (snapshot.exists) {
                        number = snapshot.numChildren();
                    }
                    else {
                        number = 0;
                    }

                    callback(number);
                });
            },

            DeleteBooking: function (reservation) {

                //alert("here");
                /*   var year = reservation.date.getFullYear();
                   var month = reservation.date.getMonth();
                   var day = reservation.date.getDate();
             
                   var hour = reservation.date.getHours();
                   var minute = reservation.date.getMinutes();
             
             
                   var key = reservation.stadiumkey;
                   var subkey = reservation.ministadiumkey;
             
             
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
                           
                           extrakeys.forEach(function (element) {
                               updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = null;
                               updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = null;
                           }, this);
                       }
             
                       updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = null;
                       updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = null;
             
             
                   }
                   postData.references = references;
                   postDataPlayer.references = postData.references;
             
                   var keys = [];
                   if (stadiums.iscombined) {
                       for (var itemkey in stadiums.combined) {
                           keys.push(itemkey);
                       }
             
                       keys.forEach(function (element) {
                           updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = null;
                           updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = null;
                       }, this);
                   }
             
                   updates['/stadiums/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = null;
                   updates['/stadiumshistory/' + stadiums.stadiumkey + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = null;
             
             
                   updates['/players/' + id + '/upcomingmatches/' + mainkey] = null;
             
                   updates['/accounting/' + id + '/' + mainkey] = null;
             
             
                   
             
             
                   return firebase.database().ref().update(updates);*/
            }
        }
    })