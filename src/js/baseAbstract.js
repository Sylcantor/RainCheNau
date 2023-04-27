import { Portee } from "./portee.js";

/**
 * Code commun à toutes les bases
 */
class BaseAbstract {

    /**
     * Constructeur
     * @param {BABYLON.Mesh} baseMesh Messh associé à la base
     * @param {int} pv points de vie de départ de la base
     * @param {int} attaque attaque de départ de la base
     * @param {int} portee portée de départ de la base
     * @param {int} vitesseAttaque vitesse d'attaque de départ de la base
     */
    constructor(baseMesh, joueur, pv, attaque, portee, vitesseAttaque) {
        this.joueur = joueur;

        this.baseMesh = baseMesh;
        this.baseMesh.material.diffuseColor = this.joueur.couleur;
        this.baseMesh.material.emissiveColor = this.joueur.couleur;

        this.pvmax = pv;
        this.pv = pv;
        this.attaque = attaque;
        this.porteeStat = portee;
        this.vitesseAttaque = vitesseAttaque;

        //le tore est juste pour montrer la portee. 
        // @todo : remplacer le tore par la portée du cylindre
        this.torus = BABYLON.MeshBuilder.CreateTorus("torus", { thickness: 0.01, diameter: this.portee, tessellation: 32 });
        this.torus.position = baseMesh.position;
        this.torus.setEnabled(false);

        this.portee = new Portee(portee, baseMesh.position);

        this.baseMesh.actionManager = new BABYLON.ActionManager();

        this.preparerAnimation();
        this.SeletionBase();
        this.BaseOverAndOut();
    }


    /**
     * Créer l'animation de baseMesh
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
        this.baseMesh.animations.push(animation);
    }


    //maj des stat en fonction de la difficulté du niveau
    //maj des stat chaque tours
    //emplacements
    //détecton des unités


    /**
     * Animation au passage de la souris sur la base
     * Prise dans https://playground.babylonjs.com/#J19GYK#0
     */
    BaseOverAndOut() {
        this.baseMesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, this.baseMesh.material, "emissiveColor", this.baseMesh.material.emissiveColor));
        this.baseMesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, this.baseMesh.material, "emissiveColor", BABYLON.Color3.White()));

        this.baseMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, this.baseMesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
        this.baseMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, this.baseMesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
    }

    /**
     * Animation au click de la souris sur la base
     */
    SeletionBase() {
        this.baseMesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction({
                trigger: BABYLON.ActionManager.OnPickTrigger,
                parameter: { base: this }
            },
                function (evt) {
                    let base = this.getTriggerParameter().base;
                    base.baseMesh._scene.interface.MAJPanneauDescription(base);
                    base.torus.setEnabled(true);
                }));
    }
}
export { BaseAbstract };