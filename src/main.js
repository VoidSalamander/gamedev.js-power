import Cards from "./test_card.js";
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
        this.cards = [];

        for (var i = 0; i < 16; i++) {
            const temp = new Cards(this, 'cards', Phaser.Math.RND.pick(frames));
            this.cards.push(temp);
            this.add.existing(temp);
        }
        Phaser.Actions.GridAlign(this.cards, {
            width: 8,
            height: 2,
            cellWidth: 80,
            cellHeight: 220,
            x: 50,
            y: 80,
        });
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
    scene: main
};

const game = new Phaser.Game(config);