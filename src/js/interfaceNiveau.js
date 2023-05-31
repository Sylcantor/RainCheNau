/**
 * Gestion de l'interface
 */

import { BaseAbstract } from "./baseAbstract.js";
import { Joueur } from "./joueur.js";
import { TypeJoueur } from "./typeJoueur.js";

// Regarder la création de bouton avec des pixels au lieu de pourcentage pour voir comment l'interface réagit à le redimention
class InterfaceNiveau {

  /**
   * Constructeur
   * @param {int} niveau : le niveau actuel
   * @param {int} vague : le nombre de vague total du niveau
   * @param {int} vagueRestante : le nombre de vague restantes du niveau
   * @param {Joueur} joueurHumain : le joueur pour qui l'interface est créée
   * @param {int} difficulte : la difficultée du niveau
   */
  constructor(niveau, vague, vagueRestante, joueurHumain, difficulte) {
    this.joueurHumain = joueurHumain;
    this.difficulte = difficulte;
    this.vague = vague;
    this.vagueRestante = vagueRestante;

    // partie calcul cout/bonus des améliorations
    this.niveauAmeliorationNbUnite = 0;
    this.niveauAmeliorationAtk = 0;
    this.niveauAmeliorationPv = 0;

    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    //this.CreerBoutonPause();
    this.CreerBoutonDupliquer();
    this.CreerBoutonFusionner();
    this.CreerBoutonFusionner2();
    this.CreerPanneauDescription();

    this.advancedTexture.addControl(this.CreerLabelEtConteneur("niveau", "niveau. " + niveau, "0", "0"));
    this.advancedTexture.addControl(this.CreerLabelEtConteneur("monnaie", this.joueurHumain.monnaie + ' or', "45", "0"));
    this.advancedTexture.addControl(this.CreerLabelEtConteneur("score", this.joueurHumain.score + " arbre", "45", "300"));
    this.advancedTexture.addControl(this.CreerLabelEtConteneur("vague", vagueRestante + "/" + vague + " vague", "0", "300"));

    this.descriptionVague;

    if (difficulte == 0){
      this.creerTutoriel()
    }




    this.baseCliquee = null; // La base actuellement décrite
    this.peutLancerVague = true; // eviter de lancer plusieurs vagues en meme temps

    // ajout des observer
    let interfaceJoueur = this;

    this.joueurHumain.observerScore.add(() => {
      interfaceJoueur.MajScore(interfaceJoueur);
    });

    this.joueurHumain.observerMonnaie.add(() => {
      interfaceJoueur.MajMonnaie(interfaceJoueur);
    });

  }

  /**
   * Calcul le cout d'une amélioration en fonction de son niveau
   * @param {int} niveau 
   */
  calculerCout(niveau) {
    let base = 5
    if (niveau < 3) {
      return 5 + niveau;
    }
    else if (niveau < 15) {
      return 5 + niveau * 2;
    }
    return niveau * 7;
  }

  calculBonusNbUnite() {
    return 1 + Math.trunc(0.1 * (this.niveauAmeliorationNbUnite / (this.difficulte + 1)))
  }

  calculBonusPV() {
    return 0.2 + (0.3 * (this.niveauAmeliorationPv / (this.difficulte + 1)));
  }

