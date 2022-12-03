'use strict';

_.sum = function(arr) { return _.reduce(arr, function(a, b) { return a+b; }, 0); };
_.average = function(arr) { return _.sum(arr) / arr.length; };
_.clamp = function(value, min, max) { return Math.min(max, Math.max(min, value)); };

angular.module('audioVizApp')
  .constant('BLEND_DURATION', 500)
  .constant('SWITCH_FREQUENCY', 500)
  .service('TerrainModel', function(FakeRandom, BLEND_DURATION) {
    function interpolate(a, b, t) { return a + (b-a) * t; }
    function easeOutCubic(a, b, t) { t--; return a + (b-a) * (t*t*t-1); }

    function createModel(options, random_function) {
      options.size = options.size || 64;
      options.smoothness = options.smoothness || 1.0;
      //options.zScale = options.zScale || 200;
      return generateTerrain(options.size, options.size, options.smoothness, random_function);
    }

    function modifyMesh(mesh, size, f) {
      mesh.geometry.verticesNeedUpdate = true;
      var vertices = mesh.geometry.vertices;
      for (var i = 0; i < size; ++i) {
        for (var j = 0; j < size; ++j) {
          vertices[i * size + j].z = f(i, j);
        }
      }
      return mesh;
    }

    var constructor = function(options) {
      options = angular.copy(options);
      var randomGen = FakeRandom.new(),
          model = createModel(options, randomGen.next),
          peaks = getPeaks(model, 5),
          target_model = model,
          blank_mesh = getTerrainMesh(model, 10),
          service = {},
          since_blend_start = 0;

      service.update = function(new_options, delta_time) {
        since_blend_start += delta_time;
        if (new_options.size !== options.size || new_options.smoothness !== options.smoothness) {
          randomGen.seek(0);

          target_model = createModel(new_options, randomGen.next);
          model = target_model;
          peaks = getPeaks(target_model, 5);
          blank_mesh = getTerrainMesh(model, new_options.zScale);
          options = angular.copy(new_options);
        }
      };

      var prevZ = 1;
      service.getMesh = function(zScale) {
        var t = 0.8;
        var newZ = prevZ * (1-t) + t * zScale;
        var a = _.clamp(since_blend_start/BLEND_DURATION, 0, 1);
        modifyMesh(blank_mesh,  model.length, function(i, j) {
          return interpolate(model[i][j], target_model[i][j], a) * newZ;
        });
        prevZ = newZ;
        return blank_mesh;
      };

      service.generateNextTarget = function() {
        randomGen = FakeRandom.new();
        model = target_model;
        target_model = createModel(options, randomGen.next);
        peaks = getPeaks(target_model, 5);
        since_blend_start = 0;
      };

      service.peaks = peaks;
      service.peakPosition = function(peak) {
        var size = model.length;
        var i = peak[0]*size+peak[1];
        window.mesh = blank_mesh;
        console.log(i, size, blank_mesh.geometry.vertices.length, blank_mesh.geometry.vertices[i]);
        return blank_mesh.geometry.vertices[i];
      };

      return service;
    };
    return { new: constructor };
  })

  .controller('Terrain', function($scope, AudioService, TerrainModel, Dancer, SWITCH_FREQUENCY) {
    $scope.Dancer = Dancer;
    var scene, camera, cameraControls, composer, mesh;
    $scope.camera = {
      fov: 45,
      near: 1,
      far: 5000
    };
    $scope.modelOpts = {
      size: 64,
      smoothness: 1.0,
      zScale: 200
    };

    $scope.anim = {
      switchEveryBeat: false
    };

    $scope.scene_init = function(renderer, width, height) {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera($scope.camera.fov, width / height,
        $scope.camera.near, $scope.camera.far);
      camera.position.y = 400;

      // transparently support window resize
      //THREEx.WindowResize.bind(renderer, camera);

      composer = new THREE.EffectComposer( renderer );
      renderer.autoClear = false;
      $scope.model = TerrainModel.new($scope.modelOpts);
      mesh = $scope.model.getMesh($scope.modelOpts.zScale);
      setupLights();
      scene.add(mesh);
      console.log(mesh);
    };

    function setupLights() {
      var ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      //scene.add(ambientLight);

      var mainLight = new THREE.SpotLight(0xffffff, 1.0);
      mainLight.position.set(500, 500, 500);
      mainLight.castShadow = true;
      scene.add(mainLight);

      var auxLight = new THREE.SpotLight(0xffffff, 1.0);
      auxLight.position.set(-300, 500, -400);
      auxLight.castShadow = true;
      scene.add(auxLight);
    }
  
    var sinceLastChange = 0;
    $scope.render = function(renderer, time_delta) {
      var timer = new Date().getTime() * 0.0001;
      camera.position.x = Math.cos(timer) * 800;
      camera.position.z = Math.sin(timer) * 200;
      camera.lookAt(scene.position);

      $scope.model.update($scope.modelOpts, time_delta);
      //scene.remove(mesh);
      var new_mesh = $scope.model.getMesh($scope.modelOpts.zScale);
      if (new_mesh.uuid != mesh.uuid) {
        scene.remove(mesh);
        mesh = new_mesh;
        scene.add(mesh);
      }
      sinceLastChange += time_delta;

      var spectrum = AudioService.spectrum();
      //if (Dancer.is_beat) { 
        //renderer.clear();
        //return;
      //}

      if ((sinceLastChange >= SWITCH_FREQUENCY || $scope.anim.switchEveryBeat) && Dancer.is_beat) {
        console.log('Switching layout', sinceLastChange);
        sinceLastChange = 0;
        $scope.model.generateNextTarget();
      }
      $scope.modelOpts.zScale = Math.min(1000, 1000 * AudioService.volume());

      renderer.clear();
      renderer.render(scene, camera);
    };

    // $scope.$watch('modelOpts.size', function(newOpt) {
    //     $scope.model.update($scope.modelOpts);
    //     scene.remove(mesh);
    //     mesh = $scope.model.getMesh($scope.modelOpts.zScale);
    //     scene.add(mesh);
    // });
  });