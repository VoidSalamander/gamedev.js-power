import Deck from "./card.js";
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
        
        
        this.deck = new Deck(this, frames)
        this.handCard = new HandCard(this, this.deck)
        
        const destroybutton = this.add.image(700, 550, 'buttonImage');
        destroybutton.setInteractive();
        destroybutton.on('pointerdown', () => {
            this.handCard.playCard()
            this.text.setText("delete card");
        }, this);

        const addButton = this.add.image(600, 550, 'addButton');
        addButton.setInteractive();
        addButton.on('pointerdown', this.handCard.getCard, this);
      
        this.text = new Phaser.GameObjects.Text(this, 100, 550, "This is my text", {
            font: "42px monospace",
            fill: "#00ff00",
            align: "center"
        });
        this.add.existing(this.text);
    }
}

class HandCard {
    
    constructor(Scene, deck){
        this.handCards = [];
        this.maximumCards = 16;
        for (var i = 0; i < this.maximumCards; i++) {
            this.deck = deck;
            this.Scene = Scene;
            const temp = this.deck.drawCard();
            this.handCards.push(temp);
            this.Scene.add.existing(temp);
        }
        Phaser.Actions.GridAlign(this.handCards, {
            width: 8,
            height: 2,
            cellWidth: 80,
            cellHeight: 220,
            x: 50,
            y: 80,
        });
    }

    getCard(){
        console.log(this.handCards.length)
        if (this.handCards.length < this.maximumCards) {
            const temp = this.deck.drawCard();
            this.handCards.push(temp);
            this.Scene.add.existing(temp);
            this.handCards.forEach(card => card.isSelected = false);
            Phaser.Actions.GridAlign(this.handCards, {
                width: 8,
                height: 2,
                cellWidth: 80,
                cellHeight: 220,
                x: 50,
                y: 80,
            });
        }else {
            console.warn('Deck is full! Cannot add more cards.');
        }
    }

    playCard(){
        this.handCards.filter(card => card.isSelected).forEach(card => card.destroy());
        this.handCards = this.handCards.filter(card => !card.isSelected);
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