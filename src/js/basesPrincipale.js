import { BaseAbstract } from "./baseAbstract.js";

/**
 * Gestion et affichage de la base principale
 */
class BasePrincipale extends BaseAbstract{
    /**
    * Constructeur
    * @param {BABYLON.Mesh} cibleMesh Mesh associé à la base
    */
    constructor(cibleMesh, joueur) {
        //Statistiques
        super(cibleMesh, joueur , 25, 2, 2.5, 1);
        this.cibleMesh.showBoundingBox = true;
    }
    //maj des stat en fonction de la difficulté du niveau
    //maj des stat chaque tours
    //emplacements
}
export { BasePrincipale };