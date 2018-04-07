
angular.module('football.controllers')

  .controller('SettingsController', function ($scope, SMSService, $state, $timeout, BookingStore, $ionicPopup, $ionicLoading) {
    ;

    $scope.nointernet = false;



    $scope.filter = {};
    var notificationRef = firebase.database().ref('/playersinfo/' + firebase.auth().currentUser.uid);
    notificationRef.on('value', function (snapshot) {
      var data = snapshot.val();

      $scope.filter.notification = data.settings.notification;
      $scope.filter.reminder_3hours = data.settings.reminder_3hours;
      $scope.filter.emailVerified = firebase.auth().currentUser.emailVerified;
      $scope.filter.smsVerified = data.isMobileVerified;
    });


    $scope.saveNotificationData = function (value) {
      var userId = firebase.auth().currentUser.uid;
      firebase.database().ref('players/' + userId + '/settings').update({
        notification: value,
        reminder_3hours: value
      });
      firebase.database().ref('playersinfo/' + userId + '/settings').update({
        notification: value,
        reminder_3hours: value
      });
    }

    $scope.saveReminderData = function (value) {
      if (!$scope.filter.notification) {
        $scope.filter.reminder_3hours = false;
        return;
      } else {
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('players/' + userId + '/settings').update({
          reminder_3hours: value
        });
        firebase.database().ref('playersinfo/' + userId + '/settings').update({
          reminder_3hours: value
        });
      }

    }

    setTimeout(() => {
      var connectedRef = firebase.database().ref(".info/connected");
      connectedRef.on("value", function (snap) {
        if (snap.val() === true) {
          $scope.nointernet = false;
        }
        else {
          $ionicLoading.hide();
          $scope.nointernet = true;
        }
      });
    }, 2000)

  })

  .controller('SettingsSmsController', function ($scope, $state, $timeout, BookingStore, $ionicPopup, $ionicLoading) {





  })
