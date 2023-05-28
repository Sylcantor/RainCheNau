import { BaseAbstract } from "./baseAbstract.js";
import { Chemin } from "./chemin.js";
import { Joueur } from "./joueur.js";
import { UniteAbastract } from "./uniteAbstract.js";
import { UniteDefaut } from "./uniteDefaut.js";

/**
 * Vague lancée par le joueur
 */
class Vague {

    /**
     * Constructeur
     * @param {Joueur} joueur Le joueur attaquant
     * @param {int} nombeBasesJoueur le nombre de bases du joueur attaquant
     * @param {BaseAbstract[]} basesCiblee la ou les base ciblée par le joueur
     * @param {Chemin} chemin le chemin de la partie
     */
    constructor(joueur, nombeBasesJoueur, basesCiblee, chemin) {

        /**
         * @Todo : recupérer les stats des unités à générer à partir des cartes dans les emplacement des bases du joueur attaquant
         */

        this.cibles = basesCiblee;
        this.resteUnite = nombeBasesJoueur * 5;

        this.unites = this.creerUnites(joueur, chemin.splinePoints, this.resteUnite);

        this.quandResteUniteChangeEstAZero = new BABYLON.Observable();
        
    }

    /**
     * Crée les unités qui composentla vague
     * @param {Joueur} joueur le joueur attaquant
     * @param {BABYLON.Vector3[]} chemin les points du chemin
     * @param {int} nbUnites le nombre d'unites de la vague
     * @returns {UniteAbastract[]} 
     */
    creerUnites(joueur, chemin, nbUnites){
        let vague = this; // utilisé pour mettre a jours le nombre d'unités restantes
        let unites = [];
        
        //creation du modele de l'unité : A faire en fonction de la carte unité de l'emplacement
        let nomMesh = "sphere";
        let nomMeshMat = "sphereMat";

        let modele = BABYLON.MeshBuilder.CreateSphere(nomMesh, { diameter: 0.1 });
        modele.material = new BABYLON.StandardMaterial(nomMeshMat);
        modele.position.copyFrom(chemin[0]);

        for (let i = 0; i < nbUnites; i++) {
            let uniteMesh = modele.clone(nomMesh + i);
            uniteMesh.material = modele.material.clone(nomMeshMat + i)
            let unite = new UniteDefaut(uniteMesh, joueur);

            unite.QuandMeurt.add(() => {   
                this.decrementerNbUnites(vague);
            });

            unites.push(unite);
          }

        modele.dispose(true, true);
        // preparer l'animation
        this.preparerAnimationDeplacementUnites(unites,chemin);
        return unites;
    }

    /**
     * Preparer l'animation de déplacement des unites de la vague
     * @param {UniteAbastract[]} unites les liste des unites à animer
     * @param {BABYLON.Vector3[]} chemin les points du chemin
     */
    preparerAnimationDeplacementUnites(unites, chemin){
        let decalage = 0;// permet de décaler le départ de l'animation

        for(let unite of unites){
            let animation = unite.creerUniteAnimation(decalage, chemin);
            unite.cibleMesh.animations.push(animation);
            unite.portee.porteeMesh.animations.push(animation.clone());
            decalage += 0.3;
            for(let base of this.cibles){
                unite.ViserCible(base); // viser la base à attaquer
            } 
        }
    }


    /**
     * Met a jour le nombre d'unités en vie
     * @param {Vague} vague 
     */
    decrementerNbUnites(vague){
        vague.resteUnite -= 1;
        //console.log (vague.resteUnite);
        if (vague.resteUnite == 0) {
            vague.quandResteUniteChangeEstAZero.notifyObservers();
        }
    }
}
export { Vague };