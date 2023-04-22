/**
 * Gestion et affichage du chemin
 */
class Chemin {
    /**
    * Constructeur
    * @param {int} nombreBasesSecondaire : nombre de bases secondaires
    */
    constructor(nombreBasesSecondaire) {
        // Création du chemin
        this.spline = this.creerCourbeV1(nombreBasesSecondaire);// une seule fonction de creation pour le moment, à modifier si de nouvelles fonctions alternatives apparaissent
        this.splinePoints = this.spline.getPoints();

        //Affichage du chemin
        const ligne = BABYLON.MeshBuilder.CreateLines("line", {points : this.splinePoints});
        ligne.color = BABYLON.Color3.Gray();
    }

    // toutes les différentes fonction de génération de chemin aléatoire ici
    // permettra de faire à terme des niveaux avec plusieurs chemins de départ et d'arrivée (si on à le temps)


    /**
    * Création d'une courbe aleatoire version 1 
    * @returns  la courbe
    */
    creerCourbeV1(nombreBasesSecondaire) {
        //Création d'une ligne avec un chemin aléatoire
        let maximumx = 1;
        let maximumz = 2;
        let x = 0;
        let z = 0;
        let pointLigne = [];
        pointLigne.push(new BABYLON.Vector3(x, 0, z));

        // faire un chemin plus long que le nombre de bases secondaire
        for (let i = 0; i < nombreBasesSecondaire + nombreBasesSecondaire*0.5; i++) {
            //éviter les boucles lors du traçage de la courbe
            x = x > 0 ? x + maximumx : x - maximumx;
            z = x > 0 ? z + maximumz : z - maximumz;

            //modifier aléatoirement les coordonnées des points
            x -= Math.random() * maximumx / 2;
            z += Math.random() * (maximumz / 2);
            z -= Math.random() * (maximumz / 2);

            // eviter que la courbe sorte de l'écran par le haut ou le bas(confort)
            if (z < (-maximumz - 1) || z > (maximumz + 1)) {
                z = 0;
                z += Math.random() * (maximumz / 2);
                z -= Math.random() * (maximumz / 2);
            }

            pointLigne.push(new BABYLON.Vector3(x, 0, z));
        }

        // création de la courbe
        let spline = BABYLON.Curve3.CreateCatmullRomSpline(pointLigne, 10, false);

        return spline;
    }
}
export { Chemin };