  calculBonusATK() {
    return 0.1 + (0.2 * (this.niveauAmeliorationAtk / (this.difficulte + 1)));
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


  //https://playground.babylonjs.com/#6GWUV3 tooltip 
  //https://www.babylonjs-playground.com/#XCPP9Y#2260 tooltip
  creerTooltip(parent, nom, texte) {
    //console.log(nom)

    // creer et placer le tooltip en bas a coté des boutons
    this.advancedTexture.addControl(this.CreerLabelEtConteneur(nom, texte, "0", "0"));
    let rectangle = this.advancedTexture.getDescendants(false, control => control.name === 'conteneur_' + nom)[0];
    rectangle.width = "400px";
    rectangle.height = "150px";
    let label = this.advancedTexture.getDescendants(false, control => control.name === nom)[0];
    label.width = "400px";
    label.height = "150px";
    rectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    rectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rectangle.top = -5 + "px";
    rectangle.left = -170 + "px";
    rectangle.alpha = 0.75;

    if (nom == "previsualisation_attaque") {
      this.descriptionVague = rectangle;
    }
    this.advancedTexture.removeControl(rectangle);


    let interfaceJoueur = this;
    parent.onPointerEnterObservable.add(function () {
      interfaceJoueur.advancedTexture.addControl(rectangle);

    });

    parent.onPointerOutObservable.add(function () {
      let rectangle = interfaceJoueur.advancedTexture.getDescendants(false, control => control.name === 'conteneur_' + nom)[0];
      interfaceJoueur.advancedTexture.removeControl(rectangle);
    });

  }

  /**
   * Met a jours les informations du tooltip
   * @param {*} nomTooltip : le tooltip a màj
   * @param {*} texte : les nouvelles infos
   */
  MajTooltip(nomTooltip, texte) {
    let label = this.advancedTexture.getDescendants(false, control => control.name === nomTooltip)[0];
    //console.log(nomTooltip, label, this.advancedTexture.getDescendants());
    label.text = texte;
  }

  /**
   * Crée le bouton duplication de carte et ajoute les controle
   */
  CreerBoutonDupliquer() {
    //let button = this.CreerBouton("btnDupliquer", "Dupliquer", "-10", "-10");
    let button = this.CreerBouton("btnDupliquer", "nombre", "-10", "-10");

    //Placement en bas à droite
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    // informations du tooltip
    let prix = this.calculerCout(this.niveauAmeliorationNbUnite) * 5 * (this.difficulte + 1);
    this.creerTooltip(button, "nb_unit_tooltip", "Ajoute une unité à chaque les vague \n Niveau : " + this.niveauAmeliorationNbUnite + "\n Effet : +" + this.calculBonusNbUnite() + " unité" + "\n cout améliotation : " + Math.trunc(prix) + " or");

    let interfaceJoueur = this;
    button.onPointerUpObservable.add(function () {
      interfaceJoueur.joueurHumain.bonusNbUnite += interfaceJoueur.calculBonusNbUnite();

      let prixPrecedant = interfaceJoueur.calculerCout(interfaceJoueur.niveauAmeliorationNbUnite) * 5 * (interfaceJoueur.difficulte + 1);

      interfaceJoueur.niveauAmeliorationNbUnite += 1;

      // Maj des informations
      prix = interfaceJoueur.calculerCout(interfaceJoueur.niveauAmeliorationNbUnite) * 5 * (interfaceJoueur.difficulte + 1);
      interfaceJoueur.MajTooltip("nb_unit_tooltip", "Ajoute une unité à chaque les vague \n Niveau : " + interfaceJoueur.niveauAmeliorationNbUnite + "\n Effet : +" + interfaceJoueur.calculBonusNbUnite() + " unité" + "\n cout améliotation : " + Math.trunc(prix) + " or");

      interfaceJoueur.joueurHumain.baisserMonnaie(prixPrecedant);

      // mise a jour de la prévisualisation de la vague
      interfaceJoueur.MajInfoVague(interfaceJoueur);
    });

    this.advancedTexture.addControl(button);
    //(this.joueurHumain.monnaie < prix) ? this.advancedTexture.getDescendants(true, control => control.name === "btnDupliquer")[0].isEnabled = false : this.advancedTexture.getDescendants(true, control => control.name === "btnDupliquer")[0].isEnabled = true;
    (this.joueurHumain.monnaie < prix) ? button.isEnabled = false : button.isEnabled = true;

  }


  /**
   * Crée le bouton fusion de carte et ajoute les controle
   */
  CreerBoutonFusionner() {
    //let button = this.CreerBouton("btnFusionner", "Fusioner", "-60", "-10");
    let button = this.CreerBouton("btnFusionner", "attaque", "-60", "-10");

    //Placement en bas à droite
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;


    let prix = this.calculerCout(this.niveauAmeliorationAtk) * 2 * (this.difficulte + 1);
    this.creerTooltip(button, "atk_tooltip", "Augmente la puissanse des unités \n Niveau : " + this.niveauAmeliorationAtk + "\n Effet : +" + this.calculBonusATK() + " attaque" + "\n cout améliotation : " + Math.trunc(prix) + " or");


    let interfaceJoueur = this;
    button.onPointerUpObservable.add(function () {
      interfaceJoueur.joueurHumain.bonusATK += interfaceJoueur.calculBonusATK();

      let prixPrecedant = interfaceJoueur.calculerCout(interfaceJoueur.niveauAmeliorationAtk) * 2 * (interfaceJoueur.difficulte + 1);


      interfaceJoueur.niveauAmeliorationAtk += 1;

      // Maj des informations
      let prix = interfaceJoueur.calculerCout(interfaceJoueur.niveauAmeliorationAtk) * 2 * (interfaceJoueur.difficulte + 1);
      interfaceJoueur.MajTooltip("atk_tooltip", "Augmente la puissanse des unités \n Niveau : " + interfaceJoueur.niveauAmeliorationAtk + "\n Effet : +" + parseFloat(interfaceJoueur.calculBonusATK()).toPrecision(3) + " attaque" + "\n cout améliotation : " + Math.trunc(prix) + " or");
      interfaceJoueur.joueurHumain.baisserMonnaie(prixPrecedant);

      // mise a jour de la prévisualisation de la vague
      interfaceJoueur.MajInfoVague(interfaceJoueur);
    });

    this.advancedTexture.addControl(button);
    (this.joueurHumain.monnaie < prix) ? this.advancedTexture.getDescendants(true, control => control.name === "btnFusionner")[0].isEnabled = false : this.advancedTexture.getDescendants(true, control => control.name === "btnFusionner")[0].isEnabled = true;
  }


  /**
  * Crée le bouton fusion de carte et ajoute les controle
  */
  /**@TODO a retirer pour les cartes */
  CreerBoutonFusionner2() {
    //let button = this.CreerBouton("btnFusionner", "Fusioner", "-60", "-10");
    let button = this.CreerBouton("btnFusionner2", "point vie", "-110", "-10");

    //Placement en bas à droite
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;


    let prix = this.calculerCout(this.niveauAmeliorationPv) * (this.difficulte + 1);
    //console.log(prix);
    this.creerTooltip(button, "pv_tooltip", "Augmente les points de vie des unités \n Niveau : " + this.niveauAmeliorationPv + "\n Effet : +" + this.calculBonusPV() + " pv" + "\n cout améliotation : " + Math.trunc(prix) + " or");

    let interfaceJoueur = this;
    button.onPointerUpObservable.add(function () {
      interfaceJoueur.joueurHumain.bonusPV += interfaceJoueur.calculBonusPV();

      let prixPrecedant = interfaceJoueur.calculerCout(interfaceJoueur.niveauAmeliorationPv) * (interfaceJoueur.difficulte + 1);


      interfaceJoueur.niveauAmeliorationPv += 1;

      // Maj des informations
      let prix = interfaceJoueur.calculerCout(interfaceJoueur.niveauAmeliorationPv) * (interfaceJoueur.difficulte + 1);

      interfaceJoueur.MajTooltip("pv_tooltip", "Augmente les points de vie des unités \n Niveau : " + interfaceJoueur.niveauAmeliorationPv + "\n Effet : +" + parseFloat(interfaceJoueur.calculBonusPV()).toPrecision(3) + " pv" + "\n cout améliotation : " + Math.trunc(prix) + " or");

      interfaceJoueur.joueurHumain.baisserMonnaie(prixPrecedant);

      // mise a jour de la prévisualisation de la vague
      interfaceJoueur.MajInfoVague(interfaceJoueur);
    });

    this.advancedTexture.addControl(button);
    (this.joueurHumain.monnaie < prix) ? this.advancedTexture.getDescendants(true, control => control.name === "btnFusionner2")[0].isEnabled = false : this.advancedTexture.getDescendants(true, control => control.name === "btnFusionner2")[0].isEnabled = true;
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

    var rectangle = new BABYLON.GUI.Rectangle("conteneur_" + nomLabel);
    rectangle.width = "300px";
    rectangle.height = "40px";

    //Placement en haut à gauche
    rectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    //decaler du coin
    rectangle.top = top + "px";
    rectangle.left = left + "px";

    rectangle.cornerRadius = 10;
    rectangle.color = "black";
    //rectangle.thickness = 4;
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
    button.isVisible = false;

    let panel = new BABYLON.GUI.StackPanel("BarreInfo");
    this.advancedTexture.addControl(panel);
    panel.width = "400px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.top = "100px";
    panel.color = "black";
    //panel.thickness = 4;
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

    if (panel != undefined) {// pas le temps de corriger ce bug au niveau des projectiles qui touchent leurs cible alors que le niveau est fini
      panel.getChildByName("Selection").text = "Controleur : " + base.joueur.type.type;
      panel.getChildByName("Pv").text = "Pv: " + parseFloat(base.pv).toPrecision(3) + " / " + parseFloat(base.pvmax).toPrecision(3);
      panel.getChildByName("Portee").text = "Portée: " + parseFloat(base.porteeStat).toPrecision(3);
      panel.getChildByName("VitAtk").text = "Vitesse attaque: " + parseFloat(base.vitesseAttaque).toPrecision(3);
      panel.getChildByName("Atk").text = "Attaque: " + parseFloat(base.attaque).toPrecision(3);

      ((TypeJoueur.Joueur != base.joueur.type) && this.peutLancerVague) ? panel.getChildByName("btnLancerVague").isVisible = true : panel.getChildByName("btnLancerVague").isVisible = false;

      // isVisible fait apparaitre une ligne verte moche 
      this.advancedTexture.removeControl(panel);
      this.advancedTexture.addControl(panel);
    }

  }

  /**
   * Met à jour l'affichage du nombre de vague
   * @param {int} vagueRestante 
   * @param {int} vague 
   */
  MajNbVague(vagueRestante, vague) {
    let label = this.advancedTexture.getDescendants(false, control => control.name === 'vague')[0];
    label.text = vagueRestante + "/" + vague;
  }

  /**
   * Mise a jour du score
   * @param {InterfaceNiveau} interfaceJoueur 
   */
  MajScore(interfaceJoueur) {
    let label = interfaceJoueur.advancedTexture.getDescendants(false, control => control.name === 'score')[0];
    label.text = interfaceJoueur.joueurHumain.score + " arbre";
  }

  /**
   * Mise a jour lié à la monnaie
   * @param {InterfaceNiveau} interfaceJoueur 
   */
  MajMonnaie(interfaceJoueur) {
    let label = interfaceJoueur.advancedTexture.getDescendants(false, control => control.name === 'monnaie')[0];
    label.text = interfaceJoueur.joueurHumain.monnaie + " or";

    let prixunit = interfaceJoueur.calculerCout(interfaceJoueur.niveauAmeliorationNbUnite) * 5 * (interfaceJoueur.difficulte + 1);
    (interfaceJoueur.joueurHumain.monnaie < prixunit) ? interfaceJoueur.advancedTexture.getDescendants(true, control => control.name === "btnDupliquer")[0].isEnabled = false : interfaceJoueur.advancedTexture.getDescendants(true, control => control.name === "btnDupliquer")[0].isEnabled = true;


    let prixatk = interfaceJoueur.calculerCout(interfaceJoueur.niveauAmeliorationAtk) * 2 * (interfaceJoueur.difficulte + 1);
    (interfaceJoueur.joueurHumain.monnaie < prixatk) ? interfaceJoueur.advancedTexture.getDescendants(true, control => control.name === "btnFusionner")[0].isEnabled = false : interfaceJoueur.advancedTexture.getDescendants(true, control => control.name === "btnFusionner")[0].isEnabled = true;

    let prixpv = interfaceJoueur.calculerCout(interfaceJoueur.niveauAmeliorationPv) * (interfaceJoueur.difficulte + 1);
    (interfaceJoueur.joueurHumain.monnaie < prixpv) ? interfaceJoueur.advancedTexture.getDescendants(true, control => control.name === "btnFusionner2")[0].isEnabled = false : interfaceJoueur.advancedTexture.getDescendants(true, control => control.name === "btnFusionner2")[0].isEnabled = true;

  }

  /**
   * Mise des informations pour prévisualiser une vague
   * @param {InterfaceNiveau} interfaceJoueur 
   */
  MajInfoVague(interfaceJoueur) {

    interfaceJoueur.descriptionVague.getDescendants()[0].text = "Vague n°"
      + (interfaceJoueur.vague - interfaceJoueur.vagueRestante + 1)
      + "\n Nombre d'unité : "
      + (5  + interfaceJoueur.joueurHumain.nombreBase + interfaceJoueur.joueurHumain.bonusNbUnite)
      + "\n Point de vie : "
      + parseFloat(1 + interfaceJoueur.joueurHumain.bonusPV).toPrecision(3)
      + "\n Attaque : "
      + parseFloat(1 + interfaceJoueur.joueurHumain.bonusATK).toPrecision(3);

  }

  creerTutoriel(){
    this.txtTuto = "Bienvenu dans Tree force.\n Votre but est de détruire la base principale \nennemie pour pour planter des arbres à la \nplace."
    +"\n\n Vous avez un nombre limité de vagues pour \n réussir.";

    let titre = this.CreerLabel("titreTuto", "Tutoriel");
    titre.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

    let labelTexte = this.CreerLabel("contenuTuto", this.txtTuto);
    labelTexte.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    labelTexte.width = "400px";
    labelTexte.height = "200px";
    labelTexte.top = "50px";

    let buttonSuivant = this.CreerBouton("btnTutoSuivant", "->", "0", "0");
    buttonSuivant.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    buttonSuivant.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    buttonSuivant.paddingBottomInPixels = 3;
    buttonSuivant.paddingRightInPixels = 3;

    let buttonPrecedant = this.CreerBouton("btnTutoPrecedant", "<-", "0", "0");
    buttonPrecedant.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    buttonPrecedant.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    buttonPrecedant.paddingBottomInPixels = 3;
    buttonPrecedant.paddingRightInPixels = 3;
    buttonPrecedant.isVisible = false;


    var rectangle = new BABYLON.GUI.Rectangle("conteneur_Tuto");
    rectangle.width = "400px";
    rectangle.height = "300px";
    rectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    rectangle.top = "10px";
    rectangle.left = "-10px";
    rectangle.color = "black";
    //rectangle.thickness = 0;
    rectangle.background = "green";
    rectangle.alpha = 0.75;


    let inter= this;
    buttonSuivant.onPointerUpObservable.add(() => inter.tutoPage2());

    rectangle.addControl(titre);
    rectangle.addControl(labelTexte);
    rectangle.addControl(buttonSuivant);
    rectangle.addControl(buttonPrecedant);

    this.advancedTexture.addControl(rectangle);
   

  }

  tutoPage1(){
    let rectangle = this.advancedTexture.getDescendants(true, control => control.name === 'conteneur_Tuto')[0];
    let buttonSuivant = rectangle.getChildByName("btnTutoSuivant");
    let buttonPrecedant = rectangle.getChildByName("btnTutoPrecedant");
    let labelTexte = rectangle.getChildByName("contenuTuto");

    buttonSuivant.onPointerUpObservable.clear();
    buttonPrecedant.onPointerUpObservable.clear();

    buttonPrecedant.isVisible = false;
    labelTexte.text = this.txtTuto;

    let inter= this;
    buttonSuivant.onPointerUpObservable.add(() => inter.tutoPage2());

  }

  tutoPage2(){
    let rectangle = this.advancedTexture.getDescendants(true, control => control.name === 'conteneur_Tuto')[0];
    let buttonSuivant = rectangle.getChildByName("btnTutoSuivant");
    let buttonPrecedant = rectangle.getChildByName("btnTutoPrecedant");
    let labelTexte = rectangle.getChildByName("contenuTuto");

    buttonSuivant.onPointerUpObservable.clear();
    buttonPrecedant.onPointerUpObservable.clear();


    labelTexte.text = "Vous pouvez cliquer sur les bases pour obtenir \ndes information. \n\n En attaquant une base des unités seront \nenvoyées pour la détruire.\n\n Utlisez les touches directionnelle pour \ndéplacer la caméra.";
    buttonPrecedant.isVisible = true;

    let inter= this;
    buttonPrecedant.onPointerUpObservable.add(() => inter.tutoPage1());
    buttonSuivant.onPointerUpObservable.add(() => inter.tutoPage3());
  }

  tutoPage3(){
    let rectangle = this.advancedTexture.getDescendants(true, control => control.name === 'conteneur_Tuto')[0];
    let buttonSuivant = rectangle.getChildByName("btnTutoSuivant");
    let buttonPrecedant = rectangle.getChildByName("btnTutoPrecedant");
    let labelTexte = rectangle.getChildByName("contenuTuto");

    buttonSuivant.onPointerUpObservable.clear();
    buttonPrecedant.onPointerUpObservable.clear();


    labelTexte.text = "Prendre la base principale de l'ennemi \nvous permet de finir le niveau. \n\n Prendre une base secondaire vous donnera \nun bonus sur le nombre d'unités que vous \npouvez utiliser pour attaquer. ";
    buttonPrecedant.isVisible = true;

    let inter= this;
    buttonSuivant.textBlock.text = "->";
    buttonPrecedant.onPointerUpObservable.add(() => inter.tutoPage2());
    buttonSuivant.onPointerUpObservable.add(() => inter.tutoPage4());
  }

  tutoPage4(){
    let rectangle = this.advancedTexture.getDescendants(true, control => control.name === 'conteneur_Tuto')[0];
    let buttonSuivant = rectangle.getChildByName("btnTutoSuivant");
    let buttonPrecedant = rectangle.getChildByName("btnTutoPrecedant");
    let labelTexte = rectangle.getChildByName("contenuTuto");

    buttonSuivant.onPointerUpObservable.clear();
    buttonPrecedant.onPointerUpObservable.clear();

    labelTexte.text = "Vous pouvez aussi achetter des amélirations \npour obtenir des unités plus puissantes. \n\n Ces améliorations seront conservées pour les \nniveaux suivants.";
    buttonPrecedant.isVisible = true;

    buttonSuivant.textBlock.text = "Fermer";

    let inter= this;
    buttonPrecedant.onPointerUpObservable.add(() => inter.tutoPage3());
    buttonSuivant.onPointerUpObservable.add(() => inter.advancedTexture.removeControl(rectangle));
  }


}
export { InterfaceNiveau };