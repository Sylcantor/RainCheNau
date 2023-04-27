/**
 * Porté d'une base ou d'une unité
 */
class Portee {

    /**
     * Constructeur
     * @param {int} portee portée a appliquer au mesh
     * @param {int} portee position de la porté (centre de la base ou de l'unité à laquelle est lié cette portés)
     */
    constructor(portee, position) {
        this.porteeMesh = BABYLON.MeshBuilder.CreateCylinder("portee", { diameter : portee, height: 0.01, tessellation: 32});
        this.porteeMesh.position = position;
        this.porteeMesh.setEnabled(false);

        this.porteeMesh.estportee = true; // sert a différencier une porté d'une base ou d'une unité
    }

}
export { Portee };