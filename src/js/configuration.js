/**
 * Configuration du moteur de la scene
 */
class Configuration{

    /**
     * Constructeur
     * @param {*} canvas : l'élement html canvas dans lequel les scene seront afficheés
     */
    constructor(canvas){
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(canvas, true);  //  Generate the BABYLON 3D engine
        this.scenes = []; // Contien toutes les scenes en cours d'utilisation
    }

    /**
     * Efface la scene et le moteur
     * crée un nouveau moteur
     */
    createNewEngine(){
        this.scenes[0].dispose(); // effacer la premiere scene
        this.engine.dispose(); // efface le moteur
        this.engine = new BABYLON.Engine(this.canvas, true); // créer un nouveau moteur
    }
}
export { Configuration };