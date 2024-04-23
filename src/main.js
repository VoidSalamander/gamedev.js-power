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
        this.handcards = [];

        for(var i = 1; i < frames.length-1; i++) {
            const temp = new Cards(this, 'cards', frames[i]);
            this.deck.push(temp);
        }

        for (var i = 0; i < 16; i++) {
            const temp = Phaser.Math.RND.pick(this.deck);
            removeItemOnce(this.deck, temp)
            this.handcards.push(temp);
            this.add.existing(temp);
        }
        
        const destroybutton = this.add.image(700, 550, 'buttonImage');
        destroybutton.setInteractive();
        destroybutton.on('pointerdown', () => {
            this.handcards.filter(card => card.isSelected).forEach(card => card.destroy());
            this.handcards = this.handcards.filter(card => !card.isSelected);
            this.text.setText("delete card");
          }, this);

        const addButton = this.add.image(600, 550, 'addButton');
        addButton.setInteractive();
        addButton.on('pointerdown', this.drawCard, this);
      
        this.text = new Phaser.GameObjects.Text(this, 100, 550, "This is my text", {
            font: "42px monospace",
            fill: "#00ff00",
            align: "center"
        });
        this.add.existing(this.text);

        Phaser.Actions.GridAlign(this.handcards, {
            width: 8,
            height: 2,
            cellWidth: 80,
            cellHeight: 220,
            x: 50,
            y: 80,
        });
    }

    drawCard() {
        if(!this.deck.length){
            this.text.setText("deck empty")
            return
        }
        else if (this.handcards.length < 16) {
            const temp = Phaser.Math.RND.pick(this.deck);
            removeItemOnce(this.deck, temp)
            this.handcards.push(temp);
            this.add.existing(temp);
            this.handcards.forEach(card => card.isSelected = false);

            console.log(temp.name)
            this.text.setText("draw " + temp.name)
            Phaser.Actions.GridAlign(this.handcards, {
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

class Deck {
    deckPile = [];
    handSlot = [];
    selectedSlot = [];
    discardPile = [];
    
    maximumSlot = 8;
    maximumSelected = 5;

    constructor() {
        super();
    }

    drawCard(){
        if(!this.deck.length){
            return "deck empty"
        } else if (this.handcards.length < 16) {
            const temp = Phaser.Math.RND.pick(this.deck);
            removeItemOnce(this.deck, temp)
            this.handcards.push(temp);
            this.add.existing(temp);
            this.handcards.forEach(card => card.isSelected = false);

            console.log(temp.name)
            this.text.setText("draw " + temp.name)
            Phaser.Actions.GridAlign(this.handcards, {
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

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
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