
angular.module('football.controllers')


    .controller('HomeController', function ($scope, $interval, $http, $ionicSlideBoxDelegate, HomeStore, LoginStore, TeamStores, $state, $timeout, $ionicPopup, $ionicLoading, $cordovaSocialSharing) {



        var updates = {};



        /*updates['players/3dZ7UAGpCPRIifdKMe4UQA6o6hU2/favlatitude'] = 33.886721;
        updates['players/4fOYLCVpYdO06prqr2lybyExSo32/favlatitude'] = 33.876721;
        updates['players/57r4EPKe0vZd4lg44oRkpFaN4lE2/favlatitude'] = 33.886721;
        updates['players/6S26MunyhsSDBxPUnAJmmWx48ib2/favlatitude'] = 33.886721;
        updates['players/6t7CSu9DIvNpdw3clynmOvOANE53/favlatitude'] = 33.866721;
        updates['players/GAjVnNWeKnZjIlIruWBoBUE7F8l2/favlatitude'] = 33.886721;
        updates['players/H0HfwLTdQ9VI2Hinetyls0dPi2F2/favlatitude'] = 33.886721;
        updates['players/JD5rvXKBpZNOyT9whb5AvAcYDLw2/favlatitude'] = 33.886721;
        updates['players/LZWSI4e9CGhKrIx0dW1fTho2tCH3/favlatitude'] = 33.886721;
        updates['players/OTuAlymV3NNYexTA0sDz0mbg0JU2/favlatitude'] = 33.846721;
        updates['players/RoJUmLDQ5pcwkaPd3PQChixniDQ2/favlatitude'] = 33.886721;
        updates['players/ShQ2lY1T9TQcYvoekbKI9OWnCFj1/favlatitude'] = 33.886721;
        updates['players/VbKdD71xkhNmP2WfvX6mXgK9iwS2/favlatitude'] = 33.882721;
        updates['players/XkBLqjJjlEa0SgAnR6qKNG7UVzI3/favlatitude'] = 33.886721;
        updates['players/lgLOikwiWhP52pYSrtDXzsxtHw92/favlatitude'] = 33.883721;
        updates['players/nUs5Sa6zKGMM4AwVtptUtG82J6r1/favlatitude'] = 33.886721;
        updates['players/quDma33zfpfJ5E1tFJuMnab4WMM2/favlatitude'] = 33.886421;
        updates['players/vvg5TP7ooSfHcOjSY8A10kLBPg82/favlatitude'] = 33.886721;
        updates['players/w5FGFo7tp4aw2w0yyUaOlZGawmg2/favlatitude'] = 33.883121;
        updates['players/wpmGJ3CI7tfwLUyzECdvfTUX7uf1/favlatitude'] = 33.886721;
        updates['players/zLGTNRHaGpPMOWtEAL4H8E8vbdX2/favlatitude'] = 33.882721;

        updates['players/3dZ7UAGpCPRIifdKMe4UQA6o6hU2/favlongitude'] = 35.886721;
        updates['players/4fOYLCVpYdO06prqr2lybyExSo32/favlongitude'] = 35.876721;
        updates['players/57r4EPKe0vZd4lg44oRkpFaN4lE2/favlongitude'] = 35.886721;
        updates['players/6S26MunyhsSDBxPUnAJmmWx48ib2/favlongitude'] = 35.886721;
        updates['players/6t7CSu9DIvNpdw3clynmOvOANE53/favlongitude'] = 35.866721;
        updates['players/GAjVnNWeKnZjIlIruWBoBUE7F8l2/favlongitude'] = 35.886721;
        updates['players/H0HfwLTdQ9VI2Hinetyls0dPi2F2/favlongitude'] = 35.886721;
        updates['players/JD5rvXKBpZNOyT9whb5AvAcYDLw2/favlongitude'] = 35.886721;
        updates['players/LZWSI4e9CGhKrIx0dW1fTho2tCH3/favlongitude'] = 35.886721;
        updates['players/OTuAlymV3NNYexTA0sDz0mbg0JU2/favlongitude'] = 35.846721;
        updates['players/RoJUmLDQ5pcwkaPd3PQChixniDQ2/favlongitude'] = 35.886721;
        updates['players/ShQ2lY1T9TQcYvoekbKI9OWnCFj1/favlongitude'] = 35.886721;
        updates['players/VbKdD71xkhNmP2WfvX6mXgK9iwS2/favlongitude'] = 35.882721;
        updates['players/XkBLqjJjlEa0SgAnR6qKNG7UVzI3/favlongitude'] = 35.886721;
        updates['players/lgLOikwiWhP52pYSrtDXzsxtHw92/favlongitude'] = 35.883721;
        updates['players/nUs5Sa6zKGMM4AwVtptUtG82J6r1/favlongitude'] = 35.886721;
        updates['players/quDma33zfpfJ5E1tFJuMnab4WMM2/favlongitude'] = 35.886421;
        updates['players/vvg5TP7ooSfHcOjSY8A10kLBPg82/favlongitude'] = 35.886721;
        updates['players/w5FGFo7tp4aw2w0yyUaOlZGawmg2/favlongitude'] = 35.883121;
        updates['players/wpmGJ3CI7tfwLUyzECdvfTUX7uf1/favlongitude'] = 35.886721;
        updates['players/zLGTNRHaGpPMOWtEAL4H8E8vbdX2/favlongitude'] = 35.882721;



        updates['playersinfo/3dZ7UAGpCPRIifdKMe4UQA6o6hU2/favlatitude'] = 33.545928;
        updates['playersinfo/4fOYLCVpYdO06prqr2lybyExSo32/favlatitude'] = 33.535928;
        updates['playersinfo/57r4EPKe0vZd4lg44oRkpFaN4lE2/favlatitude'] = 33.521928;
        updates['playersinfo/6S26MunyhsSDBxPUnAJmmWx48ib2/favlatitude'] = 33.565928;
        updates['playersinfo/6t7CSu9DIvNpdw3clynmOvOANE53/favlatitude'] = 33.575928;
        updates['playersinfo/GAjVnNWeKnZjIlIruWBoBUE7F8l2/favlatitude'] = 33.585928;
        updates['playersinfo/H0HfwLTdQ9VI2Hinetyls0dPi2F2/favlatitude'] = 33.555928;
        updates['playersinfo/JD5rvXKBpZNOyT9whb5AvAcYDLw2/favlatitude'] = 33.565928;
        updates['playersinfo/LZWSI4e9CGhKrIx0dW1fTho2tCH3/favlatitude'] = 33.545928;
        updates['playersinfo/OTuAlymV3NNYexTA0sDz0mbg0JU2/favlatitude'] = 33.525928;
        updates['playersinfo/RoJUmLDQ5pcwkaPd3PQChixniDQ2/favlatitude'] = 33.545928;
        updates['playersinfo/ShQ2lY1T9TQcYvoekbKI9OWnCFj1/favlatitude'] = 33.545928;
        updates['playersinfo/VbKdD71xkhNmP2WfvX6mXgK9iwS2/favlatitude'] = 33.525928;
        updates['playersinfo/XkBLqjJjlEa0SgAnR6qKNG7UVzI3/favlatitude'] = 33.545928;
        updates['playersinfo/lgLOikwiWhP52pYSrtDXzsxtHw92/favlatitude'] = 33.542928;
        updates['playersinfo/nUs5Sa6zKGMM4AwVtptUtG82J6r1/favlatitude'] = 33.545928;
        updates['playersinfo/quDma33zfpfJ5E1tFJuMnab4WMM2/favlatitude'] = 33.545928;
        updates['playersinfo/vvg5TP7ooSfHcOjSY8A10kLBPg82/favlatitude'] = 33.575928;
        updates['playersinfo/w5FGFo7tp4aw2w0yyUaOlZGawmg2/favlatitude'] = 33.585928;
        updates['playersinfo/wpmGJ3CI7tfwLUyzECdvfTUX7uf1/favlatitude'] = 33.545558;
        updates['playersinfo/zLGTNRHaGpPMOWtEAL4H8E8vbdX2/favlatitude'] = 33.545928;


        updates['players/3dZ7UAGpCPRIifdKMe4UQA6o6hU2/favlatitude'] = 35.545928;
        updates['players/4fOYLCVpYdO06prqr2lybyExSo32/favlatitude'] = 35.535928;
        updates['players/57r4EPKe0vZd4lg44oRkpFaN4lE2/favlatitude'] = 35.521928;
        updates['players/6S26MunyhsSDBxPUnAJmmWx48ib2/favlatitude'] = 35.565928;
        updates['players/6t7CSu9DIvNpdw3clynmOvOANE53/favlatitude'] = 35.575928;
        updates['players/GAjVnNWeKnZjIlIruWBoBUE7F8l2/favlatitude'] = 35.585928;
        updates['players/H0HfwLTdQ9VI2Hinetyls0dPi2F2/favlatitude'] = 35.555928;
        updates['players/JD5rvXKBpZNOyT9whb5AvAcYDLw2/favlatitude'] = 35.565928;
        updates['players/LZWSI4e9CGhKrIx0dW1fTho2tCH3/favlatitude'] = 35.545928;
        updates['players/OTuAlymV3NNYexTA0sDz0mbg0JU2/favlatitude'] = 35.525928;
        updates['players/RoJUmLDQ5pcwkaPd3PQChixniDQ2/favlatitude'] = 35.545928;
        updates['players/ShQ2lY1T9TQcYvoekbKI9OWnCFj1/favlatitude'] = 35.545928;
        updates['players/VbKdD71xkhNmP2WfvX6mXgK9iwS2/favlatitude'] = 35.525928;
        updates['players/XkBLqjJjlEa0SgAnR6qKNG7UVzI3/favlatitude'] = 35.545928;
        updates['players/lgLOikwiWhP52pYSrtDXzsxtHw92/favlatitude'] = 35.542928;
        updates['players/nUs5Sa6zKGMM4AwVtptUtG82J6r1/favlatitude'] = 35.545928;
        updates['players/quDma33zfpfJ5E1tFJuMnab4WMM2/favlatitude'] = 35.545928;
        updates['players/vvg5TP7ooSfHcOjSY8A10kLBPg82/favlatitude'] = 35.575928;
        updates['players/w5FGFo7tp4aw2w0yyUaOlZGawmg2/favlatitude'] = 35.585928;
        updates['players/wpmGJ3CI7tfwLUyzECdvfTUX7uf1/favlatitude'] = 35.545558;
        updates['players/zLGTNRHaGpPMOWtEAL4H8E8vbdX2/favlatitude'] = 35.545928;

        updates['playersinfo/3dZ7UAGpCPRIifdKMe4UQA6o6hU2/IsMobileVerified'] = true;
        updates['playersinfo/4fOYLCVpYdO06prqr2lybyExSo32/IsMobileVerified'] = true;
        updates['playersinfo/57r4EPKe0vZd4lg44oRkpFaN4lE2/IsMobileVerified'] = true;
        updates['playersinfo/6S26MunyhsSDBxPUnAJmmWx48ib2/IsMobileVerified'] = true;
        updates['playersinfo/6t7CSu9DIvNpdw3clynmOvOANE53/IsMobileVerified'] = true;
        updates['playersinfo/GAjVnNWeKnZjIlIruWBoBUE7F8l2/IsMobileVerified'] = true;
        updates['playersinfo/H0HfwLTdQ9VI2Hinetyls0dPi2F2/IsMobileVerified'] = true;
        updates['playersinfo/JD5rvXKBpZNOyT9whb5AvAcYDLw2/IsMobileVerified'] = true;
        updates['playersinfo/LZWSI4e9CGhKrIx0dW1fTho2tCH3/IsMobileVerified'] = true;
        updates['playersinfo/OTuAlymV3NNYexTA0sDz0mbg0JU2/IsMobileVerified'] = true;
        updates['playersinfo/RoJUmLDQ5pcwkaPd3PQChixniDQ2/IsMobileVerified'] = true;
        updates['playersinfo/ShQ2lY1T9TQcYvoekbKI9OWnCFj1/IsMobileVerified'] = true;
        updates['playersinfo/VbKdD71xkhNmP2WfvX6mXgK9iwS2/IsMobileVerified'] = true;
        updates['playersinfo/XkBLqjJjlEa0SgAnR6qKNG7UVzI3/IsMobileVerified'] = true;
        updates['playersinfo/lgLOikwiWhP52pYSrtDXzsxtHw92/IsMobileVerified'] = true;
        updates['playersinfo/nUs5Sa6zKGMM4AwVtptUtG82J6r1/IsMobileVerified'] = true;
        updates['playersinfo/quDma33zfpfJ5E1tFJuMnab4WMM2/IsMobileVerified'] = true;
        updates['playersinfo/vvg5TP7ooSfHcOjSY8A10kLBPg82/IsMobileVerified'] = true;
        updates['playersinfo/w5FGFo7tp4aw2w0yyUaOlZGawmg2/IsMobileVerified'] = true;
        updates['playersinfo/wpmGJ3CI7tfwLUyzECdvfTUX7uf1/IsMobileVerified'] = true;
        updates['playersinfo/zLGTNRHaGpPMOWtEAL4H8E8vbdX2/IsMobileVerified'] = true;

        updates['playersinfo/3dZ7UAGpCPRIifdKMe4UQA6o6hU2/available'] = true;
        updates['playersinfo/4fOYLCVpYdO06prqr2lybyExSo32/available'] = true;
        updates['playersinfo/57r4EPKe0vZd4lg44oRkpFaN4lE2/available'] = true;
        updates['playersinfo/6S26MunyhsSDBxPUnAJmmWx48ib2/available'] = true;
        updates['playersinfo/6t7CSu9DIvNpdw3clynmOvOANE53/available'] = true;
        updates['playersinfo/GAjVnNWeKnZjIlIruWBoBUE7F8l2/available'] = true;
        updates['playersinfo/H0HfwLTdQ9VI2Hinetyls0dPi2F2/available'] = true;
        updates['playersinfo/JD5rvXKBpZNOyT9whb5AvAcYDLw2/available'] = true;
        updates['playersinfo/LZWSI4e9CGhKrIx0dW1fTho2tCH3/available'] = true;
        updates['playersinfo/OTuAlymV3NNYexTA0sDz0mbg0JU2/available'] = true;
        updates['playersinfo/RoJUmLDQ5pcwkaPd3PQChixniDQ2/available'] = true;
        updates['playersinfo/ShQ2lY1T9TQcYvoekbKI9OWnCFj1/available'] = true;
        updates['playersinfo/VbKdD71xkhNmP2WfvX6mXgK9iwS2/available'] = true;
        updates['playersinfo/XkBLqjJjlEa0SgAnR6qKNG7UVzI3/available'] = true;
        updates['playersinfo/lgLOikwiWhP52pYSrtDXzsxtHw92/available'] = true;
        updates['playersinfo/nUs5Sa6zKGMM4AwVtptUtG82J6r1/available'] = true;
        updates['playersinfo/quDma33zfpfJ5E1tFJuMnab4WMM2/available'] = true;
        updates['playersinfo/vvg5TP7ooSfHcOjSY8A10kLBPg82/available'] = true;
        updates['playersinfo/w5FGFo7tp4aw2w0yyUaOlZGawmg2/available'] = true;
        updates['playersinfo/wpmGJ3CI7tfwLUyzECdvfTUX7uf1/available'] = true;
        updates['playersinfo/zLGTNRHaGpPMOWtEAL4H8E8vbdX2/available'] = true;

        updates['players/3dZ7UAGpCPRIifdKMe4UQA6o6hU2/teams'] = null;
        updates['players/4fOYLCVpYdO06prqr2lybyExSo32/teams'] = null;
        updates['players/57r4EPKe0vZd4lg44oRkpFaN4lE2/teams'] = null;
        updates['players/6S26MunyhsSDBxPUnAJmmWx48ib2/teams'] = null;
        updates['players/6t7CSu9DIvNpdw3clynmOvOANE53/teams'] = null;
        updates['players/GAjVnNWeKnZjIlIruWBoBUE7F8l2/teams'] = null;
        updates['players/H0HfwLTdQ9VI2Hinetyls0dPi2F2/teams'] = null;
        updates['players/JD5rvXKBpZNOyT9whb5AvAcYDLw2/teams'] = null;
        updates['players/LZWSI4e9CGhKrIx0dW1fTho2tCH3/teams'] = null;
        updates['players/OTuAlymV3NNYexTA0sDz0mbg0JU2/teams'] = null;
        updates['players/RoJUmLDQ5pcwkaPd3PQChixniDQ2/teams'] = null;
        updates['players/ShQ2lY1T9TQcYvoekbKI9OWnCFj1/teams'] = null;
        updates['players/VbKdD71xkhNmP2WfvX6mXgK9iwS2/teams'] = null;
        updates['players/XkBLqjJjlEa0SgAnR6qKNG7UVzI3/teams'] = null;
        updates['players/lgLOikwiWhP52pYSrtDXzsxtHw92/teams'] = null;
        updates['players/nUs5Sa6zKGMM4AwVtptUtG82J6r1/teams'] = null;
        updates['players/quDma33zfpfJ5E1tFJuMnab4WMM2/teams'] = null;
        updates['players/vvg5TP7ooSfHcOjSY8A10kLBPg82/teams'] = null;
        updates['players/w5FGFo7tp4aw2w0yyUaOlZGawmg2/teams'] = null;
        updates['players/wpmGJ3CI7tfwLUyzECdvfTUX7uf1/teams'] = null;
        updates['players/zLGTNRHaGpPMOWtEAL4H8E8vbdX2/teams'] = null;


        updates['players/3dZ7UAGpCPRIifdKMe4UQA6o6hU2/upcominteamgmatches'] = null;
        updates['players/4fOYLCVpYdO06prqr2lybyExSo32/upcominteamgmatches'] = null;
        updates['players/57r4EPKe0vZd4lg44oRkpFaN4lE2/upcominteamgmatches'] = null;
        updates['players/6S26MunyhsSDBxPUnAJmmWx48ib2/upcominteamgmatches'] = null;
        updates['players/6t7CSu9DIvNpdw3clynmOvOANE53/upcominteamgmatches'] = null;
        updates['players/GAjVnNWeKnZjIlIruWBoBUE7F8l2/upcominteamgmatches'] = null;
        updates['players/H0HfwLTdQ9VI2Hinetyls0dPi2F2/upcominteamgmatches'] = null;
        updates['players/JD5rvXKBpZNOyT9whb5AvAcYDLw2/upcominteamgmatches'] = null;
        updates['players/LZWSI4e9CGhKrIx0dW1fTho2tCH3/upcominteamgmatches'] = null;
        updates['players/OTuAlymV3NNYexTA0sDz0mbg0JU2/upcominteamgmatches'] = null;
        updates['players/RoJUmLDQ5pcwkaPd3PQChixniDQ2/upcominteamgmatches'] = null;
        updates['players/ShQ2lY1T9TQcYvoekbKI9OWnCFj1/upcominteamgmatches'] = null;
        updates['players/VbKdD71xkhNmP2WfvX6mXgK9iwS2/upcominteamgmatches'] = null;
        updates['players/XkBLqjJjlEa0SgAnR6qKNG7UVzI3/upcominteamgmatches'] = null;
        updates['players/lgLOikwiWhP52pYSrtDXzsxtHw92/upcominteamgmatches'] = null;
        updates['players/nUs5Sa6zKGMM4AwVtptUtG82J6r1/upcominteamgmatches'] = null;
        updates['players/quDma33zfpfJ5E1tFJuMnab4WMM2/upcominteamgmatches'] = null;
        updates['players/vvg5TP7ooSfHcOjSY8A10kLBPg82/upcominteamgmatches'] = null;
        updates['players/w5FGFo7tp4aw2w0yyUaOlZGawmg2/upcominteamgmatches'] = null;
        updates['players/wpmGJ3CI7tfwLUyzECdvfTUX7uf1/upcominteamgmatches'] = null;
        updates['players/zLGTNRHaGpPMOWtEAL4H8E8vbdX2/upcominteamgmatches'] = null;

        updates['teams/-KpfHCX5ZD7jjtYgMAWF/reviewrating'] =5;
        updates['teams/-KpfIdV1NBMMezJe5Wdq/reviewrating'] = 5;

        updates['teaminfo/-KpfHCX5ZD7jjtYgMAWF/reviewrating'] = 5;
        updates['teaminfo/-KpfIdV1NBMMezJe5Wdq/reviewrating'] = 5;


        */


        /*for (var i = 51; i < 700; i++) {
            var updates = {};
                                var contact = {
                        //badge:team.badge,
                        available: true,
                        rating: 1500,
                        status: '1',
                        teamadmin: '',
                        teamadminphoto: '',
                        teamname: i+'teamname',
                        yellowcard: 0,
                        pteamsize: 5,
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
                        favstadium: "",
                        favstadiumphoto: '',
                        homejersey: 'white',
                        awayjersey: 'white',
                        badge: 'b01',
                        rank: 0,
                        numberofgames: 0,
                        wins: 0,
                        winstreak: 0,

                        teamoffive: true,
                        teamofsix: true,
                        teamofseven: true,
                        teamofeight: true,
                        teamofnine: true,
                        teamoften: true,
                        teamofeleven: true,

                        dateyear: 1,
                        datemonth: 1,
                        dateday: 1,

                        datehour: 1,
                        dateminute: 1,
                        players: {
                            firstone: true,
                        },
                        captain: {
                            firstone: true,
                        },
                        timestamp: firebase.database.ServerValue.TIMESTAMP,

                        comments: "",

                        favlatitude: 100,
                        favlongitude: 100,
                        reviewrating: 5
                        

                    };

                        
                        updates['/teaminfo/' + i] = null;
                    firebase.database().ref().update(updates);
         
        }
        for (var i = 0; i < 50; i++) {
            var updates = {};
            var contact = {
                ClosingTime: "23:00",
                OpeningTime: "8:00",
                RestrictedTime1: "20:00",
                RestrictedTime2: "21:30",
                admin: "tqujNBEWyTR54y510NTNENppu1T2",
                cancelationpolicy: "sometext",
                cordovaaccuracy: 0,
                cordovaaltitude: 0,
                cordovaaltitudeAccuracy: 0,
                cordovalatitude: 33.910675,
                cordovalongitude: 35.584254,
                description: "long description",
                email: "someemail",
                indoor: 1,
                locationarea: "beirut",
                locationcity: "beirut",
                locationtelephone: "01555666",
                name: "Vclub2",
                numberofstadium: 10,
                outdoor: 1,
                photo: "",
                rating: 8,
                telephone: "03333333"
            }
            updates['/stadiumsinfo/' + i] = null;
            firebase.database().ref().update(updates);



        }
*/
        var updates = {};
        // var data = {
            // ClosingTime: "23:00",
            // OpeningTime: "8:00",
            // RestrictedTime1: "20:00",
            // RestrictedTime2: "21:30",
            // admin: "ZhMK4rUZSeXktZrnrA9ISOGKUxA3",
            // cancelationpolicy: "sometext",
            // cordovaaccuracy: 0,
            // cordovaaltitude: 0,
            // cordovaaltitudeAccuracy: 0,
            // cordovalatitude: 33.910675,
            // cordovalongitude: 35.584254,
            // description: "long description",
            // email: "test@arina.com",
            // indoor: 1,
            // locationarea: "beirut",
            // locationcity: "beirut",
            // locationtelephone: "01555666",
            // name: "FOOTERS",
            // numberofstadium: 4,
            // outdoor: 1,
            // photo: "",
            // rating: 8,
            // telephone: "03333333"
        // }

        // updates['/stadiums/FOOTERS'] = data;
        // updates['/stadiumsinfo/FOOTERS'] = data;

        //firebase.database().ref().update(updates);


        $scope.nointernet = false;
        $scope.$on("$ionicView.afterEnter", function (event, data) {
            // handle event
            //works

            $timeout(function () {

                try {

                    var user = firebase.auth().currentUser;

                    if (!(user === null || user == '' || user === undefined)) 
					{

                        LoginStore.UpdateLastSeen();
						
						if('cordova' in window)
						{
							window.plugins.OneSignal.getIds(function (ids) {
								var updates = {};
								updates['/players/' + user.uid + '/devicetoken'] = ids.userId;
								updates['/playersinfo/' + user.uid + '/devicetoken'] = ids.userId;
								firebase.database().ref().update(updates).then(function () {
								});
						});}


                        var id = user.uid;

                        if (!(id === null || id == '' || id === undefined)) 
						{

                            if (!($scope.profile === null || $scope.profile == '' || $scope.profile === undefined)) 
							{

                                if ($scope.profile.id !== id) {
                                    $scope.profile = [];
                                    $scope.$apply();
                                    // Simple GET request example:
                                    $http({
                                        method: 'GET',
                                        url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
                                    }).then(function successCallback(response) {

                                        $scope.currentdate = new Date(response.data);
                                        $scope.doRefresh($scope.currentdate);

                                    }, function errorCallback(response) {
                                        alert("error");
                                        LoginStore.PostError(response, 103, "homepagecontroller.js")
                                    });

                                }
                            }


                        }
                    }

                }
                catch (error) {

                    LoginStore.PostError(error);
                }
            }, 700)
        });

        //Section Visibility Variables
        $scope.showteaminvite = false;
        $scope.showpendingchallenge = false;
        $scope.showupcomingmatches = false;
        $scope.showupcomingsinglematches = false;

        $scope.teaminvitationoperation = true;


        $scope.notloaded = true;
        try {

            $scope.profile = {};


        } catch (error) {

            LoginStore.PostError(error);
        }

        $scope.acceptinvitation = function (challenge) {

            firebase.database().ref('/challenges/' + challenge.key).once('value').then(function (snapshot) {

                if (snapshot.exists()) {

                    if (snapshot.val().gameaccepted == false) {
                        try {

                            if (challenge !== null || challenge == '' || challenge === undefined) {
                                $state.go('app.choosechallengestadium', {
                                    challenge: challenge
                                });
                            }


                        } catch (error) {

                            LoginStore.PostError(error);
                        }


                    }
                    else {

                        var alertPopup = $ionicPopup.alert({
                            template: 'Sorry! Another team has already accepted the challenge!'
                        });


                        alertPopup.then(function (res) {

                            HomeStore.DeleteChallenge(challenge).then(function () {
                                //remove the challenge from homepage
                                $scope.profile.challenges = $scope.profile.challenges.filter(function (el) {
                                    return el.key !== challenge.key;

                                })
                                $ionicSlideBoxDelegate.update();
                                $scope.$apply();
                            });

                        })

                    }
                }
                else {

                    var alertPopup = $ionicPopup.alert({
                        template: 'Sorry! Another team has already accepted the challenge!'
                    });


                    alertPopup.then(function (res) {

                        HomeStore.DeleteChallenge(challenge).then(function () {
                            //remove the challenge from homepage
                            $scope.profile.challenges = $scope.profile.challenges.filter(function (el) {
                                return el.key !== challenge.key;

                            })
                            $ionicSlideBoxDelegate.update();
                            $scope.$apply();
                        });

                    })

                }
            })

        }

        $scope.gototeam = function (id) {
            if (!(id == null || id == '' || id === undefined)) {
                $state.go("app.teamprofile",
                    {
                        teamid: id
                    })
            }
			else
				$state.go("app.teammanagement");
        }

        $scope.declineinvitation = function (challenge) {
            try {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Decline',
                    template: 'Are you sure you want to decline the challenge?'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        //decline the challenge
                        HomeStore.DeleteChallenge(challenge).then(function () {


                            firebase.database().ref('/playersinfo/' + challenge.team2adminid).on('value', function (snapshot) {
                                if (snapshot.exists()) {
                                    var devicetoken = snapshot.val().devicetoken;

                                    if (snapshot.val().settings.notification) {
                                        /// PLAYER TOKENS
                                        var Tokens = [];
                                        if (snapshot.val().hasOwnProperty("devicetoken")) {
                                            for (var k in snapshot.val().devicetoken) {
                                                if (snapshot.val().devicetoken.hasOwnProperty(k)) {
                                                    Tokens.push(k);
                                                }
                                            }
                                        }
                                        LoginStore.SendNotification(challenge.team1name + ' declined your challenge', Tokens);
                                    }

                                }
                            })

                            $ionicSlideBoxDelegate.update();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Challenge Declined'
                            })
                            //remove the challenge from homepage
                            $scope.profile.challenges = $scope.profile.challenges.filter(function (el) {
                                return el.key !== challenge.key;

                            })
                            $ionicSlideBoxDelegate.update();
                            $scope.$apply();
                        }, function (error) {

                            LoginStore.PostError(error);
                        })
                    }

                })

            } catch (error) {

                LoginStore.PostError(error);
            }
        }
        $scope.cancelinvitation = function (challenge) {
            try {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Decline',
                    template: 'Are you sure you want to cancel the challenge?'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        HomeStore.DeleteChallenge(challenge).then(function () {

                            $scope.profile.challenges = $scope.profile.challenges.filter(function (el) {
                                return el.key !== challenge.key;

                            })
                            $scope.$apply();
                            $ionicSlideBoxDelegate.update();
                        }, function (error) {

                            LoginStore.PostError(error);
                        })
                    }

                })

            } catch (error) {

                LoginStore.PostError(error);
            }
        }

        $scope.acceptteaminvitation = function (invitation, x) {
            try {
                $scope.teaminvitationoperation = true;
                switch (x) {
                    case 1:

                        firebase.database().ref('/teaminfo/' + invitation.key).once('value').then(function (snapshot) {
                            if (snapshot.exists()) {
                                HomeStore.AcceptTeamInvitation(invitation, $scope.profile).then(function () {
                                    $ionicSlideBoxDelegate.update();

                                    firebase.database().ref('/playersinfo/' + invitation.adminkey).on('value', function (shot) {
                                        if (shot.exists()) {
                                            if (shot.val().settings.notification) {
                                                /// PLAYER TOKENS
                                                var Tokens = [];
                                                if (snapshot.val().hasOwnProperty("devicetoken")) {
                                                    for (var k in snapshot.val().devicetoken) {
                                                        if (snapshot.val().devicetoken.hasOwnProperty(k)) {
                                                            Tokens.push(k);
                                                        }
                                                    }
                                                }
												
                                                LoginStore.SendNotification(shot.val().firstname + " " + shot.val().lastname + " has accepted to join " + snapshot.val().teamname, Tokens);
                                            }
                                        }
                                    })

                                    var alertPopup = $ionicPopup.alert({
                                        title: 'New Team',
                                        template: 'You now belong to team ' + invitation.teamname
                                    }).then(function () {
                                        $state.go("app.teammanagement");
                                    }, function (error) {
                                        alert(error.message);
                                        LoginStore.PostError(error);
                                    })


                                });
                            }
                            else {
                                var alertPopup = $ionicPopup.alert({
                                    template: 'Sorry, the team does not exist anymore.'
                                }).then(function () {
                                    HomeStore.DeleteInvitation(invitation).then(function () {
                                        $scope.profile.teaminvitations = $scope.profile.teaminvitations.filter(function (el) {
                                            return el.key !== invitation.key;

                                        });

                                    }, function (error) {

                                        LoginStore.PostError(error);
                                    })
                                }, function (error) {

                                })
                            }
                        })




                        break;
                    case 2:
                        HomeStore.DeleteInvitation(invitation).then(function () {

                            $scope.profile.teaminvitations = $scope.profile.teaminvitations.filter(function (el) {
                                return el.key !== invitation.key;

                            });
                            firebase.database().ref('/playersinfo/' + invitation.adminkey).on('value', function (snapshot) {
                                if (shot.exists()) {
                                    if (shot.val().settings.notification) {
                                        /// PLAYER TOKENS
                                        var Tokens = [];
                                        if (snapshot.val().hasOwnProperty("devicetoken")) {
                                            for (var k in snapshot.val().devicetoken) {
                                                if (snapshot.val().devicetoken.hasOwnProperty(k)) {
                                                    Tokens.push(k);
                                                }
                                            }
                                        }
                                        LoginStore.SendNotification(shot.val().firstname + " " + shot.val().lastname + " has declined your invitation to join " + invitation.teamname, Tokens);
                                    }
                                }
                            })
                        }, function (error) {

                            LoginStore.PostError(error);
                        })
                        break;

                    default:
                        break;
                }
                $scope.teaminvitationoperation = false;

            } catch (error) {

                LoginStore.PostError(error);
            }


        }

        $scope.acceptrequest = function (request, x) {
            try {
                var user = firebase.auth().currentUser;
                $scope.teaminvitationoperation = true;
                switch (x) {
                    case 1:
                        HomeStore.AcceptMobileRequest(angular.copy(request), $scope.profile).then(function () {
                            $scope.profile.requestednumbers = $scope.profile.requestednumbers.filter(function (el) {
                                return el.key !== request.key;

                            });
                            $ionicSlideBoxDelegate.update();

                            firebase.database().ref('/playersinfo/' + user.uid).on('value', function (snapshot) {
                                if (shot.exists()) {
                                    if (shot.val().settings.notification) {
                                        /// PLAYER TOKENS
                                        var Tokens = [];
                                        if (snapshot.val().hasOwnProperty("devicetoken")) {
                                            for (var k in snapshot.val().devicetoken) {
                                                if (snapshot.val().devicetoken.hasOwnProperty(k)) {
                                                    Tokens.push(k);
                                                }
                                            }
                                        }
                                        LoginStore.SendNotification(shot.val().firstname + " " + shot.val().lastname + " accepted your phone number request.", Tokens);
                                    }
                                }
                            })

                        });

                        break;
                    case 2:
                        HomeStore.DeleteMobileRequest(request).then(function () {

                            $scope.profile.requestednumbers = $scope.profile.requestednumbers.filter(function (el) {
                                return el.key !== request.key;

                            });
                            $ionicSlideBoxDelegate.update();

                            firebase.database().ref('/playersinfo/' + user.uid).on('value', function (snapshot) {
                                if (shot.exists()) {
                                    if (shot.val().settings.notification) {
                                        /// PLAYER TOKENS
                                        var Tokens = [];
                                        if (snapshot.val().hasOwnProperty("devicetoken")) {
                                            for (var k in snapshot.val().devicetoken) {
                                                if (snapshot.val().devicetoken.hasOwnProperty(k)) {
                                                    Tokens.push(k);
                                                }
                                            }
                                        }
                                        LoginStore.SendNotification(shot.val().firstname + " " + shot.val().lastname + " declined your phone number request", Tokens);
                                    }
                                }
                            })

                        }, function (error) {

                            LoginStore.PostError(error);
                        })
                        break;

                    default:
                        break;
                }
                $scope.teaminvitationoperation = false;

            } catch (error) {

                LoginStore.PostError(error);
            }


        }

        $scope.acceptgameinvitation = function (type, gameinvitation) {
            try {

                switch (type) {
                    case 1:
                        HomeStore.AccepGameInvitation(angular.copy(gameinvitation)).then(function () {

                            $scope.profile.gameinvitations = $scope.profile.gameinvitations.filter(function (el) {
                                return el.key !== gameinvitation.key;
                            });
                            $ionicSlideBoxDelegate.update();
                            $scope.$apply();
                        }, function (error) {

                            LoginStore.PostError(error);
                        })
                        break;

                    case 2:
                        HomeStore.DeleteGameInvitation(gameinvitation).then(function () {

                            $scope.profile.gameinvitations = $scope.profile.gameinvitations.filter(function (el) {
                                return el.key !== gameinvitation.key;
                            });
                            $ionicSlideBoxDelegate.update();
                            $scope.$apply();
                        }, function (error) {

                            LoginStore.PostError(error);
                        })
                        break;

                    default:
                        break;
                }
                $scope.$apply();
            }
            catch (error) {

                LoginStore.PostError(error);
            }

        }

        // });
        //alert($scope.profile.displayname);

        $scope.doRefresh1 = function (currentdate) {

            $http({
                method: 'GET',
                url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
            }).then(function successCallback(response) {

                $scope.currentdate = new Date(response.data);
                $scope.doRefresh($scope.currentdate);

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                //alert(JSON.stringify(response));
            });

        }


        $scope.teamdisplayed = {
            key: "",
            name: "",
            picture: "",
            rank: ""
        }



        $scope.secondsToHms = function (d) {
            d = Number(d);

            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
        }

        $interval(function () {
            if ($scope.notloaded == false) {

                $scope.profile.challenges.forEach(function (element) {
                    element.tickersec -= 1;


                    if (element.tickersec < 1 && Math.abs((element.date - new Date()) / 36e5) < 12) {
                        HomeStore.DeleteChallenge(element).then(function () {
                        }, function (error) {
                            LoginStore.PostError(error);
                        })
                    }
                    else {
                        element.ticker = $scope.secondsToHms(element.tickersec);
                    }

                }, this);
            }
        }, 1000);


        $scope.doRefresh = function (currentdate) {

            try {
                $scope.profile = {};

                HomeStore.GetProfileInfo(currentdate, function (myprofile) {

                    console.log(myprofile);

                    var todaydate = new Date();
                    var oldchallenges = [];
                    var newchallenges = [];
                    $scope.profile = myprofile;

                    var test = new Date(null);

                    $scope.profile.challenges.forEach(function (element) {
                        if (Math.abs((element.date - $scope.currentdate) / 36e5) < 24)
                            element.tickersec = 24 * 60 * 60 - (($scope.currentdate - element.date) / 1000);
                        else
                            element.tickersec = 24 * 60 * 60 - (($scope.currentdate - element.dateofchallenge) / 1000);

                    }, this);


                    console.log("Profile: " + $scope.profile);

                    if ($scope.profile.photo.trim() == "") {
                        $scope.profile.photo = "img/PlayerProfile.png"
                    }

                    if ($scope.profile.teamdisplayedkey !== "none" && $scope.profile.teamdisplayedkey != "") {
                        TeamStores.GetTeamInfoByKey($scope.profile.teamdisplayedkey, function (favteam) {
                            console.log("TEAM");
                            console.log(favteam);
                            if (favteam !== null && favteam !== undefined && Object.keys(favteam).length !== 0 && favteam.constructor === Object) {

                                $scope.teamdisplayed.name = favteam.teamname;
                                $scope.teamdisplayed.picture = favteam.badge;
                                $scope.teamdisplayed.rank = favteam.rank;
                                $scope.teamdisplayed.key = favteam.key;

                                switch ($scope.teamdisplayed.rank) {
                                    case 1:
                                        $scope.teamdisplayed.rank = $scope.teamdisplayed.rank + 'st';
                                        break;
                                    case 2:
                                        $scope.teamdisplayed.rank = $scope.teamdisplayed.rank + 'nd';
                                        break;
                                    case 3:
                                        $scope.teamdisplayed.rank = $scope.teamdisplayed.rank + 'rd';
                                        break;

                                    default:
                                        $scope.teamdisplayed.rank = $scope.teamdisplayed.rank + 'th';
                                        break;
                                }

                            }
                            else {
                                $scope.teamdisplayed.name = "No Team";
                                $scope.teamdisplayed.picture = "defaultteam";
                                $scope.teamdisplayed.rank = "No team rank";
                                $scope.teamdisplayed.key = "";
                            }


                            

                        })
                    }
                    else {
                        $scope.teamdisplayed.name = "";
                        $scope.teamdisplayed.picture = "defaultteam";
                        $scope.teamdisplayed.rank = "";
                        $scope.teamdisplayed.key = "";
                    }
                    //$scope.profile.upcominteamgmatches.push($scope.profile.upcomingmatches);
					

					//Get the first 4 ranked teams
					HomeStore.GetFirstFour(function (leagues) {
						$scope.rankedteams = leagues;
					})
					
					
                    if ($scope.profile.challenges.length > 0) {
                        for (var i = 0; i < $scope.profile.challenges.length; i++) {
                            if (($scope.profile.challenges[i].date - todaydate) / 36e5 < 12 || ($scope.profile.challenges[i].date > todaydate)) {
                                oldchallenges.push($scope.profile.challenges[i]);
                            }
                            else {
                                newchallenges.push($scope.profile.challenges[i]);
                            }
                        }
                    }

                    $scope.profile.upcomingmatches = $scope.profile.upcomingmatches.concat($scope.profile.upcominteamgmatches);

                    HomeStore.DeleteOldChalleges(oldchallenges).then(function () {


                        $scope.challenges = newchallenges;
                        $scope.notloaded = false;

                        $scope.showpendingchallenge = $scope.profile.challenges.length == 0 ? false : true;
                        $scope.showupcomingmatches = $scope.profile.upcominteamgmatches.length == 0 ? false : true;
                        $scope.showteaminvite = $scope.profile.teaminvitations.length == 0 ? false : true;
                        $scope.showupcomingsinglematches = $scope.profile.upcomingmatches.length == 0 ? false : true;

                        //JSON.stringify()
                        $ionicSlideBoxDelegate.update();
                        $scope.$apply();
                    }, function (error) {

                        LoginStore.PostError(error);
                    })

                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');


                })
            } catch (error) {

                LoginStore.PostError(error);
            }
        }


        $scope.homepagedirect = function (opercode) {
            switch (opercode) {
                case 1:
                    $state.go('app.reservestadium');
                    break;
                case 2:
                    $state.go('app.availableplayers');
                    break;
                case 3:
                    $state.go('app.chooseyourteam');
                    break;
            }
        }

        $scope.gogamedetails = function (gameid) {

            if (gameid.gamestyle == "alonematch") {
                $state.go('app.bookings');
            }
            if (gameid.gamestyle == "teammatch") {
                $state.go('app.gamedetails',
                    {
                        gameid: gameid.key
                    })
            }

        }

        $scope.showSearch = false;
        $scope.toggleSearch = function () {
            $scope.showSearch = !$scope.showSearch;
        };


        $scope.goteamprofile = function (id) {
            if (!(id == null || id == '' || id === undefined)) {
                $state.go("app.teamview",
                    {
                        teamid: id
                    })
            }

        }



        $scope.InviteFacebook = function () {
            facebookConnectPlugin.appInvite(
                {
                    url: "http://example.com",
                    picture: "http://example.com/image.png"
                },
                function (obj) {
                    if (obj) {
                        if (obj.completionGesture == "cancel") {
                            // user canceled, bad guy
                        } else {
                            // user really invited someone :)
                        }
                    } else {
                        // user just pressed done, bad guy
                    }
                },
                function (obj) {
                    // error
                    console.log(obj);
                }
            );
        }

        $scope.ShareWhatsapp = function () {
            $cordovaSocialSharing
                .shareViaWhatsApp("TRY THE APP", "www.google.com", "applink")
                .then(function (result) {
                    // Success!
                }, function (err) {
                    // An error occurred. Show a message to the user
                });
        }

        $scope.ShareSMS = function () {
            // access multiple numbers in a string like: '0612345678,0687654321'
            $cordovaSocialSharing
                .shareViaSMS(message, number)
                .then(function (result) {
                    // Success!
                }, function (err) {
                    // An error occurred. Show a message to the user
                });
        }


    })


    .controller('ChallengeStadiumController', function ($timeout, $scope, $ionicHistory, LoginStore, $state, ReservationFact, HomeStore, $ionicPopup, $ionicLoading) {

        $scope.allfreestadiums = $state.params.challenge.stadiums;

        $scope.rating = {};
        $scope.rating.max = 5;

        $scope.readOnly = true;

        $scope.challenge = $state.params.challenge;

        $scope.selectreservestadium = function (stadium) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Decline',
                template: 'Are you sure to accept the challenge and reserve @ ' + $scope.challenge.date
            });

            confirmPopup.then(function (res) {
                if (res) {

                    $scope.search =
                        {
                            date: $scope.challenge.date
                        }

                    firebase.database().ref('/challenges/' + $scope.challenge.key).once('value').then(function (snapshot) {

                        if (snapshot.exists()) {

                            ReservationFact.CheckIfFree(stadium, $scope.search.date, function (result) {
                                console.log($scope.challenge);
                                if (!result) {

                                    HomeStore.RegisterTeamMatch($scope.search, "", stadium, $scope.challenge)
                                        .then(function (value) {
                                            var alertPopup = $ionicPopup.alert({
                                                cssClass: 'custom-class',
                                                template: 'Successfully Reserved'
                                            });

                                            $ionicHistory.nextViewOptions({
                                                disableBack: true
                                            });

                                            firebase.database().ref('/playersinfo/' + $scope.challenge.team2adminid).on('value', function (snapshot) {
                                                if (snapshot.exists()) {
                                                    if (snapshot.val().settings.notification) {
                                                        /// PLAYER TOKENS
                                                        var Tokens = [];
                                                        if (snapshot.val().hasOwnProperty("devicetoken")) {
                                                            for (var k in snapshot.val().devicetoken) {
                                                                if (snapshot.val().devicetoken.hasOwnProperty(k)) {
                                                                    Tokens.push(k);
                                                                }
                                                            }
                                                        }
                                                        LoginStore.SendNotification("It's game time! " + $scope.challenge.team1name + ' accepted your challenge', Tokens);
                                                    }
                                                }
                                            })
                                            $state.go("app.gamedetails",
                                                {
                                                    gameid: $scope.challenge.key
                                                });
                                        }, function (error) {
                                            var alertPopup = $ionicPopup.alert({
                                                template: 'Stadium Not Available. Please Cancel the Challenge'
                                            });

                                            alertPopup.then(function (res) {
                                                $state.go("app.homepage");
                                            });

                                        })
                                }

                            }, function (error) {
                                var alertPopup = $ionicPopup.show({
                                    title: 'Error',
                                    template: 'Stadium Not Available. Please Cancel the Challenge'
                                });

                                alertPopup.then(function (res) {
                                    $state.go("app.homepage");
                                });
                            })

                        }

                        else {
                            var alertPopup = $ionicPopup.show({
                                title: 'Error',
                                template: 'Challenge has been cancelled by the opponent refresh your page'
                            });


                            alertPopup.then(function (res) {
                                $state.go("app.homepage");
                            });

                        }
                    });




                }
            })

        }

    })

