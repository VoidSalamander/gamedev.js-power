class Cards extends Phaser.GameObjects.Sprite {
    constructor(scene, frame, texture) {
      super(scene, 0, 0, frame, texture);
      this.isSelected = false;
      this.setInteractive();
      this.on('pointerover', this.handleHover.bind(this));
      this.on('pointerout', this.handleHoverOut.bind(this));
      this.on('pointerdown', this.handleCardClick.bind(this));
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
      console.log(this.frame.name);
      this.isSelected = !this.isSelected;
      if (this.isSelected) {
        this.y -= 15;
      } else {
        this.y += 15;
      }
    }
  }
  
  export default Cards;
