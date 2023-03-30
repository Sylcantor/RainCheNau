class Niveau {

      /**
       * Constructeur
       * @param {*} configuration 
       */
      constructor(configuration) {
      this.configuration = configuration;
      this.tailleSkybox = 1000;
      this.scene = new BABYLON.Scene(configuration.engine);
      this.configuration.scenes.push(this.scene);
      this.configureAssetManager();
    }
  
    /**
     * Configurer tout les eléménts de la scene et recharger régulierement le rendu scene
     */
    configureAssetManager() {
      this.createElementsScene();
      this.registerRenderLoop();
    }
  
    /**
     * creation de la scene
     */
    createElementsScene() {
      this.camera = this.createCamera();
      this.createLight();
      this.createSkybox();
      this.createGround();
      this.createCurveBetweenCubes();
    }

    /**
     * Boucle de rendu
     */
    registerRenderLoop() {
        this.configuration.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
  
    /**
     * Création de la caméra
     * @returns la caméra
     */
    createCamera() {
      const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 100, 0), this.scene);
      camera.setTarget(BABYLON.Vector3.Zero());
      this.setOrthographicCamera(camera);
      this.setupCameraControls(camera);
      return camera;
    }
  
    /**
     * Modification de la camera pour la rendre othographique
     * @param {*} camera la camera 
     */
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
  
    /**
     * Ajout des controles à la camera
     * @param {*} camera la camera ou attacher les controles
     */
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
  
    /**
     * Ajout d'un zoom sur la camera
     * @param {*} pointerInfo information sur le pointeur
     * @param {*} camera la cemara ou apppliquer le zoom
     */
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


    /**
    * Ajoutedes controle pour déplacer la caméra
    * @param {*} inputMap : la map contenant la liste des controles
    * @param {*} camera : La camera a laquele seront attachés les controles
    */
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

    /**
     * Création de la lumiere
     */
    createLight() {
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
    }
        
    /**
     * Création de la skybox
     */
    createSkybox() {
        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: this.tailleSkybox }, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("ressources/images/black_sb/", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    }

    /**
     * Création d'une courbe aleatoire
     * @returns  la courbe, les points composants la courbe 
     */
        createSpline() {
          const scene = this.scene;

          //https://playground.babylonjs.com/#MZ7QRG#6
          //https://playground.babylonjs.com/#MZ7QRG#10
          //Création d'une ligne avec un chemin aléatoire
          let maximumx = 3;
          let maximumz = 5;
          let x = 0;
          let z = 0;
          let pointLigne = [];

          for (let i = 0; i < 10; i++) {
            x += Math.random() * maximumx;
            z += Math.random() * maximumz;
            z -= Math.random() * maximumz;

            pointLigne.push(new BABYLON.Vector3(x, 0, z));
          }


          const spline = BABYLON.Curve3.CreateCatmullRomSpline(pointLigne, 10, false);
          const splinePoints = spline.getPoints();

          const ligne = BABYLON.MeshBuilder.CreateLines("line", {points : splinePoints}, scene);
          ligne.color = BABYLON.Color3.Magenta();
          console.log("rest");
          return {spline, splinePoints};
      }

    /**
     * Création des cubes
     * @param {*} splinePoints les points de la courbe
     * @returns un tableau cotenant les cubes en bout de la courbe
     */
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

    /** 
     * Création de l'animation
     * @param {*} cube le cube à animer
     */
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

    /**
     * création des spheres qui se déplacent sur la courbe
     * @param {*} spline la courbe
     * @param {*} splinePoints Les points qui composent lacourbe
     */
    createSpheres(spline, splinePoints) {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const sphere = this.createSphere(splinePoints[0], i * 30);
                this.createSphereAnimation(sphere, splinePoints);
            }, i * 30);
        }
    }
      
    /**
     * Creation d'une sphere
     * @param {*} position position de départ  dela  sphere
     * @param {*} delay delai avant le départ entre chaque sphere
     * @returns 
     */
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
    
    /**
     * Creation des animation de la sphere
     * @param {*} sphere la sphere à animer
     * @param {*} splinePoints les points de la courbe
     */
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
    /**
     * Creation de la courbe 
     * @param {*} scene la scene ou créer la courbe
     */
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