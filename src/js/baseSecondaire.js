import { BaseAbstract } from "./baseAbstract.js";

/**
 * Gestion et affichage de la base principale
 */
class BaseSecondaire extends BaseAbstract{
    /**
    * Constructeur
    * @param {BABYLON.Mesh} cibleMesh Mesh associé à la base
    */
    constructor(cibleMesh, joueur, difficulte) {
        //Statistiques
        super(cibleMesh, joueur, 10 *(1+0.1*difficulte) , 1*(1+0.1*difficulte), 2*(1+0.1*difficulte), 2*(1+0.1*difficulte));

    }

    /**
     * action à la mort d'une base secondaire
     * @param {Joueur} joueur le joueur dont le projectile mis a 0- les pv de la base
     */
    Mourir(joueur){
        joueur.augmenterScore(50);
        joueur.augmenterMonnaie(10);
        //console.log(joueur.score)
        super.Mourir(joueur);

    }
    //maj des stat en fonction de la difficulté du niveau
    //maj des stat chaque tours
    //emplacements
    //détecton des unités
}
export { BaseSecondaire };