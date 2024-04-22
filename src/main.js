import Cards from "./card.js";
class Example extends Phaser.Scene {
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
        const cards = new Cards(this);
        cards.createCards('cards');
    }

    handleButtonClick() {
        for (const card of this.cards) {
            card.destroy();
        }
        this.cards.length = 0;
        this.replenishCards();
        
    }

  }


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);