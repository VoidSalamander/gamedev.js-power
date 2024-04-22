import Cards from "./card.js";
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
        this.deck = [];

        for (var i = 0; i < 16; i++) {
            const temp = new Cards(this, 'cards', Phaser.Math.RND.pick(frames));
            this.deck.push(temp);
            this.add.existing(temp);
        }

        const destroybutton = this.add.image(700, 550, 'buttonImage');
        destroybutton.setInteractive();
        destroybutton.on('pointerdown', () => {

            this.deck.filter(card => card.isSelected).forEach(card => card.destroy());
            this.deck = this.deck.filter(card => !card.isSelected);
            
          }, this);

        const addButton = this.add.image(600, 550, 'addButton'); // Add add button
        addButton.setInteractive();
        addButton.on('pointerdown', this.addCard, this); // Bind addCard function
      

        Phaser.Actions.GridAlign(this.deck, {
            width: 8,
            height: 2,
            cellWidth: 80,
            cellHeight: 220,
            x: 50,
            y: 80,
        });
    }

    addCard() {
        // Check if there's an empty slot in the deck
        if (this.deck.length < 16) {
          const frames = this.textures.get('cards').getFrameNames();
          const newCard = new Cards(this, 'cards', Phaser.Math.RND.pick(frames));
          this.deck.push(newCard);
          this.add.existing(newCard);
          this.deck.forEach(card => card.isSelected = false);
          // Update grid alignment to accommodate the new card
          Phaser.Actions.GridAlign(this.deck, {
            width: 8,
            height: 2,
            cellWidth: 80,
            cellHeight: 220,
            x: 50,
            y: 80,
          });
        } else {
          console.warn('Deck is full! Cannot add more cards.'); // Handle full deck scenario (optional)
        }
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