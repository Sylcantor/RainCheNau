import { CibleAbstract } from "./cibleAbstract.js";
import { Joueur } from "./joueur.js";

/**
 * Code commun à toutes les bases
 */
class BaseAbstract extends CibleAbstract{

    /**
     * Constructeur
     * @param {BABYLON.Mesh} cibleMesh Messh associé à la base
     * @param {int} pv points de vie de départ de la base
     * @param {int} attaque attaque de départ de la base
     * @param {int} portee portée de départ de la base
     * @param {int} vitesseAttaque vitesse d'attaque de départ de la base
     */
    constructor(cibleMesh, joueur, pv, attaque, portee, vitesseAttaque) {

        super(cibleMesh, joueur, pv, attaque, portee, vitesseAttaque);

        this.cibleMesh.material.diffuseColor = this.joueur.couleur;
        //this.estBase = true; // permet de savoir si le cibleMesh est une base

        this.actionCouleur// permet de stocker l'action qui change la couleur au passage de la souris en dehors du mesh

        //le tore est juste pour montrer la portee. 
        // @todo : remplacer le tore par la portée du cylindre
        this.torus = BABYLON.MeshBuilder.CreateTorus("torus", { thickness: 0.01, diameter: this.porteeStat, tessellation: 32 });
        this.torus.position = cibleMesh.position;
        this.torus.setEnabled(false);

        this.preparerAnimation();
        this.SeletionBase();
        this.BaseOverAndOut();
    }


    /**
     * Créer l'animation de cibleMesh
     */
    preparerAnimation() {
        const animation = new BABYLON.Animation("cubeAnimation", "rotation", 10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const keyFrames = [];
        for (let i = 0; i < 360; i += 5) {
            const angle = BABYLON.Tools.ToRadians(i);
            const x = Math.cos(angle) * 1;
            const y = Math.sin(angle) * 1;
            const z = Math.sin(angle) * 1;
            keyFrames.push({
                frame: i,
                value: new BABYLON.Vector3(x, y, z)
            });
        }
        animation.setKeys(keyFrames);
        this.cibleMesh.animations.push(animation);
    }


    //maj des stat en fonction de la difficulté du niveau
    //maj des stat chaque tours
    //emplacements


    /**
     * Animation au passage de la souris sur la base
     * Prise dans https://playground.babylonjs.com/#J19GYK#0
     */
    BaseOverAndOut() {
        this.ModifierActionCouleurVisible();
        this.cibleMesh.actionManager.registerAction(this.actionCouleur);
        this.cibleMesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, this.cibleMesh.material, "emissiveColor", BABYLON.Color3.White()));

        this.cibleMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, this.cibleMesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
        this.cibleMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, this.cibleMesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
    }

    /**
     * Met a jour l'action de couleur de la base quand elle change de joueur
     */
    MettreAjourCouleur(){
        this.cibleMesh.actionManager.unregisterAction(this.actionCouleur);
        this.ModifierActionCouleurVisible();
        this.cibleMesh.actionManager.registerAction(this.actionCouleur);
    }

    /**
     * Modifie l'action sur le changement de couleur
     */
    ModifierActionCouleurVisible(){
        this.actionCouleur = new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, this.cibleMesh.material, "emissiveColor", this.cibleMesh.material.emissiveColor)
    }


    /**
     * Animation au click de la souris sur la base
     */
    SeletionBase() {
        this.cibleMesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction({
                trigger: BABYLON.ActionManager.OnPickTrigger,
                parameter: { base: this }
            },
                function (evt) {
                    let base = this.getTriggerParameter().base;
                    base.cibleMesh._scene.interface.MAJPanneauDescription(base);
                    base.torus.setEnabled(true);
                }));
    }

    /**
     * action à la mort d'une base
     * @param {Joueur} joueur le joueur dont le projectile mis a 0- le pv de la base
     */
    Mourir(joueur){
        if(this.etatCible){
            //console.log("la base"+this.cibleMesh.name,"change de joueur")
            this.pv = this.pvmax;
            this.joueur = joueur;
            this.cibleMesh.material.emissiveColor = this.joueur.couleur;
            this.MettreAjourCouleur();
            super.Mourir();
            }
    }

    /**attaquer quand une ciblemeurt regarder si une autre cible est à porté sinon vas attendre l'arrivé d'une cible meme si un client est déjà là et se faire buter sans respect */
}
export { BaseAbstract };