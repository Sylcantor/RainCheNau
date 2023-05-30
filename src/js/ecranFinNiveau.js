import { Niveau } from './niveau.js';
import { SceneParDefaut } from "./menu.js";
/**
 * La scene de présentation du playground de babylon.js
 */
class FinLvl {

    /**
     * Constructeur
     * @param {*} configuration : configuration du projet
     */
    constructor(configuration, difficulte, joueur, labelNiveau, vague, etat) {
        this.configuration = configuration;
        this.scene = new BABYLON.Scene(configuration.engine);  //  Creates a basic Babylon Scene object
        this.configuration.scenes.push(this.scene)// Mettre la scene en 1er dans la liste

        this.difficulte = difficulte;
        this.joueur = joueur;
        this.joueur.nombreBase = 1;
        this.labelNiveau = labelNiveau;
        this.etat= etat;
        this.vague = vague;

        this.configureAssetManager();  //  Configure la scene et affiche le rendu à interval réguliers

    }

    /**
     * Configurer tout les eléménts de la scene et recharger régulierement le rendu scene
     */
    configureAssetManager() {

        //console.log(this.configuration)
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
        this.creerSkybox();
        this.creerCamera();
        this.creerLumiere();
        this.creerInterface();

    }


    /**
     * Creer la skybox
     */
    creerSkybox() {
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;

        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("ressources/images/black_sb/", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    }

    /**
     * Créer la camera (obligatoire dans toutes les scenes)
     */
    creerCamera() {
        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
    }


    /**
     * Créer la lumiere
     */
    creerLumiere() {
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
    }


    /**
     * Créer l'interface graphique
     */
    creerInterface() {
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        let btnJouer = this.CreerBtn("N_suiv", "Niveau suivant");
        let btnQuitter = this.CreerBtn("to_Menu", "Quitter");

        btnQuitter.left = "150px"

        btnJouer.onPointerUpObservable.add(() => {
            this.configuration.createNewEngine();
            new Niveau(this.configuration, this.difficulte + (0.2*(this.vague+1)) , this.joueur, this.labelNiveau+1);

        });
        btnJouer.isEnabled = this.etat;

        btnQuitter.onPointerUpObservable.add(() => {
            this.configuration.createNewEngine();
            new SceneParDefaut(this.configuration);

        });


        advancedTexture.addControl(btnJouer);
        advancedTexture.addControl(btnQuitter);
    }

    CreerBtn(nom, texte){
        var btn = BABYLON.GUI.Button.CreateSimpleButton(nom,texte);
        btn.width = "150px";
        btn.height = "40px";
        btn.color = "white";
        btn.cornerRadius = 20;
        btn.background = "blue";

        return btn
    }


}
export { FinLvl };