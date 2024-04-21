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
        const frames = this.textures.get('cards').getFrameNames();
        this.cards = [];

        for (var i = 0; i < 16; i++) {
            const card = this.add.sprite(0, 0, 'cards', Phaser.Math.RND.pick(frames));
            this.cards.push(card);

            card.setInteractive();

            card.on('pointerover', this.handleHover.bind(this, card));
            card.on('pointerout', this.handleHoverOut.bind(this, card));
            card.on('pointerdown', this.handleClick.bind(this, card));
        }
        this.remainingCards = 16;
        Phaser.Actions.GridAlign(this.cards, {
            width: 8,
            height: 2,
            cellWidth: 80,
            cellHeight: 220,
            x: 50,
            y: 80,
        });

        const button = this.add.image(700, 550, 'buttonImage');
        button.setInteractive();
        button.on('pointerdown', this.handleButtonClick, this);
    }

    handleButtonClick() {
        for (const card of this.cards) {
            card.destroy();
            }
            this.cards.length = 0;
        this.replenishCards();
        
    }

    replenishCards() {
        // Reset remaining cards count
        this.remainingCards = 16;
    
        // Get card frames and create new cards
        const frames = this.textures.get('cards').getFrameNames();
    
        // Clear existing cards array
        this.cards = [];
    
        for (var i = 0; i < 16; i++) {
            const card = this.add.sprite(0, 0, 'cards', Phaser.Math.RND.pick(frames));
            this.cards.push(card);
            card.setInteractive();
            card.on('pointerover', this.handleHover.bind(this, card));
            card.on('pointerout', this.handleHoverOut.bind(this, card));
            card.on('pointerdown', this.handleClick.bind(this, card));
        }
    
        // Re-align cards in grid
        Phaser.Actions.GridAlign(this.cards, {
          width: 8,
          height: 2,
          cellWidth: 80,
          cellHeight: 220,
          x: 50,
          y: 80,
        });
    }
    
    handleHover(card) {
        card.y -= 10;
    }
  
    handleHoverOut(card) {
        card.y += 10;
        
    }

    handleClick(card) {
        console.log(card.frame.name)
        card.destroy();
    
        this.remainingCards--;
    
        if (this.remainingCards === 0) {
          this.replenishCards();
        }
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