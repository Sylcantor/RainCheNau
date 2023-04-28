import { BaseAbstract } from "./baseAbstract.js";
import { Portee } from "./portee.js";
/**
 * Code commun à toutes les unités
 */
class UniteAbastract {

    /**
     * Constructeur
     * @param {BABYLON.Mesh} uniteMesh Messh associé à l'unité
     * @param {int} joueur le joueur controlant l'unité
     * @param {int} pv points de vie de l'unité
     * @param {int} attaque attaque de l'unité
     * @param {int} portee portée de l'unité
     * @param {int} vitesseAttaque vitesse d'attaque de l'unité
     * @param {int} vitesse vitesse de l'unité
     */
    constructor(uniteMesh, joueur, pv, attaque, portee, vitesseAttaque, vitesse) {
        this.joueur = joueur;

        this.uniteMesh = uniteMesh;
        this.uniteMesh.material.emissiveColor = this.joueur.couleur;

        this.pvmax = pv;
        this.pv = pv;
        this.attaque = attaque;
        this.porteeStat = portee;
        this.vitesseAttaque = vitesseAttaque;
        this.vitesse = vitesse; // viesse max = 10, à prendre en compte lors des amélioration, si il est atteint bonus sur les autres stats ?

        this.portee = new Portee(portee, uniteMesh.position);

        this.uniteMesh.actionManager = new BABYLON.ActionManager();

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
     * Labase que l'unité doit attaquer
     * @param {BaseAbstract} baseAViser 
     */
    ViserCible(baseAViser) {

        this.portee.porteeMesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction({
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: baseAViser.baseMesh
            }, function (evt) {
                let base = this.getTriggerParameter();
                //console.log(base);
            }));
    }

}
export { UniteAbastract };