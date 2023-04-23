import { BaseAbstract } from "./baseAbstract.js";

/**
 * Gestion et affichage de la base principale
 */
class BaseSecondaire extends BaseAbstract{
    /**
    * Constructeur
    * @param {BABYLON.Mesh} baseMesh Mesh associé à la base
    */
    constructor(baseMesh, joueur) {
        //Statistiques
        super(baseMesh, joueur, 10, 1, 2, 2);

    }

    //maj des stat en fonction de la difficulté du niveau
    //maj des stat chaque tours
    //emplacements
    //détecton des unités
}
export { BaseSecondaire };