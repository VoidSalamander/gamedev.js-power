import { Deck, HandCard } from "./card.js";
class main extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.setBaseURL("https://labs.phaser.io");

    this.load.image("bg", "assets/skies/deepblue.png");
    this.load.atlas(
      "cards",
      "assets/atlas/cards.png",
      "assets/atlas/cards.json"
    );
  }

  create() {
    this.add.image(400, 300, "bg");
    const frames = this.textures.get("cards").getFrameNames();

    const deck = new Deck(this, frames);
    const handCard = new HandCard(this, deck);

    const destroybutton = this.add.image(700, 300, "buttonImage");
    destroybutton.setInteractive();
    destroybutton.on(
      "pointerdown",
      () => {
        handCard.playCard();
      },
      this
    );

    const addButton = this.add.image(600, 300, "addButton");
    addButton.setInteractive();
    addButton.on("pointerdown", handCard.getCard, this);

    
    
  }
}


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#2d2d2d",
  parent: "phaser-example",
  scene: main,
  physics: {
    default: 'arcade',
    arcade: {
        debug: false,
        gravity: { y: 0 }
    }
  }
};

const game = new Phaser.Game(config);
