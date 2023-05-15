import { TypeJoueur } from "./typeJoueur.js";

/**
 * Gestion de joueur
 */
class Joueur {
    /**
     * Constructeur
     * @param {TypeJoueur} type : type de joueur (type d'ia ou joueur humain)
     */
    constructor(type) {
        this.type = type;

        this.couleur = (this.type == TypeJoueur.Joueur) ? BABYLON.Color3.Green() : BABYLON.Color3.Random();
        /**
         * @Todo : empecher le cas : random = vert (pas urgent)
         */

    }
}
export { Joueur };