import { CibleAbstract } from "./cibleAbstract.js";
import { Joueur } from "./joueur.js";
import { UniteAbastract } from "./uniteAbstract.js";

/**
 * Code commun à toutes les bases
 */
class BaseAbstract extends CibleAbstract {

    /**
     * Constructeur
     * @param {BABYLON.Mesh} cibleMesh Messh associé à la base
     * @param {Joueur} joueur le joueur qui possede la base
     * @param {int} pv points de vie de départ de la base
     * @param {int} attaque attaque de départ de la base
     * @param {int} portee portée de départ de la base
     * @param {int} vitesseAttaque vitesse d'attaque de départ de la base
     */
    constructor(cibleMesh, joueur, pv, attaque, portee, vitesseAttaque) {

        super(cibleMesh, joueur, pv, attaque, portee, vitesseAttaque);

        this.cibleMesh.material.diffuseColor = this.joueur.couleur;
        //this.estBase = true; // permet de savoir si le cibleMesh est une base

        this.actionCouleur; // permet de stocker l'action qui change la couleur au passage de la souris en dehors du mesh

        this.unitesAPortee = [] // tableau contenant toutes les unités dans la portée de la base

        //le tore est juste pour montrer la portee. 
        /** @todo : remplacer le tore par la portée du cylindre*/
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
    MettreAjourCouleur() {
        this.cibleMesh.actionManager.unregisterAction(this.actionCouleur);
        this.ModifierActionCouleurVisible();
        this.cibleMesh.actionManager.registerAction(this.actionCouleur);
    }

    /**
     * Modifie l'action sur le changement de couleur
     */
    ModifierActionCouleurVisible() {
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
     * enleve des pv à la cible
     * @param {int} degats nombre de pv à enlever
     * @param {Joueur} joueur joueur attaquant la cible
     */
    perdrePv(degats, joueur) {
        super.perdrePv(degats, joueur);

        let interfaceJoueur = this.cibleMesh._scene.interface;
        if(interfaceJoueur.baseCliquee == this){
            interfaceJoueur.MAJPanneauDescription(this);
        }
    }


    /**
     * action à la mort d'une base
     * @param {Joueur} joueur le joueur dont le projectile mis a 0- le pv de la base
     */
    Mourir(joueur) {
        if (this.etatCible) {
            //console.log("la base"+this.cibleMesh.name,"change de joueur")
            this.pv = this.pvmax;
            this.joueur = joueur;

            this.joueur.nombreBase += 1; //////////

            this.cibleMesh.material.emissiveColor = this.joueur.couleur;
            this.unitesaPortee = []
            this.MettreAjourCouleur();
            super.Mourir();
        }
    }

    /**
     * Vise la cible quand elle est a portée et lance une attauqe si possible
     * @param {UniteAbastract} unite 
     */
    ViserCible(unite) {
        this.portee.porteeMesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction({
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: unite.cibleMesh
            }, (evt) => {
                //this.cibles.push(cible); // ajouter une couvelle cible à la liste des cibles potentielles
                if (this.cibleVerouillee == null || this.cibleVerouillee.pv <= 0) { // verifie que la cible actuele est morte 
                    this.Attaquer(unite);
                } else {
                    this.unitesAPortee.push(unite)
                }
            }));
    }


    /**
    * Attaque la cible à interval régulier
    * @param {CibleAbstract} cible 
    * @returns {boolean} la valeur de cible verouillée
    */
    async Attaquer(cible) {

        this.cibleVerouillee = cible;
        let cpt = 0; // compteur pour donner un nom unique a chaque projectile qui sera lancé

        while (cible.etatCible && this.etatCible && this.portee.porteeMesh.intersectsMesh(cible.cibleMesh, true)) {
            //console.log(this.cibleMesh.name, "attaque", cible.cibleMesh.name, cible.pv);
            // l'etat des pv est en retard de 1 tir
            // 11 tir (1 degat)pour 10 pv
            // solution les dégats ne sont pas infligés à la cible si ses pv sont en dessous de 0

            if (!this.peutTirer) { // regarder si il est possible de tirer
                this.peutTirer = await this.Attendre(); // attendre sans bloquer l'execution d'autres attaques
            }

            if (cible.etatCible && this.etatCible && this.peutTirer) { // la cible ou l'attaquant peuvent etre détruits pandant l'attente de l'attaquant

                //console.log(cible == this.cibleVerouillee)

                // Se met parfois a tirer sur plusieurs cibles à la fois 
                if (cible != this.cibleVerouillee) {
                    break
                }
                this.LancerProjectile(cible, "_" + cpt + "_" + cible.cibleMesh.name);
                cpt += 1;
                this.peutTirer = false;
            }
        }

        // empécher de relancer plusieurs fois une attaque
        if (cible == this.cibleVerouillee) {
            this.RelancerAtttaque();
        } else {
            this.unitesAPortee.push(cible);
        }
    }

    /**
     * Lance une attaque si une unité est déjà dans la zone de tir de la base
     */
    RelancerAtttaque() {
        //console.log(this.cibleVerouillee.pv)

        while (this.unitesAPortee.length > 0) {
            let unite = this.unitesAPortee.pop();
            //console.log(this.unitesAPortee)
            // unite toujours à portée avec pv > 0
            if (unite.pv > 0 && this.portee.porteeMesh.intersectsMesh(unite.cibleMesh, true)) {
                this.Attaquer(unite);
                break;
            }
        }
    }

    /**@TODO encore un bug repéré sur les bases qui tirent pas */
}
export { BaseAbstract };