class UniteAbastract {

    /**
     * Constructeur
     * @param {BABYLON.Mesh} uniteMesh Messh associé à l'unité
     * @param {int} joueur le joueur controlant l'unité
     * @param {int} pv points de vie de l'unité
     * @param {int} attaque attaque de l'unité
     * @param {int} portee portée de l'unité
     * @param {int} vitesseAttaque vitesse d'attaque de l'unité
     * @param {int} vitesse vitesse de l'unité
     */
    constructor(uniteMesh, joueur , pv, attaque, portee, vitesseAttaque, vitesse) {
        this.joueur = joueur;
        
        this.uniteMesh = uniteMesh;
        this.uniteMesh.material.emissiveColor = this.joueur.couleur;

        this.pvmax = pv;
        this.pv = pv;
        this.attaque = attaque;
        this.portee = portee;
        this.vitesseAttaque = vitesseAttaque;
        this.vitesse = vitesse; // viesse max = 10, à prendre en compte lors des amélioration, si il est atteint bonus sur les autres stats ?


        this.porteeMesh = BABYLON.MeshBuilder.CreateCylinder("portee", { diameter : portee, height: 0.01, tessellation: 32});
        this.porteeMesh.position = uniteMesh.position;
        this.porteeMesh.setEnabled(false);


        this.uniteMesh.actionManager = new BABYLON.ActionManager();

    }

}
export { UniteAbastract };