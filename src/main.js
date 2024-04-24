import {Deck,HandCard} from "./card.js";
class main extends Phaser.Scene {
    constructor() {
        super();
    }
  
    preload() {
        this.load.setBaseURL('https://labs.phaser.io');
  
        this.load.image('bg', 'assets/skies/deepblue.png');
        this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
    }
  
    create() {
        this.add.image(400, 300, 'bg');
        const frames = this.textures.get('cards').getFrameNames();
        
        
        const deck = new Deck(this, frames)
        const handCard = new HandCard(this, deck)
        
        const destroybutton = this.add.image(700, 550, 'buttonImage');
        destroybutton.setInteractive();
        destroybutton.on('pointerdown', () => {
            handCard.playCard()
            this.text.setText("delete card");
        }, this);

        const addButton = this.add.image(600, 550, 'addButton');
        addButton.setInteractive();
        addButton.on('pointerdown', handCard.getCard, this);
      
        this.text = new Phaser.GameObjects.Text(this, 100, 550, "This is my text", {
            font: "42px monospace",
            fill: "#00ff00",
            align: "center"
        });
        this.add.existing(this.text);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: main
};

const game = new Phaser.Game(config);