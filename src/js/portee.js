class Portee {

    /**
     * Constructeur
     * @param {int} portee portée a appliquer au mesh
     */
    constructor(portee, position) {
        this.porteeMesh = BABYLON.MeshBuilder.CreateCylinder("portee", { diameter : portee, height: 0.01, tessellation: 32});
        this.porteeMesh.position = position;
        this.porteeMesh.setEnabled(false);

        this.porteeMesh.estportee = true;
    }

}
export { Portee };