import { UniteAbastract } from "./uniteAbstract.js";

/**
 * Gestion et affichage de la base principale
 */
class UniteDefaut extends UniteAbastract{
    /**
    * Constructeur
    * @param {int} joueur le joueur controlant l'unité
    * @param {BABYLON.Mesh} baseMesh Mesh associé à l'unité
    */
    constructor(baseMesh, joueur) {
        //Statistiques
        super(baseMesh, joueur , 1, 1, 1, 1, 1);
    }
}
export { UniteDefaut };