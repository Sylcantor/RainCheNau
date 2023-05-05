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
        this.vitesseAttaque = vitesseAttaque;

        this.portee = new Portee(this.porteeStat, cibleMesh.position, cibleMesh.name);

        this.cibles = []; // la liste des cibles à détruire 
        this.cibleVerouillee = null; // l'observable sur la cible pour l'attaquer plusieurs fois

        this.peutTirer = true;

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
                this.cibles.push(cible); // ajouter une couvelle cible à la liste des cibles potentielles
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
            this.cibleVerouillee = true;

            //for (let i = 0; i < 3; i++) {
            while (cible.pv > 0){
                //console.log(this.cibleMesh.name,"avant", this.peutTirer);
                if (!this.peutTirer) { // regarder si il est possible de tirer
                    this.peutTirer = await this.Attendre(); // attendre sans bloquer l'execution du programme
                    //console.log(this.cibleMesh.name,"apres", this.peutTirer);
                }
                this.LancerProjectile(cible);
                this.peutTirer = false;

                console.log(cible.cibleMesh.name, "etat des pv :",cible.pv, cible.pv > 0);
            }
  
            //}

            

            //enlever le for appeller Lancer projectile
            //au debut de lancer projectile attendre asyschrone
            //à la fin de lancer projectile check pv cible
            // > relancer
            // fin???
        }
        
        return new Promise(resolve => {resolve(this.cibleVerouillee)});
    }



    /**
     * Attend un certain temps avant de revoier true
     * @returns {Promise} renvoie true à la fin du temps d'attente
     */
    Attendre() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, 2000);
        });
    }



    /**
     * attaque la cible à portée
     * @param {CibleAbstract} cible 
     */
    LancerProjectile(cible) {
        let projectile = new Projectile(this.cibleMesh.position, this.joueur.couleur, this.attaque);
        projectile.cibler(cible);
        //console.log(cible.cibleMesh.name, "etat pv :",cible.pv);
    }

    
    /**
     * Mort
     */


    /**
     * Modif stats
     */

}
export { CibleAbstract };