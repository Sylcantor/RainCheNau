/**
 * Gestion de l'interface
 */
class InterfaceNiveau {
    /**
    * Constructeur
    */
    constructor(scene) {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI",scene);
        this.Test();

    }
    
    Test(){
        let button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click Me");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function () {
          alert("you did itttttttt!");
        });
        this.advancedTexture.addControl(button1);
    }
}
export { InterfaceNiveau };