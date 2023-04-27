import { Niveau } from './niveau.js';
/**
 * La scene de présentation du playground de babylon.js
 */
class SceneParDefaut {

    /**
     * Constructeur
     * @param {*} configuration : configuration du projet
     */
    constructor(configuration) {
        this.configuration = configuration;
        this.scene = new BABYLON.Scene(configuration.engine);  //  Creates a basic Babylon Scene object
        this.configuration.scenes.push(this.scene)// Mettre la scene en 1er dans la liste

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

        var btnJouer = BABYLON.GUI.Button.CreateSimpleButton("btnJouer", "jouer");
        btnJouer.width = "150px";
        btnJouer.height = "40px";
        btnJouer.color = "white";
        btnJouer.cornerRadius = 20;
        btnJouer.background = "blue";

        btnJouer.onPointerUpObservable.add(() => {
            this.configuration.createNewEngine();
            new Niveau(this.configuration,0);

        });
        advancedTexture.addControl(btnJouer);
    }


}
export { SceneParDefaut };