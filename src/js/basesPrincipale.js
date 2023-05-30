import { BaseAbstract } from "./baseAbstract.js";

/**
 * Gestion et affichage de la base principale
 */
class BasePrincipale extends BaseAbstract {
    /**
    * Constructeur
    * @param {BABYLON.Mesh} cibleMesh Mesh associé à la base
    */
    constructor(cibleMesh, joueur, difficulte) {
        //Statistiques
        super(cibleMesh, joueur, 25*(1+0.25*difficulte), 2*(1+0.25*difficulte), 2.5*(1+0.25*difficulte), 1*(1+0.25*difficulte));

        
        this.cibleMesh.showBoundingBox = true;

        this.observerEtatBP = new BABYLON.Observable();
    }

    /**
    * action à la mort d'une base principale
    * @param {Joueur} joueur le joueur dont le projectile mis a 0- les pv de la base
    */
    Mourir(joueur) {
        joueur.augmenterScore(150);
        joueur.augmenterMonnaie(20);
        //console.log(joueur.score)
        super.Mourir(joueur);

        // indiquer que la bp est prise
        this.observerEtatBP.notifyObservers();
    }

    //maj des stat en fonction de la difficulté du niveau
    //maj des stat chaque tours
    //emplacements
}
export { BasePrincipale };