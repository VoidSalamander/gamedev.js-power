import { Deck, HandCard } from "./card.js";
class main extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    
    this.load.setBaseURL("../assets/");
    this.load.atlas(
      "cards",
      "carddata.png",
      "carddata.json"
    );
  }

  create() {
    const frames = this.textures.get("cards").getFrameNames();
    this.cardSelected = 0;

    this.maingame = new maingame(this, frames);

    const destroybutton = this.add.image(850, 500, "buttonImage");
    destroybutton.setInteractive();
    destroybutton.on(
      "pointerdown",
      () => {
        
        console.log(this.maingame.handleplaycard())
      },
      this
    );

    const addButton = this.add.image(850, 600, "addButton");
    addButton.setInteractive();
    //addButton.on("pointerdown", handCard.getCard, this);

    this.scene.add('gameScene', gameScene, { visible: true });
  }
}

class gameScene extends Phaser.Scene {
  constructor() {
    super();
    
  }

  preload() {
    this.load.setBaseURL("https://labs.phaser.io");
    this.load.image("bg", "assets/skies/deepblue.png");
  }

  create() {
    this.add.image(400, 120, "bg");
  }
}

class maingame{
  constructor(Scene, frames){
    this.deck = new Deck(Scene, frames);
    this.handCard = new HandCard(Scene, this.deck);
    this.Scene = Scene
    console.log("problem")

  }

  handleplaycard(){
    const selectCard = this.handCard.playCard();
    const numCards = selectCard.length;
    selectCard.sort((a, b) => a.face - b.face);
    const isFlush = selectCard.every(card => card.suit === selectCard[0].suit);
    const faceValues = selectCard.map(card => card.face);
    const uniqueFaceValues = new Set(faceValues);

    // 判斷是否為同花順
    const isStraightFlush = isFlush && isConsecutive(faceValues);

    // 判斷是否為四條
    const isFourOfAKind = uniqueFaceValues.size === numCards - 1 &&
        (faceValues[0] === faceValues[1] || faceValues[numCards - 2] === faceValues[numCards - 1]);

    // 判斷是否為葫蘆
    const isFullHouse = uniqueFaceValues.size === 2 &&
        ((faceValues[0] === faceValues[2] && faceValues[numCards - 2] === faceValues[numCards - 1]) ||
            (faceValues[0] === faceValues[1] && faceValues[numCards - 3] === faceValues[numCards - 1]));

    // 判斷是否為同花
    const isFlushOnly = isFlush && !isConsecutive(faceValues);

    // 判斷是否為順子
    const isStraightOnly = !isFlush && isConsecutive(faceValues);

    // 判斷是否為三條
    const isThreeOfAKind = uniqueFaceValues.size === numCards - 2 &&
        (faceValues[0] === faceValues[2] || faceValues[1] === faceValues[3] ||
            faceValues[numCards - 3] === faceValues[numCards - 1]);

    // 判斷是否為兩對
    const isTwoPair = uniqueFaceValues.size === numCards - 2 && !isThreeOfAKind;

    // 判斷是否為一對
    const isOnePair = uniqueFaceValues.size === numCards - 3;

    if (isStraightFlush) {
        return "Straight Flush";
    } else if (isFourOfAKind) {
        return "Four of a Kind";
    } else if (isFullHouse) {
        return "Full House";
    } else if (isFlushOnly) {
        return "Flush";
    } else if (isStraightOnly) {
        return "Straight";
    } else if (isThreeOfAKind) {
        return "Three of a Kind";
    } else if (isTwoPair) {
        return "Two Pair";
    } else if (isOnePair) {
        return "One Pair";
    } else {
        return "High Card";
    }
  }
}

function isConsecutive(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i + 1] - arr[i] !== 1) {
      return false;
    }
  }
  return true;
}

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 700,
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
