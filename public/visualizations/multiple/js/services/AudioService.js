'use strict';

angular.module('audioVizApp')
  .service('AudioService', function (PlaylistService) {

    return {
      spectrum: function() {
        var sound = PlaylistService.sound();
        if (sound) {
          return _.map(sound.dataArray, function(el) { return parseFloat(el, 10); });
        } else {
          return [];
        }
      },
      waveform: function() {
        var sound = PlaylistService.sound();
        if (sound) {
          return sound.dataArray;
        } else {
          return [];
        }
      },
      volume: function() {
        var sound = PlaylistService.sound();
        return 0.5;
        return Math.random() * 100;
        return sound ? (sound.peakData.left + sound.peakData.right) / 2 : 0;
      }
    };
  });