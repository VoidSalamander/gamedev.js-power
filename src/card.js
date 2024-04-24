class Cards extends Phaser.GameObjects.Sprite {
  constructor(scene, frame, texture) {
    super(scene, 0, 0, frame, texture);
    this.isSelected = false;
    this.name = this.frame.name;

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
    console.log(this.suit + this.face)
    if (this.isSelected) {
      this.y -= 15;
    } else {
      this.y += 15;
    }
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
  deck = [];
  constructor(scene, frames) {
    for (var i = 1; i < frames.length - 1; i++) {
      const temp = new Cards(scene, "cards", frames[i]);
      this.deck.push(temp);
    }
  }

  drawCard() {
    if (!this.deck.length) {
      console.warn("deck empty");
      return null;
    } else {
      const temp = Phaser.Math.RND.pick(this.deck);
      removeItemOnce(this.deck, temp);
      return temp;
    }
  }
}

class HandCard {
  constructor(Scene, deck) {
    this.Scene = Scene;
    this.handCards = [];
    this.maximumCards = 8;
    this.HandCardPosY = 100;
    for (var i = 0; i < this.maximumCards; i++) {
      this.deck = deck;
      this.Scene = Scene;
      const temp = this.deck.drawCard();
      this.handCards.push(temp);
      this.Scene.add.existing(temp);
    }
    Phaser.Actions.GridAlign(this.handCards, {
      width: this.maximumCards,
      height: 1,
      cellWidth: 640/this.handCards.length,
      cellHeight: 220,
      x: 50,
      y: this.HandCardPosY,
    });
  }

  getCard = () => {
    if (this.handCards.length < this.maximumCards) {
      const temp = this.deck.drawCard();
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
      console.warn("Deck is full! Cannot add more cards.");
    }
  };

  playCard() {
    const destroyedCards = this.handCards.filter((card) => card.isSelected);
    destroyedCards.forEach((card) => {
      card.destroy();
      for (var i = 1; i < getRandomArbitrary(5,50); i++) {
        const bouncingObject = new BouncingObject(this.Scene, card.x, card.y, 'ball');
      }
    });
    this.handCards = this.handCards.filter((card) => !card.isSelected);
    
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
    this.body.setGravityY(500);
    this.body.setVelocityX(getRandomArbitrary(-500, 500));
    this.body.setVelocityY(getRandomArbitrary(-500, 500));
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(getRandomArbitrary(0.3, 0.7));
    this.body.setFriction(0.2);
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
