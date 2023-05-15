/**
 * Porté d'une base ou d'une unité
 */
class Portee {

    /**
     * Constructeur
     * @param {int} portee portée a appliquer au mesh
     * @param {int} position position de la porté (centre de la base ou de l'unité à laquelle est lié cette portés)
     * @param {string} portee nom de la porté
     */
    constructor(portee, position, nom) {

        this.porteeMesh = BABYLON.MeshBuilder.CreateCylinder("portee_"+nom, { diameter : portee, height: 0.01, tessellation: 32});
        this.porteeMesh.position = position;

        this.porteeMesh.actionManager = new BABYLON.ActionManager();
        this.porteeMesh.visibility = 0;
        

        this.porteeMesh.estportee = true; // sert a différencier une porté d'une base ou d'une unité
    }

}
export { Portee };