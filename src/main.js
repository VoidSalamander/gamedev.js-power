import { Deck, HandCard, Cards } from "./card.js";
class main extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.setBaseURL("../assets/");
    this.load.image("buttonImage", "playbutton.png");
    this.load.atlas("cards", "carddata.png", "carddata.json");
    this.load.atlas("icons", "icondata.png", "icondata.json");
  }

  create() {
    const frames = this.textures.get("cards").getFrameNames();
    this.cardSelected = 0;

    this.maingame = new maingame(this, frames);

    const destroybutton = this.add.image(880, 580, "buttonImage");
    destroybutton.setInteractive();
    destroybutton.on(
      "pointerdown",
      () => {
        if (this.cardSelected != 0) {
          this.currentSetText.setText(this.maingame.handleplaycard());
        }
      },
      this
    );

    /*state board*/
    this.currentSetText = this.add.text(50, 50, "Made by VoidSalamander", {
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

    /*resource board*/
    this.ResourceText = [];
    for (var i = 0; i < 7; i++) {
      this.ResourceText[i] = this.add.text(
        50,
        160 + i * 30,
        "Lv." +
          this.maingame.BuildingLevel.get(this.maingame.ResourceList[i]) +
          " " +
          this.maingame.ResourceList[i] +
          ": " +
          this.maingame.Resource.get(this.maingame.ResourceList[i]),
        {
          font: "24px Arial",
          fill: "#ffffff",
        }
      );
    }

    this.mainText = [];
    for (var i = 0; i < 2; i++) {
      this.mainText[i] = this.add.text(50, 400 + i * 30, "HHH", {
        font: "24px Arial",
        fill: "#ffffff",
      });
    }
    this.HandlemainText(
      "Thank you for playing this simple card game.",
      "Play four of a kind to achieve the first milestone."
    );
  }

  HandlemainText(str1, str2) {
    this.mainText[0].setText(str1);
    this.mainText[1].setText(str2);
  }

  HandleResourceText() {
    for (var i = 0; i < 7; i++) {
      this.ResourceText[i].setText(
        "Lv." +
          this.maingame.BuildingLevel.get(this.maingame.ResourceList[i]) +
          " " +
          this.maingame.ResourceList[i] +
          ": " +
          this.maingame.Resource.get(this.maingame.ResourceList[i])
      );
    }
  }
}

class maingame {
  constructor(Scene, frames) {
    this.current_level = 1;
    this.DisasterCount = 0;
    this.DisasterMaximum = 5;

    /*Building*/
    this.BuildingLevel = new Map([
      ["wood", 0],
      ["stone", 0],
      ["food", 0],
      ["people", 0],
      ["crystal", 0],
      ["force", 0],
      ["belief", 0],
    ]);
    /*Building End*/

    /*resource*/
    this.Resource = new Map([
      ["wood", 5],
      ["stone", 5],
      ["food", 10],
      ["people", 10],
      ["crystal", 30],
      ["force", 1],
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
    ];
    /*resource*/

    this.deck = new Deck(Scene, frames);
    this.handCard = new HandCard(Scene, this.deck);
    this.Scene = Scene;
  }

  handleplaycard() {
    const selectCard = this.handCard.playCard();
    const numCards = selectCard.length;
    /*Disater*/
    this.DisasterCount++;
    if (this.DisasterCount === this.DisasterMaximum) {
      this.getNewCard("disaster", this.current_level);
      this.DisasterCount = 0;
    }
    this.Scene.DisasterCountText.setText(
      "Disaster: " + this.DisasterCount + "/" + this.DisasterMaximum
    );
    const isDisaster = selectCard.some((card) => card.suit === "disaster");
    /*Disater End*/
    
    /*Round thing*/
    this.ResourceModify("crystal", -numCards)

    

    if(this.Resource.get("crystal") == 0 || this.Resource.get("people") == 0){
      endgame();
    }

    /*thing End */
    selectCard.sort((a, b) => a.face - b.face);
    const isFlush = selectCard.every(
      (card) => card.suit === selectCard[0].suit
    );
    const faceValues = selectCard.map((card) => card.face);
    const uniqueFaceValues = new Set(faceValues);

    // 判斷是否為同花順
    const isStraightFlush = isFlush && isConsecutive(faceValues);

    // 判斷是否為四條
    const isFourOfAKind = uniqueFaceValues.size == 1 && numCards >= 4;

    // 判斷是否為葫蘆
    const isFullHouse =
      uniqueFaceValues.size === 2 &&
      ((faceValues[0] === faceValues[2] &&
        faceValues[numCards - 2] === faceValues[numCards - 1]) ||
        (faceValues[0] === faceValues[1] &&
          faceValues[numCards - 3] === faceValues[numCards - 1]));

    // 判斷是否為同花
    const isFlushOnly = isFlush && !isConsecutive(faceValues);

    // 判斷是否為順子
    const isStraightOnly = !isFlush && isConsecutive(faceValues);

    // 判斷是否為三條
    const isThreeOfAKind =
      uniqueFaceValues.size === numCards - 2 &&
      (faceValues[0] === faceValues[2] ||
        faceValues[1] === faceValues[3] ||
        faceValues[numCards - 3] === faceValues[numCards - 1]);

    // 判斷是否為兩對
    const isTwoPair = uniqueFaceValues.size === numCards - 2 && !isThreeOfAKind;

    // 判斷是否為一對
    const isOnePair = uniqueFaceValues.size === numCards - 3;
    if (isDisaster){
      this.Scene.HandlemainText(
        "Disaster has struck: Sorry, this feature is still under development.",
        "It will currently delete the disaster card along with any other played cards."
      );
      console.log("Disaster")
      return "Disaster";
    }
    if (isStraightFlush) {
      return "Straight Flush";
    } else if (isFourOfAKind) {
      this.Scene.HandlemainText(
        "Four Of A Kind!!",
        "You'll get four advanced basic cards and select one power to develop"
      );
      this.HandleFourOfAKind(selectCard[0]);
      return "Four of a Kind";
    } else if (isFullHouse) {
      this.Scene.HandlemainText(
        "FullHouse!!",
        "You can upgrade one type of card."
      );
      this.HandleStraight(selectCard);
      return "Full House";
    } else if (isFlushOnly) {
      this.Scene.HandlemainText(
        "Flush!",
        "You can obtain all the resources and advanced cards."
      );
      this.HandleFlush(selectCard);
      return "Flush";
    } else if (isStraightOnly) {
      this.Scene.HandlemainText(
        "Straight!",
        "You can obtain all the resources"
      );
      HandleStraight(selectCard);
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

  refillhand() {
    this.handCard.refillhand();
  }

  getNewCard(suit, face) {
    this.deck.createCard(getCardframe(suit, face));
  }

  HandleFourOfAKind(card) {
    this.Scene.scene.add(
      "NewScene",
      new NewScene(this.Scene, this, card.face, "getcard"),
      this
    );
    if (card.face >= this.current_level) {
      this.current_level++;
      this.Scene.currentLevelText.setText(
        "Current Level: " + this.current_level
      );
      this.getNewCard("people", this.current_level);
      this.getNewCard("crystal", this.current_level);
      this.getNewCard("food", this.current_level);
      if (this.current_level % 2 === 0) {
        this.getNewCard("wood", this.current_level);
      } else {
        this.getNewCard("stone", this.current_level);
      }
    }
  }

  HandleFullHouse(selectCard) {
    this.Scene.scene.add(
      "NewScene",
      new NewScene(this.Scene, this, selectCard, "upgrade"),
      this
    );
  }

  HandleFlush(selectCard) {
    selectCard.forEach((card) => {
      if (this.Resource.has(card.suit)) {
        this.ResourceModify(card.suit, card.face)
      }
    });
    this.getNewCard(selectCard[0].suit, this.current_level + 1);
  }

  HandleStraight(selectCard) {
    selectCard.forEach((card) => {
      if (this.Resource.has(card.suit)) {
        this.ResourceModify(card.suit, card.face)
      }
    });
  }

  ResourceModify(suit, num) {
    this.Resource.set(suit, this.Resource.get(suit) + num);
    this.Scene.HandleResourceText();
  }

  endgame(){
    
  }
}

/**
 * Type:upgrade, getcard
 *
 */

class NewScene extends Phaser.Scene {
  constructor(Scene, maingame, selectCard, type) {
    super({ key: "NewScene" });
    this.selectCard = selectCard;
    this.Scene = Scene;
    this.type = type;
    this.maingame = maingame;
  }

  preload() {
    this.load.setBaseURL("../assets/");
    this.load.atlas("cards", "carddata.png", "carddata.json");
  }

  create() {
    const frames = this.textures.get("cards").getFrameNames();

    const buttons = [];
    const introText = this.add.text(570, 50, "", {
      font: "36px Arial",
      fill: "#ffffff",
    });

    if (this.type == "getcard") {
      introText.setText("Choose one power");
      buttons.push(
        this.add
          .image(
            610,
            200,
            "cards",
            frames[
              frames.indexOf(
                "Cards-" + getCardframe("force", this.selectCard) + ".png"
              )
            ]
          )
          .setInteractive(),
        this.add
          .image(
            740,
            200,
            "cards",
            frames[
              frames.indexOf(
                "Cards-" + getCardframe("belief", this.selectCard) + ".png"
              )
            ]
          )
          .setInteractive(),
        this.add
          .image(
            870,
            200,
            "cards",
            frames[
              frames.indexOf(
                "Cards-" + getCardframe("research", this.selectCard) + ".png"
              )
            ]
          )
          .setInteractive()
      );
    } else if (this.type == "upgrade") {
      buttons.push(
        this.add
          .image(610, 200, "cards", this.selectCard[0].name)
          .setInteractive(),
        this.add
          .image(740, 200, "cards", this.selectCard[1].name)
          .setInteractive(),
        this.add
          .image(870, 200, "cards", this.selectCard[2].name)
          .setInteractive()
      );
    }

    const buttonindex = ["force", "belief", "research"];

    const buttonindextext = [
      "Increase military power to resist disasters",
      "enhance power of belief for miracles to occur,",
      "boost power of science to steadily become stronger",
    ];

    buttons.forEach((button, index) => {
      button.on("pointerdown", () => {
        buttons.forEach((btn, idx) => {
          if (idx === index) {
            // If the button is selected, scale it up and then destroy
            this.tweens.add({
              targets: btn,
              scaleX: 1.2,
              scaleY: 1.2,
              alpha: 0,
              duration: 700,
              ease: "Power2",
              onComplete: () => {
                if (this.type == "getcard") {
                  this.maingame.getNewCard(buttonindex[index], this.selectCard);
                }
                btn.destroy();
                this.scene.remove();
              },
            });
          } else {
            // If the button is not selected, simply destroy it
            btn.destroy();
          }
        });
      });

      // Add hover effect
      button.on("pointerover", () => {
        this.tweens.add({
          targets: button,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200,
          ease: "Power2",
          onStart: () => {
            if (this.type == "getcard") {
              this.Scene.HandlemainText(
                buttonindex[index],
                buttonindextext[index]
              );
            }
          },
        });
      });

      // Remove hover effect
      button.on("pointerout", () => {
        this.tweens.add({
          targets: button,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: "Power2",
        });
      });
    });
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

function getCardframe(suit, face) {
  const suitsname = [
    "research",
    "wood",
    "crystal",
    "force",
    "food",
    "belief",
    "people",
    "stone",
    "disaster",
  ];
  if (!suitsname.includes(suit) || face < 1 || face > 13) {
    console.warn("Invalid suit or face value");
    return 0;
  }
  const suitIndex = suitsname.indexOf(suit);
  return suitIndex * 13 + (face - 1);
}

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 700,
  backgroundColor: "#2d2d2d",
  parent: "phaser-example",
  scene: main,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
};

const game = new Phaser.Game(config);
