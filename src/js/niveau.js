import { Chemin } from "./chemin.js";
import { BasePrincipale } from "./basesPrincipale.js";
import { BaseSecondaire } from "./baseSecondaire.js";
import { InterfaceNiveau } from "./interfaceNiveau.js";

/**
 * Affichage et gestion d'un niveau
 */
class Niveau {

  /**
   * Constructeur
   * @param {*} configuration 
   * @param {int} difficulte : la difficulte du niveau à créer
   */
  constructor(configuration, difficulte) {
    this.configuration = configuration;
    this.difficulte = difficulte;
    this.tailleSkybox = 1000;
    this.nombreBasesSecondaire = difficulte + 1;

    this.labelNiveau = 1;
    this.nombreVagueRestante = 2;
    this.nombreVague = 3;
    this.temps = 4;
    this.monnaie = 5;

    // Pas de code apres ça
    this.scene = new BABYLON.Scene(configuration.engine);
    // Interface graphique
    this.scene.interface = new InterfaceNiveau(this.labelNiveau, this.nombreVague, this.nombreVagueRestante, this.monnaie);

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

    // creer le chemin
    this.chemin = new Chemin(this.nombreBasesSecondaire);
    let splinePoints = this.chemin.splinePoints;

    // bases principales
    this.basesPrincipales = this.CreerBasesPrincipales(); //créer les bases principales
    for (const element of this.basesPrincipales) {
      this.scene.beginAnimation(element.baseMesh, 0, 360, true); // animer les bases principales
    }

    // bases secondaires
    this.basesSecondaires = this.CreerBasesSecondaires(splinePoints, this.nombreBasesSecondaire);
    for (const element of this.basesSecondaires) {
      this.scene.beginAnimation(element.baseMesh, 0, 360, true);
    }

    //this.createSpheres(this.chemin.spline, splinePoints);
    this.controleScene();
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
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 300, 0), this.scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    this.setOrthographicCamera(camera);
    this.setupCameraControls(camera);
    //console.log(camera.position);
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
    }));
    this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
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
  * Ajoute des controle pour déplacer la caméra
  * @param {*} inputMap : la map contenant la liste des controles
  * @param {*} camera : La camera a laquele seront attachés les controles
  */
  handleCameraMovement(inputMap, camera) {
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
    this.skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: this.tailleSkybox }, this.scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("ressources/images/black_sb/", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    this.skybox.material = skyboxMaterial;
  }


  /**
   * Création des bases principales
   * @returns un tableau contenant les bases principales en bout de la courbe
   */
  CreerBasesPrincipales() {
    const splinePoints = this.chemin.splinePoints;

    // création de la base principale du joueur
    let cube = BABYLON.MeshBuilder.CreateBox("cube1", { size: 0.5 });
    cube.position = splinePoints[0];
    cube.material = new BABYLON.StandardMaterial("cubeMat");
    cube.material.diffuseColor = BABYLON.Color3.Green(); // à changer quand on modifiera les couleur
    let basePrincipale1 = new BasePrincipale(cube);

    // création de la base princpale de l'ia
    let cube2 = cube.clone("cube 2");
    cube2.position = splinePoints[splinePoints.length - 1];
    cube2.material = cube.material.clone("cubeMat2");
    cube2.material.diffuseColor = BABYLON.Color3.Blue();
    let basePrincipale2 = new BasePrincipale(cube2);

    return [basePrincipale1, basePrincipale2];
  }


  /**
   * @param {*} splinePoints : les points d'une courbe
   * @param {int} nombreBasesSecondaire : le nombre de bases secondaires à placer
   * @returns un tableau contenant les bases secondaires
   * 
   * @todo : detecter les intersections avec la courbe et les autres tour
   */
  CreerBasesSecondaires(splinePoints, nombreBasesSecondaire) {
    let basesSecondaires = [];
    let i = 0;
    const cylindre = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 0.30, diameterTop: 0.25, diameterBottom: 0.25 });// le cube à clonner
    cylindre.material = new BABYLON.StandardMaterial("cylindreMat");// Attention quand au passera au couleurs custom voir la fonction create curbe pour éviter de changer tout les clones
    cylindre.material.diffuseColor = BABYLON.Color3.Blue();

    while (i < nombreBasesSecondaire) {
      let index = Math.floor(Math.random() * splinePoints.length);

      if (index > 20 || index < splinePoints.length - 20) {
        let pointSelectionne = splinePoints[index];
        // placer le centre de la base secondaire suffisament loin de la courbe
        let z = pointSelectionne._z >= 0 ? pointSelectionne._z - 1 : pointSelectionne._z + 1;
        let pointModifie = new BABYLON.Vector3(pointSelectionne._x, 0, z);
        // clonner le cylyndre modèle et modifier la position
        let clone = cylindre.clone("baseSecondaire");
        clone.position = pointModifie;
        // TODO detecter les intersections avec la courbe et les autres tour et deplacer le cylindre en conséquence
        basesSecondaires.push(new BaseSecondaire(clone));
        i++;
      }
    }
    cylindre.dispose();
    return basesSecondaires;
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
    const animation = new BABYLON.Animation("sphereAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

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
    this.scene.beginAnimation(sphere, 0, 1000, true);
  }

  controleScene() {

    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:

          // Cacher les portées des bases
          for (const element of this.basesPrincipales) {element.torus.setEnabled(false);}
          for (const element of this.basesSecondaires) {element.torus.setEnabled(false);}
      }
    });
  }

}
export { Niveau };