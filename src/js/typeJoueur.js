/**
 * Gestion des types de joueur
 */
class TypeJoueur {

    //Deffinition des ennums
    static Joueur = new TypeJoueur("joueur");
    static Ia = new TypeJoueur("ia");

    /**
     * Constructeur
     * @param {string} type : type de joueur (ia ou personne)
     */
    constructor(type) {
        this.type = type;
    }
}
export { TypeJoueur };