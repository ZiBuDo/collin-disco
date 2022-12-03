'use strict';

angular.module('audioVizApp')
  .controller('PlaylistController', function ($scope, PlaylistService) {
    $scope.service = PlaylistService;
    PlaylistService.play();
  });
