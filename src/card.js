class Cards extends Phaser.GameObjects.Sprite {
  constructor(scene, frame, texture) {
    super(scene, 0, 0, frame, texture);
    this.isSelected = false;
    this.name = this.frame.name;
    
    const suitsname = [
      "research",
      "wood",
      "fuel",
      "force",
      "food",
      "belief",
      "people",
      "stone",
      "disaster",
    ]

    let matches = this.name.match(/(\d+)/);
    if (matches) {
      const number = parseInt(matches[0]);
      this.suit = suitsname[Math.floor(number / 13)]
      this.face = number % 13 + 1
    }
    this.setInteractive();
    this.on("pointerover", this.handleHover.bind(this));
    this.on("pointerout", this.handleHoverOut.bind(this));
    this.on("pointerdown", this.handleCardClick.bind(this));
  }

  handleHover() {
    if (!this.isSelected) {
      this.y -= 10;
    }
  }

  handleHoverOut() {
    if (!this.isSelected) {
      this.y += 10;
    }
  }

  handleCardClick() {
    this.isSelected = !this.isSelected;
    if (!this.isSelected) {
      this.y += 15;
      this.scene.cardSelected -= 1;
    } else if(this.scene.cardSelected < 5){
      this.y -= 15;
      this.scene.cardSelected += 1;
    } else {
      this.isSelected =false
      console.warn("you can't choose more than five cards")
    }
    console.log(this.scene.cardSelected)
  }

  destroy() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      ease: "Power2",
      duration: 500,
      onComplete: () => {
        this.destroy();
      },
    });
  }
}

class Deck {
  
  constructor(scene, frames) {
    this.deck = [];
    this.discardpile = [];
    for (var i = 1; i < /*frames.length - 1*/10; i++) {
      const temp = new Cards(scene, "cards", frames[i]);
      this.deck.push(temp);
    }
  }

  drawCard() {
    if (this.deck.length === 0) {
      // Check if discard pile has cards before shuffling
      if (this.discardpile.length > 0) {
        console.log("Refilling deck from discard pile");
        this.deck.push(...this.discardpile);
        this.discardpile = []; // Clear discard pile after shuffling
      } else {
        console.warn("Deck and discard pile are empty!");
        return null;
      }
    }
    const card = Phaser.Math.RND.pick(this.deck);
    removeItemOnce(this.deck, card);
    //console.log(card)
    return card;
  }

  discard(discardcard) {
    // Handle single card or array of cards for discard
    if (Array.isArray(discardcard)) {
      discardcard.forEach((card) => this.discardpile.push(card));
    } else {
      this.discardpile.push(discardcard);
    }
  }
}

class HandCard {
  constructor(Scene, deck) {
    this.Scene = Scene;
    this.maximumCards = 8;
    this.HandCardPosY = 480;

    this.handCards = [];


    for (var i = 0; i < this.maximumCards; i++) {
      this.deck = deck;
      const temp = this.deck.drawCard();
      this.handCards.push(temp);
      this.Scene.add.existing(temp);
    }
    Phaser.Actions.GridAlign(this.handCards, {
      width: this.maximumCards,
      height: 1,
      cellWidth: 700/this.handCards.length,
      cellHeight: 220,
      x: 25,
      y: this.HandCardPosY,
    });
  }

  refillhand(){
    /*
    for (var i = this.handCards.length; i < this.maximumCards; i++) {
      this.getCard();
    }*/
    this.getCard();
  }

  getCard = () => {
    if (this.handCards.length < this.maximumCards) {
      const temp = this.deck.drawCard();
      console.log(this.handCards);
      this.handCards.push(temp);
      this.Scene.add.existing(temp);
      
      this.handCards.forEach((card) => (card.isSelected = false));
      Phaser.Actions.GridAlign(this.handCards, {
        width: this.maximumCards,
        height: 1,
        cellWidth: 640/this.handCards.length,
        cellHeight: 220,
        x: 50,
        y: this.HandCardPosY,
      });
    } else {
      console.warn("HandCard is full! Cannot add more cards.");
    }
  };

  playCard() {
    const destroyedCards = this.handCards.filter((card) => card.isSelected);
    destroyedCards.forEach((card) => {
      card.destroy();
      for (var i = 1; i < getRandomArbitrary(5,50); i++) {
        const bouncingObject = new BouncingObject(this.Scene, card.x, card.y, 'ball');
      }
      this.Scene.cardSelected -= 1;
    });
    this.handCards = this.handCards.filter((card) => !card.isSelected);
    this.deck.discard(destroyedCards)
    /*
    Phaser.Actions.GridAlign(this.handCards, {
      width: this.maximumCards,
      height: 1,
      cellWidth: 640/this.handCards.length,
      cellHeight: 220,
      x: 50,
      y: this.HandCardPosY,
    });*/
    return destroyedCards;
  }
}

class BouncingObject extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, imageKey) {
    super(scene, x, y, imageKey);
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.body.setGravityY(700);
    this.body.setVelocityX(getRandomArbitrary(-500, 500));
    this.body.setVelocityY(getRandomArbitrary(-300, 300));

    this.body.setCollideWorldBounds(true);
    this.body.setBounce(getRandomArbitrary(0.2, 0.5));
    this.body.setFrictionX(1);
    this.body.setDrag(0.5);

    this.destroyTimer = this.scene.time.addEvent({
      delay: getRandomArbitrary(2500, 5500), // 3 seconds in milliseconds
      callback: this.destroy,
      callbackScope: this,
      loop: false,
    });
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export { Deck, HandCard };
