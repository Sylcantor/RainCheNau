import { UniteAbastract } from "./uniteAbstract.js";

/**
 * Gestion et affichage de la base principale
 */
class UniteDefaut extends UniteAbastract{
    /**
    * Constructeur
    * @param {int} joueur le joueur controlant l'unité
    * @param {BABYLON.Mesh} uniteMesh Mesh associé à l'unité
    */
    constructor(uniteMesh, joueur, baseAViser) {
        //Statistiques
        super(uniteMesh, joueur , 1, 1, 1, 1, 1, baseAViser);
    }
}
export { UniteDefaut };