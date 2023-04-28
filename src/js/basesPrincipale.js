import { BaseAbstract } from "./baseAbstract.js";

/**
 * Gestion et affichage de la base principale
 */
class BasePrincipale extends BaseAbstract{
    /**
    * Constructeur
    * @param {BABYLON.Mesh} baseMesh Mesh associé à la base
    */
    constructor(baseMesh, joueur) {
        //Statistiques
        super(baseMesh,joueur , 25, 2, 2, 1);
        this.baseMesh.showBoundingBox = true;
    }
    //maj des stat en fonction de la difficulté du niveau
    //maj des stat chaque tours
    //emplacements
    //détecton des unités
}
export { BasePrincipale };