import { BaseAbstract } from "./baseAbstract.js";

/**
 * Gestion et affichage de la base principale
 */
class BasePrincipale extends BaseAbstract{
    /**
    * Constructeur
    * @param {BABYLON.Mesh} baseMesh Messh associé à la base
    */
    constructor(baseMesh) {
        //Statistiques
        super(baseMesh, 25, 2, 1, 1);

    }
    //maj des stat en fonction de la difficulté du niveau
    //maj des stat chaque tours
    //emplacements
    //détecton des unités
}
export { BasePrincipale };