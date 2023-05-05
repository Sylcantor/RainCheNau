import { BaseAbstract } from "./baseAbstract.js";
import { CibleAbstract } from "./cibleAbstract.js";
import { Projectile } from "./projectile.js";

/**
 * Code commun à toutes les unités
 */
class UniteAbastract extends CibleAbstract{

    /**
     * Constructeur
     * @param {BABYLON.Mesh} cibeMesh Messh associé à l'unité
     * @param {int} joueur le joueur controlant l'unité
     * @param {int} pv points de vie de l'unité
     * @param {int} attaque attaque de l'unité
     * @param {int} portee portée de l'unité
     * @param {int} vitesseAttaque vitesse d'attaque de l'unité
     * @param {int} vitesse vitesse de l'unité
     */
    constructor(cibeMesh, joueur, pv, attaque, portee, vitesseAttaque, vitesse) {
        
        super(cibeMesh, joueur, pv, attaque, portee, vitesseAttaque);
        
        //this.cibles = basesAViser;
        this.vitesse = vitesse; 
        // statistique en plus des bases vus que les unités se déplacent
        // viesse max = 10, à prendre en compte lors des amélioration, si il est atteint bonus sur les autres stats ?

        this.animationUnite;
        this.animPortee;
    }

    /**
    * Creation des animation l'unité en fonction de sa vitesse
    * @param {int} depart : frame de départ de l'animation
    * @param {BABYLON.Vector3 []} points : chemin que doit suivre l'unité
    * @returns {BABYLON.Animation} l'animation  à appliquer à l'unité
    */
    creerUniteAnimation(depart, points) {
        const animation = new BABYLON.Animation("deplacementChemin", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        //Crée une animation de déplacement le long de la courbe
        const keyFrames = [];
        points.forEach((point, i) => {
            (i == 0) ?
                keyFrames.push({ frame: i, value: point, }) :
                keyFrames.push({ frame: (i + depart) * 10 / this.vitesse, value: point, });
        });
        animation.setKeys(keyFrames);
        return animation;
    }

    /**
     * Attaque la cible à interval régulier
     * @param {CibleAbstract} cible 
     */
    async Attaquer(base) {
        //Mise en pause du déplacement de l'unité
        this.animationUnite.pause();
        this.animPortee.pause();

        // attendre que l'unite ai fini d'attaquer pour reprendre le déplacement
        this.cibleVerouillee = await super.Attaquer(base);


        // restart ou pas en fonction de l'etat de l'unité
        this.animationUnite.restart();
        this.animPortee.restart();
    }

}
export { UniteAbastract };