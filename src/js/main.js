
import { Configuration } from "./configuration.js";
import { SceneParDefaut } from "./menu.js";

window.onload = creerScene;

let configuration;

function creerScene() {

    let canvas = document.getElementById("canvas");  //  Get the canvas element

    configuration = new Configuration(canvas);  //  configuration

    new SceneParDefaut(configuration);  //  creer la scene
}

// Watch for browser/canvas resize events
window.addEventListener("resize", () => {
    configuration.engine.resize()
});