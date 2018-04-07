
angular.module('football.controllers')

    .controller('LeaderboardController', function ($scope, $timeout, LeaderBoardStore, $state, $ionicPopup, $ionicLoading, $ionicPopover) {

        $scope.notloaded = true;
        $scope.limit = 10;
        $scope.limitfinished = false;
        $scope.rankedteams = [];

        $scope.goteamprofile = function (id) {
            if (id !== null || id == '' || id === undefined) {
                $state.go("app.teamview",
                    {
                        teamid: id
                    })
            }

        }

        $scope.refreshpage = function (limit) {

            LeaderBoardStore.GetLeaderboard(limit, function (leagues) {

                console.log(leagues);
                $scope.notloaded = false;
                $scope.rankedteams = leagues;

            
                $scope.$broadcast('scroll.infiniteScrollComplete');

                if ($scope.rankedteams.length < limit) {
                    $scope.limitfinished = false;
                }
                else
                {
                    $scope.limitfinished = true;
                }

            })
        }

        $scope.loadMore = function () {

                $scope.limit += 10;
                $scope.refreshpage($scope.limit);
            

        }

        $scope.refreshpage($scope.limit);

    })

