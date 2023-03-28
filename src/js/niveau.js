/**
 * La scene de présentation du playground de babylon.js
 */
class Niveau {

    /**
     * Constructeur
     * @param {*} configuration : configuration du projet
     */
    constructor(configuration) {
        this.configuration = configuration;
        this.tailleSkybox = 1000;

        this.scene = new BABYLON.Scene(configuration.engine);  //  Creates a basic Babylon Scene object
        this.configuration.scenes.push(this.scene)// Mettre la scene en 1er dans la liste

        this.configureAssetManager();  //  Configure la scene et afficher le rendu à interval réguliers

    }


    /**
     * Configurer tout les eléménts de la scene et recharger régulierement le rendu scene
     */
    configureAssetManager() {

        var instance = this;

        instance.creerElementsScene();  //  Call the createScene function

        instance.configuration.engine.runRenderLoop(function () {  //  Register a render loop to repeatedly render the scene
            instance.renderScene()
        });
    }


    /**
     * charger le rendu de la scene
     */
    renderScene() {
        this.scene.render();
    }


    /**
     * Créer les elements de la scene
     */
    creerElementsScene() {
        this.creerCamera();
        this.creerLumiere();
        this.creerSkybox();

        this.creerSol();
        this.creerCourbe();
        //this.creerSphere();
    }

    /**
     * Créer la camera (obligatoire dans toutes les scenes)
    */
    creerCamera() {
        // Camera simple
        const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 100, 0), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
    
        this.setOrthographicCamera(camera);
        this.setupCameraControls(camera);
    
        return camera;
    }

    /**
     * Configurer la camera orthographique
     * @param {*} camera
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
     * Configurer les controles de la camera
     * @param {*} camera
    */
    setupCameraControls(camera) {
        var inputMap = {};
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
    
        // Gestion des événements clavier
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            console.log(inputMap)
        }));
    
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            console.log(inputMap)
        }));
    
        // Gestion de l'événement de la molette de la souris
        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERWHEEL:
                    // On augmente ou diminue la distance de la caméra en fonction de la direction de la molette
                    const delta = pointerInfo.event.deltaY > 0 ? 1 : -1;
                    const distance = camera.orthoRight - camera.orthoLeft;
                    const newDistance = distance + delta * 0.1;
                    const aspect = this.scene.getEngine().getRenderingCanvasClientRect().height / this.scene.getEngine().getRenderingCanvasClientRect().width;
                    camera.orthoLeft = -newDistance / 2;
                    camera.orthoRight = newDistance / 2;
                    camera.orthoBottom = camera.orthoLeft * aspect;
                    camera.orthoTop = camera.orthoRight * aspect;
                    break;
            }
        });
    
        // Gestion de l'événement de la position de la caméra
        this.scene.onBeforeRenderObservable.add(function () {
            if (inputMap["ArrowUp"]) {
                camera.position.z -= 0.1;
            }
            if (inputMap["ArrowDown"]) {
                camera.position.z += 0.1;
            }
            if (inputMap["ArrowLeft"]) {
                camera.position.x += 0.1;
            }
            if (inputMap["ArrowRight"]) {
                camera.position.x -= 0.1;
            }
        });
    }

    /**
     * Créer la lumiere
     */
    creerLumiere() {
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
    }


    /**
     * Creer la skybox noire
     */
    creerSkybox() {
        // Skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: this.tailleSkybox }, this.scene);

        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;

        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("ressources/images/black_sb/", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    }


    /**
     * Créer la sphere
     */
    creerSphere() {
        // Our built-in 'sphere' shape.
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, this.scene);
        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;
    }




    /**
     * Créer la courbe
     */
    creerCourbe() {
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

        // Creation d'une courbe qui sera le chamin entre 2 bases principales

        //ligne simple
        //const ligne2 = BABYLON.MeshBuilder.CreateLines("lines", {points: pointLigne});
        //ligne2.color = BABYLON.Color3.Blue();

        //courbe
        //https://playground.babylonjs.com/#1AU0M4
        //var catmullRom = BABYLON.Curve3.CreateCatmullRomSpline(pointLigne, 60);
        //https://playground.babylonjs.com/#82UWMI#4
        const spline = BABYLON.Curve3.CreateCatmullRomSpline(pointLigne, 10, false);
        const splinePoints = spline.getPoints();

        const ligne = BABYLON.MeshBuilder.CreateLines("line", {points : splinePoints}, this.scene);
        ligne.color = BABYLON.Color3.Magenta();


    }

    /**
     * Créer sol 
    */
    creerSol() {
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {height: 10, width: 10, subdivisions: 4});
        //position
        ground.position.y = 0;
        ground.position.x = 0;
        ground.position.z = 0;

        //black wall
        const blackWall = new BABYLON.StandardMaterial("blackWall", this.scene);
        blackWall.diffuseColor = new BABYLON.Color3(0, 0, 0);
        ground.material = blackWall;

        

    }


}
export { Niveau };