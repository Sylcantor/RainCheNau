class BaseAbstract {

    /**
     * Constructeur
     * @param {BABYLON.Mesh} baseMesh Messh associé à la base
     * @param {int} pv points de vie de départ de la base
     * @param {int} attaque attaque de départ de la base
     * @param {int} porte portée de départ de la base
     * @param {int} vitesseAttaque vitesse d'attaque de départ de la base
     */
    constructor(baseMesh, pv, attaque, porte, vitesseAttaque) {
        //this.position = position;
        this.baseMesh = baseMesh;
        this.pvmax = pv;
        this.pv = pv;
        this.attaque = attaque;
        this.portee = porte;
        this.vitesseAttaque = vitesseAttaque;

        this.preparerAnimation();
    }


    /**
     * Créer l'animation de baseMesh
     */
        preparerAnimation(){
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
}
export { BaseAbstract };