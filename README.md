# RainCheNau: BabylonJS Card Strategy Game

[Games On Web 2023](https://www.cgi.com/france/fr-fr/event/games-on-web-2023) project.  

RainCheNau is a 3D card strategy game built using HTML, CSS, JS, and BabylonJS.  
The game revolves around destroying the enemy's main base by sending waves of units along a path.  
Players control a deck of cards to create units and strategically build their army.  
Please note that not all features described below are currently implemented.  

This project is a prototype submission for the [Games On Web 2023](https://www.cgi.com/france/fr-fr/event/games-on-web-2023) contest.  

## Table of Contents
- [Introduction](#introduction)  
- [Camera, Characters, and Controls](#camera-characters-and-controls)  
- [Gameplay Loops](#gameplay-loops)  
- [Victory and Defeat Conditions](#victory-and-defeat-conditions)  
- [Heroes](#heroes)  
- [Environment](#environment)  
- [Game Structure](#game-structure)  
- [Members](#members)  

<a id="introduction"></a>
## Introduction  

- Name: RainCheNau  
- Theme: Be green (player's color is green)  
- Category: Card, Strategy  
- Genre: Light and/or Neon  
- Platform: PC  
- Development Tools: HTML, CSS, JS, and BabylonJS  

<a id="camera-characters-and-controls"></a>
## Camera, Characters, and Controls  

- Camera: Front-facing, 3D with rotatable view  
- Character: The player controls a deck to create units  
- Controls: See GDD for the comprehensive list of controls  

<a id="gameplay-loops"></a>
## Gameplay Loops  

- Small loop: Obtain a stronger card -> Manage cards effectively -> Acquire a stronger card, etc.  
- Medium loop: Launch a powerful wave -> Manage cards well -> Large number of units and/or powerful units -> Launch a powerful wave, etc.  
- Large loop: Destroy a target -> Optimize waves over several turns -> Target destroyed -> Destroy a target, etc.  

<a id="victory-and-defeat-conditions"></a>
## Victory and Defeat Conditions  

- Victory: Destroy the main base of all enemies  
- Defeat: The enemy's main base is not destroyed by the end of the game or the player's main base is destroyed  

<a id="heroes"></a>
## Heroes  

- The player controls a deck of cards, their main base, and any secondary bases they have conquered  
- The deck consists of cards with different types and effects  
- The player can use currency to improve their deck  

<a id="environment"></a>
## Environment  

- Background: Black screen with light emitted by bases and units  
- Terrain: A path connecting the main bases with secondary base locations along the path  

<a id="game-structure"></a>
## Game Structure  

- Bases have various statistics that allow them to defend against enemy units  
- Bases are always controlled by a player or AI  
- Players can place cards in base slots to generate units  

<a id="members"></a>
## Members  

- Nicolas Guiblin  
- Fanny Mettens  
- Ambre Journot  

For more details, refer to the original GDD (in French).
