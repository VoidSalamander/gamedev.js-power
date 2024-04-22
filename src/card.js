class Cards {
    constructor(scene) {
        this.scene = scene;
        this.cards = [];
        this.isSelected = {};
    }
    createCards(texture, frames) {
        // Get card frames (if not provided as arguments)
        if (!frames) {
          frames = this.scene.textures.get(texture).getFrameNames();
        }
    
        // Create and initialize cards
        for (var i = 0; i < 16; i++) {
          const card = this.scene.add.sprite(0, 0, texture, Phaser.Math.RND.pick(frames));
          this.cards.push(card);
          card.setInteractive();
          this.addCardInteractions(card);
          this.isSelected[card.texture.key] = false; // Initialize selection state
        }
    
        // Re-align cards in grid (optional, can be handled in the scene)
        Phaser.Actions.GridAlign(this.cards, {
          width: 8,
          height: 2,
          cellWidth: 80,
          cellHeight: 220,
          x: 50,
          y: 80,
        });
      }
    
      addCardInteractions(card) {
        card.on('pointerover', this.handleHover.bind(this, card));
        card.on('pointerout', this.handleHoverOut.bind(this, card));
        card.on('pointerdown', this.handleCardClick.bind(this, card));
      }
    
      handleHover(card) {
        card.y -= 10;
      }
    
    handleHoverOut(card) {
        if (!this.isSelected[card.texture.key]) {
            card.y += 10;
        }
    }
    
    handleCardClick(card) {
        console.log(card.frame.name);
        this.isSelected[card.texture.key] = !this.isSelected[card.texture.key];
    
        if (this.isSelected[card.texture.key]) {
            card.y -= 10;
        } else {
            card.y += 10;
        }
    }
}
export default Cards;
