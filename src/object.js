class BouncingObject {
  constructor(scene, x, y, imageKey, maxBounces = 3) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.imageKey = imageKey;
    this.maxBounces = maxBounces;

    this.createSprite();
    this.configurePhysics();
    this.setupBounceBehavior();
  }

  createSprite() {
    this.sprite = new Phaser.GameObjects.Sprite(this.scene, this.x, this.y, this.imageKey);
    this.scene.add.existing(this.sprite);
  }

  configurePhysics() {
    this.scene.physics.add.body(this.sprite, { bounce: 0.8 });
    this.sprite.setVelocityX(-100, 0);
  }

  setupBounceBehavior() {
    this.bounces = 0;

    this.scene.physics.world.on('collide', this.onWorldBoundsCollision, this);
  }

  onWorldBoundsCollision() {
    this.bounces++;
    if (this.bounces >= this.maxBounces || this.sprite.x < this.scene.physics.world.bounds.left) {
      this.sprite.destroy();
    } else {
      this.sprite.setVelocityX(100, 0);
    }
  }
}