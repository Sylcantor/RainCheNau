import { CibleAbstract } from "./cibleAbstract.js";

/**
 * Gestion et affichage de projectiles
 */
class Projectile {
    /**
     * Constructeur
     * @param {BABYLON.Vector3} position position de départ du projectile
     * @param {BABYLON.Color3} couleur couleur du projectile
     * @param {int} degats degats fait par le projectile
     */
    constructor(position, couleur, degats) {
        this.projectileMesh = this.CreerMesh(position, couleur);
        this.degats = degats;
    }

    /**
     * Crée le mesh du projectile
     * @param {BABYLON.Vector3} position position initales du projectile
     * @param {BABYLON.Color3} couleur couleur du projectile
     * @returns {BABYLON.Mesh} le mesh du projectile
     */
    CreerMesh(position, couleur) {
        let projectileMesh = BABYLON.MeshBuilder.CreateSphere("projectile", { diameter: 0.05 });
        projectileMesh.material = new BABYLON.StandardMaterial("projectileMaterial");
        projectileMesh.material.diffuseColor = couleur;

        projectileMesh.position = new BABYLON.Vector3(position.x, position.y, position.z);

        projectileMesh.actionManager = new BABYLON.ActionManager();

        this.etatCible = true;// indiquesi la cible est vivante

        return projectileMesh
    }

    /**
     * Lance le projectile sur le mesh ciblé
     * @param {CibleAbstract} cible la base ou l'une unité
     */
    cibler(cible) {
        let scene = this.projectileMesh._scene;
        scene.onBeforeRenderObservable.add(() => {
            let p = BABYLON.Vector3.Lerp(this.projectileMesh.position, cible.cibleMesh.position, 0.1);
            // la vitesse du projectile est constante pour tout les tirs
            // mais il est possible de faire une stat pour la vitesse des projectiles dans cibleAbstract
            this.projectileMesh.moveWithCollisions(p.subtract(this.projectileMesh.position));
            this.projectileMesh.lookAt(cible.cibleMesh.position);
        });

        this.toucher(cible);
    }


    /**
     * declancher les degats quand leprojectile touche la cible
     * @param {CibleAbstract} cible la cible du projectile
     */
    toucher(cible) {
        this.projectileMesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction({
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: cible.cibleMesh
            }, () => {
                this.quandToucheCible(cible);
            }));
    }


    /**
     * infliger des dégats à la cible quand touchée et supprime le projectile
     * @param {CibleAbstract} cible 
     */
    quandToucheCible(cible) {
        cible.pv -= this.degats;
        //console.log(cible.pv);
        this.projectileMesh.dispose();
        
        return  (cible.pv <= 0);
    }
}
export { Projectile };