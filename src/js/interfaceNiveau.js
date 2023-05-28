/**
 * Gestion de l'interface
 */

import { BaseAbstract } from "./baseAbstract.js";
import { TypeJoueur } from "./typeJoueur.js";

// Regarder la création de bouton avec des pixels au lieu de pourcentage pour voir comment l'interface réagit à le redimention
class InterfaceNiveau {
  /**
  * Constructeur
  */
  constructor(niveau, vague, vagueRestante, monnaie) {
    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this.CreerBoutonPause();
    this.CreerBoutonDupliquer();
    this.CreerBoutonFusionner();
    this.CreerPanneauDescription();

    this.advancedTexture.addControl(this.CreerLabelEtConteneur("niveau", "lvl." + niveau, "0", "0"));
    this.advancedTexture.addControl(this.CreerLabelEtConteneur("vague", vagueRestante + "/" + vague, "0", "150"));
    this.advancedTexture.addControl(this.CreerLabelEtConteneur("monnaie", monnaie, "0", "300"));

    this.baseCliquee = null; // La base actuellement décrite
    this.peutLancerVague = true; // eviter de lancer plusieurs vagues en meme temps

  }


  /**
   * Crée un bouton
   * @param {string} nom : nom du bouton
   * @param {string} texte : texte afficher sur le bouton
   * @param {string} top : decalage par rapport au haut de l'écran
   * @param {string} left : decalage par rapport à la gauche de l'écran
   * @returns {BABYLON.GUI.Button} un bouton
   */
  CreerBouton(nom, texte, top, left) {
    let button = BABYLON.GUI.Button.CreateSimpleButton(nom, texte);
    button.width = "150px"
    button.height = "40px";

    // décaler du coin
    button.top = top + "px";
    button.left = left + "px";

    button.color = "white";
    button.cornerRadius = 20;
    button.background = "green";

    return button;
  }


  /**
   * Crée le bouton pause et ajoute le controle
   */
  // Bouton pause met en pause la partie (et affiche les options si on à le temps de les faire)
  CreerBoutonPause() {
    let button = this.CreerBouton("btnPause", "Pause", "10", "-10");
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

    button.onPointerUpObservable.add(function () {
      console.log("code bouton pause");
    });
    this.advancedTexture.addControl(button);
  }

  /**
   * Crée le bouton duplication de carte et ajoute les controle
   */
  CreerBoutonDupliquer() {
    let button = this.CreerBouton("btnDupliquer", "Dupliquer", "-10", "-10");

    //Placement en bas à droite
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    button.onPointerUpObservable.add(function () {
      console.log("code bouton dupliquer");
    });
    this.advancedTexture.addControl(button);
  }


  /**
   * Crée le bouton fusion de carte et ajoute les controle
   */
  CreerBoutonFusionner() {
    let button = this.CreerBouton("btnFusionner", "Fusioner", "-60", "-10");

    //Placement en bas à droite
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    button.onPointerUpObservable.add(function () {
      console.log("code bouton fusionner");
    });
    this.advancedTexture.addControl(button);
  }


  /**
   * Crée un label
   * @param {String} nomLabel : nom du label
   * @param {String} texte : texte du label
   * @returns {BABYLON.GUI.TextBlock} un label
   */
  CreerLabel(nomLabel, texte) {
    var label = new BABYLON.GUI.TextBlock(nomLabel, "");
    label.width = 0.5;
    label.height = "40px";
    label.color = "white";
    label.text = texte;
    return label;
  }


  /**
   * Crée un conteneur rectangulaire avec un label et le place en haut à gauche
   * @param {String} nomLabel : nom du label
   * @param {String} texte : texte du label
   * @param {int} top : decalage par rapport au haut de l'écran
   * @param {int} left : decalage par rapport à la gauche de l'écran
   * @returns {BABYLON.GUI.Rectangle} Le conteneur avec le label associé
   */
  CreerLabelEtConteneur(nomLabel, texte, top, left) {
    var label = this.CreerLabel(nomLabel, texte);

    var rectangle = new BABYLON.GUI.Rectangle("conteneur_"+nomLabel);
    rectangle.width = "150px";
    rectangle.height = "40px";

    //Placement en haut à gauche
    rectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    //decaler du coin
    rectangle.top = top + "px";
    rectangle.left = left + "px";

    rectangle.cornerRadius = 10;
    rectangle.color = "black";
    rectangle.thickness = 4;
    rectangle.background = "green";
    
    rectangle.addControl(label);
    return rectangle;
  }


  /**
   * Creer le panneau de description de la selectionnée
   * @todo : moyen de cacher/afficher le panneau (pas prioritaire)
   */
  CreerPanneauDescription() {

    let labelSelection = this.CreerLabel("Selection", "Aucune selection");
    let labelPv = this.CreerLabel("Pv", "");
    let labelVitesseAtk = this.CreerLabel("VitAtk", "");
    let labelPortee = this.CreerLabel("Portee", "");
    let labelAttaque = this.CreerLabel("Atk", "");

    let button = this.CreerBouton("btnLancerVague", "Attaquer", "0", "0");
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    button.paddingBottomInPixels = 3;
    button.paddingRightInPixels = 3;
    button.isEnabled = false;

    let panel = new BABYLON.GUI.StackPanel("BarreInfo");
    this.advancedTexture.addControl(panel);
    panel.width = "400px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.top = "50px";
    panel.color = "black";
    panel.thickness = 4;
    panel.background = "green";
  
    this.advancedTexture.addControl(panel);
    panel.addControl(labelSelection);
    panel.addControl(labelPv);
    panel.addControl(labelPortee);
    panel.addControl(labelVitesseAtk);
    panel.addControl(labelAttaque);
    panel.addControl(button);
  }


  /**
   * Met à jours les details affichés dans le panneau d'information 
   * @param {BaseAbstract} base : base
   */
  MAJPanneauDescription(base) {
    this.baseCliquee = base;

    let panel = this.advancedTexture.getDescendants(true, control => control.name === 'BarreInfo')[0];

    panel.getChildByName("Selection").text = "base de : " + base.joueur.type.type;
    panel.getChildByName("Pv").text = "Pv: " + base.pv + " / " + base.pvmax;
    panel.getChildByName("Portee").text = "Portée: " + base.porteeStat;
    panel.getChildByName("VitAtk").text = "Vitesse attaque: " + base.vitesseAttaque;
    panel.getChildByName("Atk").text = "Attaque: " + base.attaque;

    (TypeJoueur.Joueur != base.joueur.type && this.peutLancerVague)? panel.getChildByName("btnLancerVague").isEnabled = true : panel.getChildByName("btnLancerVague").isEnabled = false;
    
  }

  /**
   * Met à jour l'affichage du nombre de vague
   * @param {int} vagueRestante 
   * @param {int} vague 
   */
  MajNbVague(vagueRestante, vague){
    let label = this.advancedTexture.getDescendants(false, control => control.name === 'vague')[0];
    label.text = vagueRestante + "/" + vague;
  }

}
export { InterfaceNiveau };