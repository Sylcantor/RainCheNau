import { BaseAbstract } from "./baseAbstract.js";
import { CibleAbstract } from "./cibleAbstract.js";
import { Projectile } from "./projectile.js";

/**
 * Code commun à toutes les unités
 */
class UniteAbastract extends CibleAbstract {

    /**
     * Constructeur
     * @param {BABYLON.Mesh} cibleMesh Messh associé à l'unité
     * @param {int} joueur le joueur controlant l'unité
     * @param {int} pv points de vie de l'unité
     * @param {int} attaque attaque de l'unité
     * @param {int} portee portée de l'unité
     * @param {int} vitesseAttaque vitesse d'attaque de l'unité
     * @param {int} vitesse vitesse de l'unité
     */
    constructor(cibleMesh, joueur, pv, attaque, portee, vitesseAttaque, vitesse) {

        super(cibleMesh, joueur, pv, attaque, portee, vitesseAttaque);

        this.vitesse = vitesse;
        // statistique en plus des bases vus que les unités se déplacent
        // viesse max = 10, à prendre en compte lors des amélioration, si il est atteint bonus sur les autres stats ?

        this.QuandMeurt = new BABYLON.Observable();

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
        const animation = new BABYLON.Animation("deplacementChemin"
                                                , "position"
                                                , 30
                                                , BABYLON.Animation.ANIMATIONTYPE_VECTOR3
                                                , BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
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
     * @param {CibleAbstract} base 
     */
    async Attaquer(base) {

        //console.log(base)
        //Mise en pause du déplacement de l'unité
        this.animationUnite.pause();
        this.animPortee.pause();

        super.Attaquer(base);

        while(this.etatCible && base.etatCible){ // permet de forcer l'unité à rester sur place
            //console.log("pv de la cible", base.pv)
            //attendre le temps de faire un tir de plus
            await this.Attendre();
        }
        this.animationUnite.restart();
        this.animPortee.restart();
        //console.log("pv de la cible", base.pv)
    }

    /**
     * Action à la mort d'une unité
     */
    Mourir() {
        //console.log(this.cibleMesh.name, 'meurt')
        this.cibleMesh.dispose(true, true);
        this.portee.porteeMesh.dispose(true, true);
        super.Mourir();
        this.joueur.augmenterMonnaie(1);
        this.QuandMeurt.notifyObservers();
    }

    /**
     * Vise la cible quand elle est a portée et lance une attauqe si possible
     * @param {BaseAbstract} base 
     */
    ViserCible(base) {
        //console.log(cible, this.cibleVerouillee)
        this.portee.porteeMesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction({
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: base.cibleMesh
            }, (evt) => {
                //attribue la 1ere cible ou verifie que la base actuellement ciblée à bien été capturée
                if (this.cibleVerouillee == null || this.cibleVerouillee.joueur == this.joueur) { 
                    this.Attaquer(base);
                }
        }));
    }

}
export { UniteAbastract };