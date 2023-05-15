import { Portee } from "./portee.js";
import { Joueur } from "./joueur.js";
import { Projectile } from "./projectile.js";

/**
 * Gestion et affichage de la base principale
 */
class CibleAbstract {
    /**
     * Constructeur
     * @param {BABYLON.Mesh} cibeMesh Messh associé à l'unité
     * @param {Joueur} joueur le joueur controlant l'unité
     * @param {int} pv points de vie de l'unité
     * @param {int} attaque attaque de l'unité
     * @param {int} portee portée de l'unité
     * @param {int} vitesseAttaque vitesse d'attaque de l'unité
     */
    constructor(cibleMesh, joueur, pv, attaque, portee, vitesseAttaque) {
        //Statistiques
        this.joueur = joueur;

        this.cibleMesh = cibleMesh;
        this.cibleMesh.material.emissiveColor = this.joueur.couleur;
        this.cibleMesh.actionManager = new BABYLON.ActionManager();

        this.pvmax = pv;
        this.pv = pv;
        this.attaque = attaque;
        this.porteeStat = portee;
        this.vitesseAttaque = vitesseAttaque; // nombre de tir par seconde

        this.portee = new Portee(this.porteeStat, cibleMesh.position, cibleMesh.name);

        this.cibleVerouillee = null; // l'observable sur la cible pour l'attaquer plusieurs fois
        this.etatCible = true; // cette cible est en etat de combattre et prend des dégats
        
        /**
         * @todo Remettre toutes bases a true à la fin de la vague
         */

        this.peutTirer = false;

    }


    /**
     * Viser une cible et l'attaquer quand elle est à portée
     * @param {CibleAbstract} cible 
     */
    ViserCible(cible) {
        //console.log(this.portee.porteeMesh);
        this.portee.porteeMesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction({
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: cible.cibleMesh
            }, (evt) => {
                //this.cibles.push(cible); // ajouter une couvelle cible à la liste des cibles potentielles
                this.Attaquer(cible);
            }));
    }


    /**
     * Attaque la cible à interval régulier
     * @param {CibleAbstract} cible 
     * @returns {boolean} la valeur de cible verouillée
     */
    async Attaquer(cible) {
        if (this.cibleVerouillee == null) { // regarder si une autre cible est visée
            //console.log(this.cibleVerouillee, cible.cibleMesh.name);// this.cibleVerouillee = cible ou null
            this.cibleVerouillee = cible;

            let cpt = 0; // compteur pour donner un nom unique a chaque projectile qui sera lancé

            while (cible.etatCible && this.etatCible) {
                // l'etat des pv est en retard de 1 tir
                // 11 tir (1 degat)pour 10 pv
                    // solution les dégats ne sont pas infligés à la cible si ses pv sont en dessous de 0

                if (!this.peutTirer) { // regarder si il est possible de tirer
                    this.peutTirer = await this.Attendre(); // attendre sans bloquer l'execution d'autres attaques
                }

                if(cible.etatCible && this.etatCible){ // la cible ou l'attaquant peuvent etre détruits pandant l'attente de l'attaquant
                    this.LancerProjectile(cible, "_" + cpt + "_" + cible.cibleMesh.name);
                    cpt += 1;
                    this.peutTirer = false;
                }
            }
        }
        //this.peutTirer = true; // pret a tirer sur la cible suivante
        this.cibleVerouillee = null;
    }


    /**
     * Attend un certain temps avant de revoier true
     * @returns {Promise} renvoie true à la fin du temps d'attente
     */
    Attendre() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, 1000 / this.vitesseAttaque);
        });
    }



    /**
     * attaque la cible à portée
     * @param {CibleAbstract} cible la cible a viser
     * @param {string} nom nom à donner au mesh du projectile 
     */
    LancerProjectile(cible, nom) {
        let projectile = new Projectile(this.cibleMesh.position, this.joueur, this.attaque, nom);
        projectile.cibler(cible);
    }


    /**
     * enleve des pv à la cible
     * @param {int} degats nombre de pv à enlever
     * @param {Joueur} joueur joueur attaquant la cible
     */
    perdrePv(degats, joueur) {
        this.pv -= degats;
        /**
         * @todo mettre a jour l'affichage des pv (pas urgent)
         */
        this.modifierEtat(joueur);
    }

    /**
     * Modifie l'etat de la cible
     * @param {Joueur} joueur le joueur attanquant la cible
     */
    modifierEtat(joueur) {
        if (this.pv <= 0) {
            this.Mourir(joueur);
        }
    }


    /**
     * Actions à la mort d'une cible
     */
    Mourir() {
        this.etatCible = false
    }
}
export { CibleAbstract };