class Cards extends Phaser.GameObjects.Sprite {
      constructor(scene, frame, texture) {
        super(scene, 0, 0, frame, texture);
        this.isSelected = false;
        this.name = this.frame.name
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
      this.isSelected = !this.isSelected;
      if (this.isSelected) {
        this.y -= 15;
      } else {
        this.y += 15;
      }
    }
	
	destroy() {
		// Add animation logic with onComplete callback
		this.scene.tweens.add({
		  targets: this,
		  scaleX: 0,
		  scaleY: 0,
		  alpha: 0,
		  ease: 'Power2', // Adjust for desired easing effect
		  duration: 500, // Adjust for desired animation duration
		  onComplete: () => {
			// Remove card from scene after animation
			this.destroy(); // Call the original destroy method, which removes the card
		  }
		});
	  }
      
    cardvalue
  }

  
class Deck{
    deck = [];
    constructor(scene, frames){
        for(var i = 1; i < frames.length-1; i++) {
            const temp = new Cards(scene, 'cards', frames[i]);
            this.deck.push(temp);
        }
    }

    drawCard(){
        if(!this.deck.length){
            console.warn("deck empty")
            return null
        } else {
            const temp = Phaser.Math.RND.pick(this.deck);
            removeItemOnce(this.deck, temp)
            return temp
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
  
  export default Deck;
