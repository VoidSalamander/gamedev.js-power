import { Deck, HandCard, Cards } from "./card.js";
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
    this.load.atlas(
      "icons",
      "icondata.png",
      "icondata.json"
    );
  }

  create() {
    const frames = this.textures.get("cards").getFrameNames();
    this.cardSelected = 0;

    const newThingScene = this.scene.add('gameScene', new getNewThing(null, null, null, () => {
      // Callback function to remove gameScene
      this.scene.remove('gameScene');
    }), { visible: true });

    this.maingame = new maingame(this, frames);

    const destroybutton = this.add.image(850, 500, "buttonImage");
    destroybutton.setInteractive();
    destroybutton.on(
      "pointerdown",
      () => {
        this.currentSetText.setText(this.maingame.handleplaycard())
        console.log(this.scene.getStatus("gameScene"))
        this.scene.remove('gameScene');
      },
      this
    );
    
    /*state board*/
    this.currentSetText = this.add.text(50, 50, "Hello World", {
      font: "24px Arial",
      fill: "#ffffff",
    });
    this.currentLevelText = this.add.text(50, 80, "Current Level: " + 1, {
      font: "24px Arial",
      fill: "#ffffff",
    });
    this.DisasterCountText = this.add.text(50, 110, "Disaster: 0/5", {
      font: "24px Arial",
      fill: "#ffffff",
    });

    /*building board*/
    this.buildingLevelText = [];
    for(var i=0;i<8;i++){
      this.buildingLevelText[i] = this.add.text(300, 50+i*30, this.maingame.BuildingList[i] + ": " + this.maingame.BuildingLevel.get(this.maingame.BuildingList[i]), {
        font: "24px Arial",
        fill: "#ffffff",
      });
    }

    /*resource board*/
    this.ResourceText = [];
    for(var i=0;i<7;i++){
      this.ResourceText[i] = this.add.text(50, 160+i*30, this.maingame.ResourceList[i] + ": " + this.maingame.Resource.get(this.maingame.ResourceList[i]), {
        font: "24px Arial",
        fill: "#ffffff",
      });
    }

  }
}

class maingame{
  constructor(Scene, frames){

    this.current_level = 1;
    this.DisasterCount = 0;
    this.DisasterMaximum = 5;

    /*Building*/
    this.BuildingLevel = new Map([
      ["Barracks", 0],
      ["Laboratory", 0],
      ["Church", 0],
      ["Farmland", 0],
      ["Crystal", 0],
      ["City", 0],
      ["Quarry", 0],
      ["Lumberyard", 0],
    ]);
    this.BuildingList = [
      "Barracks",
      "Laboratory",
      "Church",
      "Farmland",
      "Crystal",
      "City",
      "Quarry",
      "Lumberyard",
    ]
    /*Building End*/

    /*resource*/
    this.Resource = new Map([
      ["wood", 0],
      ["stone", 0],
      ["food", 0],
      ["people", 0],
      ["crystal", 0],
      ["force", 0],
      ["belief", 0],
    ]);
    this.ResourceList = [
      "wood",
      "stone",
      "food",
      "people",
      "crystal",
      "force",
      "belief",
    ]
    /*resource*/

    this.deck = new Deck(Scene, frames);
    this.handCard = new HandCard(Scene, this.deck);
    this.Scene = Scene
  }

  handleplaycard(){

    /*Disater*/
    this.DisasterCount++;
    if (this.DisasterCount === this.DisasterMaximum){
      this.getNewCard("disaster" ,this.current_level);
      this.DisasterCount = 0;
    }
    this.Scene.DisasterCountText.setText("Disaster: " + this.DisasterCount + "/" + this.DisasterMaximum)
    /*Disater End*/

    

    const selectCard = this.handCard.playCard();
    const numCards = selectCard.length;
    selectCard.sort((a, b) => a.face - b.face);
    const isFlush = selectCard.every(card => card.suit === selectCard[0].suit);
    const faceValues = selectCard.map(card => card.face);
    const uniqueFaceValues = new Set(faceValues);

    // 判斷是否為同花順
    const isStraightFlush = isFlush && isConsecutive(faceValues);

    // 判斷是否為四條
    const isFourOfAKind = (uniqueFaceValues.size == 1) && (numCards >= 4);

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

  refillhand(){
    this.handCard.refillhand();
  }

      },
      this
    );
    const Cbutton = this.add.image(870, 200, "cards", this.cardC.name);
    Cbutton.setInteractive();
    Cbutton.on(
      "pointerdown",
      () => {
        this.Scene.scene.remove('gameScene');
      },
      this
    );*/
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
