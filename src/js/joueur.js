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
        
        // bonus actuels du joueur
        this.multNnUnite = 1;
        this.bonusATK = 0;
        this.bonusPV = 0;


        this.couleur = (this.type == TypeJoueur.Joueur) ? BABYLON.Color3.Green() : this.CouleurAleatoire();

    }


    /**
     * Genere une couleure aléaroire pas verte
     * @returns une couleur
     */
    CouleurAleatoire(){
        let r = Math.random() * 1;
        let b = Math.random() * 1;
        let g = (r+b < 1)? Math.random() * (r + b - 0.1) : Math.random() * 0.9;
        console.log(r,g,b)
        return new BABYLON.Color3(r,g,b);
    }
}
export { Joueur };