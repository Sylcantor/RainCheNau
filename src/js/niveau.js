import { Chemin } from "./chemin.js";
import { BasePrincipale } from "./basesPrincipale.js";
import { BaseSecondaire } from "./baseSecondaire.js";
import { InterfaceNiveau } from "./interfaceNiveau.js";
import { Joueur } from "./joueur.js";
import { TypeJoueur } from "./typeJoueur.js";
import { Vague } from "./vague.js";

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
    this.joueurs = [new Joueur(TypeJoueur.Joueur), new Joueur(TypeJoueur.Ia)];


    this.scene = new BABYLON.Scene(configuration.engine);
    this.gl = new BABYLON.GlowLayer("glow"); //permet de faire briller les mesh des bases
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

    // bases secondaires
    this.basesSecondaires = this.CreerBasesSecondaires();


    this.effeScene();
    this.controlScene()
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
   * @returns {BasePrincipale} un tableau contenant les bases principales en bout de la courbe
   */
  CreerBasesPrincipales() {
    const splinePoints = this.chemin.splinePoints;

    // création de la base principale du joueur
    let cube = BABYLON.MeshBuilder.CreateBox("BP1", { size: 0.5 });
    cube.position = splinePoints[0];
    cube.material = new BABYLON.StandardMaterial("MatBP1");
    let basePrincipale1 = new BasePrincipale(cube, this.joueurs[0]);

    // création de la base princpale de l'ia
    let cube2 = cube.clone("BP1");
    cube2.material = cube.material.clone("MatBP2");
    cube2.position = splinePoints[splinePoints.length - 1];
    let basePrincipale2 = new BasePrincipale(cube2, this.joueurs[1]);

    return [basePrincipale1, basePrincipale2];
  }


  /**
   * @returns {BaseSecondaire[]} un tableau contenant les bases secondaires
   */
  CreerBasesSecondaires() {
    let basesSecondaires = [];
    let i = 0;
    let cylindre = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 0.20, diameterTop: 0.25, diameterBottom: 0.25 });// le cube à clonner
    cylindre.material = new BABYLON.StandardMaterial("MatBS1");

    // points utilisables
    let pointsDispos = this.chemin.splinePoints.slice();
    pointsDispos.splice(0, 10);
    pointsDispos.splice(-10, 10);
    while (i < this.nombreBasesSecondaire) {

      let index = Math.floor(Math.random() * pointsDispos.length);
      let pointSelectionne = pointsDispos[index];

      // placer le centre de la base secondaire suffisament loin de la courbe
      let z = pointSelectionne._z >= 0 ? pointSelectionne._z - 0.5 : pointSelectionne._z + 0.5;
      let pointModifie = new BABYLON.Vector3(pointSelectionne._x, 0, z);

      // clonner le cylyndre modèle et modifier la position
      let clone = cylindre.clone("baseSecondaire" + i);
      clone.material = new BABYLON.StandardMaterial("MatBS" + i);
      clone.position = pointModifie;

      // retirer les points trop proches de la nouvelle base
      let index5Avant = (index - 5 < 0) ? 0 : index - 5;
      pointsDispos.splice(index5Avant, 10); // enlever pts avant

      basesSecondaires.push(new BaseSecondaire(clone, this.joueurs[1]));
      i++;
    }
    cylindre.dispose();
    return basesSecondaires;
  }




  /**
   * Ajoutes des effets au elements de la scene
   */
  effeScene() {
    // annimation de toutes les bases
    for (const element of this.basesPrincipales.concat(this.basesSecondaires)) {
      this.scene.beginAnimation(element.cibleMesh, 0, 360, true);
      this.gl.addIncludedOnlyMesh(element.cibleMesh);
    }

    // Cacher/afficher les portées des bases
    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          for (const element of this.basesPrincipales.concat(this.basesSecondaires)) {
            element.torus.setEnabled(false);
          }
      }
    });
  }

  /**
  * ajoutes des controles à la scene
  */
  controlScene() {
    //Bouton attaquer
    let panel = this.scene.interface.advancedTexture.getDescendants(true, control => control.name === 'BarreInfo')[0];
    panel.getChildByName("btnLancerVague").onPointerUpObservable.add(() => this.CreerVague());
  }

  /**
   * Creation, lancement d'une vague et mise en place de la défense des bases
   */
  CreerVague() {
    let temps = 1000; /** @Todo A modifier quand le timer sera mis en place */

    //modifier la cible
    let vague = new Vague(this.joueurs[0], this.basesPrincipales[0], [this.basesSecondaires[0],this.basesPrincipales[1]], this.chemin); // ne marche que pour une partie avec 1 joueur et un non joueur
    this.lancerVague(temps, vague);


    /** @todo : defensives cibler unités */

    

    for (const base of this.basesSecondaires.concat(this.basesPrincipales[1])){
      this.ciblerUnites(base, vague);
    }

  }

  /**
   * Lance une vague
   * @param {int} temps temps avant la fin de la vague
   * @param {*} vague la  vague à lancer
   */
  lancerVague(temps, vague) {
    for (const element of vague.unites) {
      let animUnite = this.scene.beginAnimation(element.cibleMesh, 0, temps, false);
      let animPortee = this.scene.beginAnimation(element.portee.porteeMesh, 0, temps, false);
      element.animationUnite = animUnite;
      element.animPortee = animPortee;
    }
  }


  ciblerUnites(base, vague){
    for (const unite of vague.unites) {
      if(base.joueur != unite.joueur){
        //console.log('passif', unite);
        //console.log()
        base.ViserCible(unite);
      }
    }
  }

}
export { Niveau };