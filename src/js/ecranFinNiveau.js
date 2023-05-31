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
        this.etat = etat;
        this.vague = vague;

        this.configureAssetManager();  //  Configure la scene et affiche le rendu à interval réguliers

    }

    /**
     * Configurer tout les eléménts de la scene et recharger régulierement le rendu scene
     */
    configureAssetManager() {
        let music = new BABYLON.Sound("theme", "ressources/musiques/Sneaky-Snitch.mp3", this.scene, null, { loop: true, autoplay: true });

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

        let texte = (this.etat ? "Vous avez gagné" : "Vous avez perdu")
        let label_Fin = this.CreerLabelEtConteneur("etat", texte);
        label_Fin.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        label_Fin.top = "15px";

        let label_difficulte = this.CreerLabelEtConteneur("score", "la difficulté était de : " + this.difficulte);
        label_difficulte.top = "-50px";

        let label_score = this.CreerLabelEtConteneur("score", "Vous avez planté : " + this.joueur.score + " arbres");

        let btnJouer = BABYLON.GUI.Button.CreateImageOnlyButton("btnJouer", "ressources/images/niveau_suivant.png");
        btnJouer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        btnJouer.width = "250px";
        btnJouer.height = "40px";
        btnJouer.top = "-15px";
        btnJouer.left = "120px";
        btnJouer.onPointerUpObservable.add(() => {
            this.configuration.createNewEngine();
            new Niveau(this.configuration, this.difficulte + (0.2 * (this.vague + 1)), this.joueur, this.labelNiveau + 1);

        });
        btnJouer.isVisible = this.etat;


        let btnQuitter = BABYLON.GUI.Button.CreateImageOnlyButton("btnJouer", "ressources/images/quitter.png");
        btnQuitter.width = "150px";
        btnQuitter.height = "40px";
        btnQuitter.top = "-15px";
        btnQuitter.left = "-100px";
        btnQuitter.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        btnQuitter.onPointerUpObservable.add(() => {
            this.configuration.createNewEngine();
            new SceneParDefaut(this.configuration);

        });

        advancedTexture.addControl(label_score);
        advancedTexture.addControl(label_difficulte);
        advancedTexture.addControl(label_Fin);
        advancedTexture.addControl(btnJouer);
        advancedTexture.addControl(btnQuitter);
    }


    /**
    * Crée un label
    * @param {String} nomLabel : nom du label
    * @param {String} texte : texte du label
    * @returns {BABYLON.GUI.TextBlock} un label
    */
    CreerLabel(nomLabel, texte) {
        var label = new BABYLON.GUI.TextBlock(nomLabel, "");
        label.width = 0.5;
        label.height = "40px";
        label.width = "300px";
        label.color = "white";
        label.text = texte;
        return label;
    }


    /**
     * Crée un conteneur rectangulaire avec un label et le place en haut à gauche
     * @param {String} nomLabel : nom du label
     * @param {String} texte : texte du label
     * @returns {BABYLON.GUI.Rectangle} Le conteneur avec le label associé
     */
    CreerLabelEtConteneur(nomLabel, texte) {
        var label = this.CreerLabel(nomLabel, texte);

        var rectangle = new BABYLON.GUI.Rectangle("conteneur_" + nomLabel);
        rectangle.width = "300px";
        rectangle.height = "40px";

        rectangle.cornerRadius = 10;
        rectangle.color = "black";
        rectangle.thickness = 4;

        rectangle.addControl(label);
        return rectangle;
    }


}
export { FinLvl };