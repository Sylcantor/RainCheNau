import { BaseAbstract } from "./baseAbstract.js";

/**
 * Gestion et affichage de la base principale
 */
class BaseSecondaire extends BaseAbstract{
    /**
    * Constructeur
    * @param {BABYLON.Mesh} baseMesh Messh associé à la base
    */
    constructor(baseMesh) {
        //Statistiques
        super(baseMesh, 10, 1, 2, 2);

    }

    //maj des stat en fonction de la difficulté du niveau
    //maj des stat chaque tours
    //emplacements
    //détecton des unités
}
export { BaseSecondaire };