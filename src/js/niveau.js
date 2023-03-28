class Niveau {
    constructor(configuration) {
      this.configuration = configuration;
      this.tailleSkybox = 1000;
      this.scene = new BABYLON.Scene(configuration.engine);
      this.configuration.scenes.push(this.scene);
      this.configureAssetManager();
    }
  
    configureAssetManager() {
      this.createElementsScene();
      this.registerRenderLoop();
    }
  
    createElementsScene() {
      this.camera = this.createCamera();
      this.createLight();
      this.createSkybox();
      this.createGround();
      this.createCurveBetweenCubes();
    }

    registerRenderLoop() {
        this.configuration.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
  
    createCamera() {
      const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 100, 0), this.scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      this.setOrthographicCamera(camera);
      this.setupCameraControls(camera);
      return camera;
    }
  
    setOrthographicCamera(camera) {
      camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
      let distance = 20;
      let aspect = this.scene.getEngine().getRenderingCanvasClientRect().height / this.scene.getEngine().getRenderingCanvasClientRect().width;
      camera.orthoLeft = -distance / 2;
      camera.orthoRight = distance / 2;
      distance = distance * aspect;
      camera.orthoBottom = camera.orthoLeft * aspect;
      camera.orthoTop = camera.orthoRight * aspect;
    }
  
    setupCameraControls(camera) {
      var inputMap = {};
      this.scene.actionManager = new BABYLON.ActionManager(this.scene);
      this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        console.log(inputMap)
      }));
      this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        console.log(inputMap)
      }));
      this.scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
          case BABYLON.PointerEventTypes.POINTERWHEEL:
            this.handleCameraZoom(pointerInfo, camera);
            break;
        }
      });
      this.scene.onBeforeRenderObservable.add(() => {
        this.handleCameraMovement(inputMap, camera);
      });
    }
  
    handleCameraZoom(pointerInfo, camera) {
      const delta = pointerInfo.event.deltaY > 0 ? 1 : -1;
      const distance = camera.orthoRight - camera.orthoLeft;
      const newDistance = distance + delta * 0.1;
      const aspect = this.scene.getEngine().getRenderingCanvasClientRect().height / this.scene.getEngine().getRenderingCanvasClientRect().width;
      camera.orthoLeft = -newDistance / 2;
      camera.orthoRight = newDistance / 2;
      camera.orthoBottom = camera.orthoLeft * aspect;
      camera.orthoTop = camera.orthoRight * aspect;
    }
  
    handleCameraMovement(inputMap, camera) {
      if (inputMap["ArrowUp"]) {
        camera.position.z += 0.1;
      }
      if (inputMap["ArrowDown"]) {
        camera.position.z -= 0.1;
      }
      if (inputMap["ArrowLeft"]) {
        camera.position.x -= 0.1;
      }
      if (inputMap["ArrowRight"]) {
        camera.position.x += 0.1;
      }
    }

    createLight() {
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
    }
        
    createSkybox() {
        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: this.tailleSkybox }, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("ressources/images/black_sb/", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    }

    
    // Création de la courbe
    createSpline() {
        const scene = this.scene;
        const pointLigne = [
            new BABYLON.Vector3(-2, 0, -2),
            new BABYLON.Vector3(-2, 0, 2),
            new BABYLON.Vector3(2, 0, 2),
            new BABYLON.Vector3(2, 0, -2)
        ];
        const spline = BABYLON.Curve3.CreateCatmullRomSpline(pointLigne, 10, false);
        const splinePoints = spline.getPoints();
        const ligne = BABYLON.MeshBuilder.CreateLines("line", {points : splinePoints}, scene);
        ligne.color = BABYLON.Color3.Magenta();
        return {spline, splinePoints};
    }

    // Création des cubes
   createCubes(splinePoints) {
        const scene = this.scene;
        const cube1 = BABYLON.MeshBuilder.CreateBox("cube1", { size: 0.5 }, scene);
        cube1.position.copyFrom(splinePoints[0]);
        cube1.material = new BABYLON.StandardMaterial("cube1Mat", scene);
        cube1.material.diffuseColor = BABYLON.Color3.Green();
        const cube2 = BABYLON.MeshBuilder.CreateBox("cube2", { size: 0.5 }, scene);
        cube2.position.copyFrom(splinePoints[splinePoints.length - 1]);
        cube2.material = new BABYLON.StandardMaterial("cube2Mat", scene);
        cube2.material.diffuseColor = BABYLON.Color3.Green();
        return [cube1, cube2];
    }

    // Création de l'animation
   createCubeAnimation(cube) {
        const scene = this.scene;
        const animation = new BABYLON.Animation("cubeAnimation", "rotation", 10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const keyFrames = [];
        for (let i = 0; i < 360; i += 5) {
            const angle = BABYLON.Tools.ToRadians(i);
            const x = Math.cos(angle) * 1;
            const y = Math.sin(angle) * 1;
            const z = Math.sin(angle) * 1;
            keyFrames.push({
                frame: i,
                value: new BABYLON.Vector3(x, y, z)
            });
        }
        animation.setKeys(keyFrames);
        cube.animations.push(animation);
        scene.beginAnimation(cube, 0, 360, true);
    }

    createSpheres(spline, splinePoints) {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const sphere = this.createSphere(splinePoints[0], i * 30);
                this.createSphereAnimation(sphere, splinePoints);
            }, i * 30);
        }
    }
      
    createSphere(position, delay) {
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, this.scene);
        sphere.position.copyFrom(position);
        sphere.position.y += 0.1;
        sphere.material = new BABYLON.StandardMaterial("sphereMat", this.scene);
        sphere.material.diffuseColor = BABYLON.Color3.Yellow();
    
        // Ajoute un délai pour que chaque sphère commence à se déplacer à un moment différent
        setTimeout(() => {
            sphere.isVisible = true;
        }, delay);
    
        return sphere;
    }
    
    createSphereAnimation(sphere, splinePoints) {
        console.log(splinePoints);
        console.log(sphere);
        const animation = new BABYLON.Animation("sphereAnimation", "position", 15, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    
        // Crée une animation de déplacement le long de la courbe
        const keyFrames = [];
        splinePoints.forEach((point, i) => {
          keyFrames.push({
              frame: i,
              value: point,
          });
        });
        animation.setKeys(keyFrames);
    
        sphere.animations.push(animation);
        this.scene.beginAnimation(sphere, 0, 100, true);
    }
    
      
  

    // Fonction principale
    createCurveBetweenCubes(scene){
        const {spline, splinePoints} = this.createSpline();
        const [cube1, cube2] = this.createCubes(splinePoints);
        this.createCubeAnimation(cube1);
        this.createCubeAnimation(cube2);
        this.createSpheres(spline, splinePoints);
    }
    
    createGround() {
         /* Le sol pour les tests et positionner les futurs objets de manières plus précises

        const ground = BABYLON.MeshBuilder.CreateGround("ground", {height: 10, width: 10, subdivisions: 4});
        //position
        ground.position.y = 0;
        ground.position.x = 0;
        ground.position.z = 0;

        */
    }

}
export { Niveau };