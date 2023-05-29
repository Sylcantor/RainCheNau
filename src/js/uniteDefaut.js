import { Joueur } from "./joueur.js";
import { UniteAbastract } from "./uniteAbstract.js";

/**
 * Gestion et affichage de la base principale
 */
class UniteDefaut extends UniteAbastract{
    /**
    * Constructeur
    * @param {Joueur} joueur le joueur controlant l'unité
    * @param {BABYLON.Mesh} uniteMesh Mesh associé à l'unité
    */
    constructor(uniteMesh, joueur) {
        //Statistiques

        super(uniteMesh, joueur , 1 + joueur.bonusPV, 1 + joueur.bonusATK, 1, 1, 1);
    }
}
export { UniteDefaut };