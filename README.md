This is a react app scaffolded with vite 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

### Instructions
This app contains two versions of the application:
* The first version is a react app that automatically runs once the application is started
* The second app is a typescript application that can be run in a console.

### How to play
* #### React app
  * once the app is started a battleship and at least one destroyer is placed on the board of the game
  * click on the squares to make a hit 
  * clicking on the right squares 4 times will sink a destroyer and 5 will sink a battleship
  * For the sake of ease the ships on the board are colored

* #### Console app
  * run app in console by instantiating constructor with the following example below.
  *  ```typescript
       const play = new BattleShip(10)
       play.handleShot('A4');
       play.showMessage();
     ```
