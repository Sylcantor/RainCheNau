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

        this.monnaie = 0;
        this.score = 0;

        this.bonusPv = 0;
        this.bonusNbUnite = 0;
        this.bonusATK = 0;

        // bonus actuels du joueur
        this.multNnUnite = 1;
        this.bonusATK = 0;
        this.bonusPV = 0;

        this.couleur = (this.type == TypeJoueur.Joueur) ? BABYLON.Color3.Green() : this.CouleurAleatoire();

        this.observerScore = new BABYLON.Observable();
        this.observerMonnaie = new BABYLON.Observable();

    }


    /**
     * Genere une couleure aléaroire pas verte
     * @returns une couleur
     */
    CouleurAleatoire() {
        let r = Math.random() * 1;
        let b = Math.random() * 1;
        let g = (r + b < 1) ? Math.random() * (r + b - 0.1) : Math.random() * 0.9;
        //console.log(r,g,b)
        return new BABYLON.Color3(r, g, b);
    }

    /**
     * Améliore le score du joueur
     * @param {int} nb 
     */
    augmenterScore(nb) {
        this.score += nb;
        this.observerScore.notifyObservers();
    }

    /**
    * Ajoute de la monnaie du joueur
    * @param {int} nb 
    */
    augmenterMonnaie(nb) {
        this.monnaie += nb;
        //console.log(this.monnaie)
        this.observerMonnaie.notifyObservers();
    }

    /**
    * retire de la monnaie du joueur
    * @param {int} nb 
    */
    baisserMonnaie(nb) {
        this.monnaie -= nb;
        this.observerMonnaie.notifyObservers();
    }

    retirerObserver(){

        this.observerMonnaie.clear();
        this.observerScore.clear()

    }

}
export { Joueur };