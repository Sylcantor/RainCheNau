/**
 * Gestion de l'interface
 */

// Regarder la création de bouton avec des pixels au lieu de pourcentage pour voir comment l'interface réagit à le redimention
class InterfaceNiveau {
    /**
    * Constructeur
    */
    constructor(scene) {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.CreerBoutonPause();
        this.CreerBoutonDupliquer();
        this.CreerBoutonFusionner();

    }


    /**
     * Crée un bouton
     * @param {string} nom : nom du bouton
     * @param {string} texte : texte afficher sur le bouton
     * @param {string} top : position verticale par rapport au centre de l'écran en %
     * @param {string} left : position horizontale par rapport au centre de l'écran en %
     * @returns un bouton
     */
    CreerBouton(nom, texte, top, left){
        let button = BABYLON.GUI.Button.CreateSimpleButton(nom, texte);
        button.width = "150px"
        button.height = "40px";
        button.top = top+"%";
        button.left = left+"%";
        button.color = "white";
        button.cornerRadius = 20;
        button.background = "green";
        
        return button;
    }


    /**
     * Crée le bouton pause et ajoute le controle
     */
    // Bouton pause met en pause la partie (et affiche les options si on à le temps de les faire)
    CreerBoutonPause(){
        let button = this.CreerBouton("btnPause", "Pause", "-45", "45");
        
        button.onPointerUpObservable.add(function () {
          console.log("code bouton pause");
        });
        this.advancedTexture.addControl(button);
    }

    /**
     * Crée le bouton duplication de carte et ajoute les controle
     */
    CreerBoutonDupliquer(){
        let button = this.CreerBouton("btnDupliquer", "Dupliquer", "45", "45");
        
        button.onPointerUpObservable.add(function () {
          console.log("code bouton dupliquer");
        });
        this.advancedTexture.addControl(button);
    }

    /**
     * Crée le bouton fusion de carte et ajoute les controle
     */
        CreerBoutonFusionner(){
            let button = this.CreerBouton("btnFusionner", "Fusioner", "35", "45");
            
            button.onPointerUpObservable.add(function () {
              console.log("code bouton fusionner");
            });
            this.advancedTexture.addControl(button);
        }
    

}
export { InterfaceNiveau };