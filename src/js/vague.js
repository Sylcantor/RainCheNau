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
     * @param {BaseAbstract[]} basesJoueurAtaquant les bases du joueur attaquant
     * @param {BaseAbstract} baseCiblee la base ciblée par le joueur
     * @param {Chemin} chemin le chemin de la partie
     */
    constructor(joueur, basesJoueurAtaquant, baseCiblee, chemin) {

        /**
         * @Todo : recupérer les stats des unités à générer à partir des cartes dans les emplacement des bases du joueur attaquant
         */

        this.cible = baseCiblee;

        this.unites = this.creerUnites(joueur, chemin.splinePoints);
        
    }

    /**
     * Crée les unités qui composentla vague
     * @param {Joueur} joueur le joueur attaquant
     * @param {BABYLON.Vector3[]} chemin les points du chemin
     * @returns {UniteAbastract[]} 
     */
    creerUnites(joueur, chemin){
        let unites = [];

        //A faire pour chaque emplacement du joueur
        //creation du modele de l'unité A faire en fonction de la carte unité de l'emplacement
        let nomMesh = "sphere";
        let nomMeshMat = "sphereMat";

        let modele = BABYLON.MeshBuilder.CreateSphere(nomMesh, { diameter: 0.1 });
        modele.material = new BABYLON.StandardMaterial(nomMeshMat);
        modele.position.copyFrom(chemin[0]);

        //Pouvoir a faire en fonction de la carte pouvoir de l'emplacement

        //Le nombre d'unité est à faire en fonction de la carte multiplicateur de l'emplacement
        let nombreUnite = 10;
        for (let i = 0; i < nombreUnite; i++) {
            let uniteMesh = modele.clone(nomMesh + i);
            uniteMesh.material = modele.material.clone(nomMeshMat + i)
            let unite = new UniteDefaut(uniteMesh, joueur);

            unites.push(unite);
          }

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
        let decalage = 0;
        for(let unite of unites){
            unite.uniteMesh.animations.push(unite.creerUniteAnimation(decalage, chemin));
            unite.portee.porteeMesh.animations.push(unite.uniteMesh.animations[0].clone());
            decalage += 0.3;

            unite.ViserCible(this.cible); // viser la base à attaquer
        }
    }

}
export { Vague };