import { Entity, EntityConfig } from './Entity';

export interface BoxConfig extends EntityConfig {}

export class Box<Config extends BoxConfig = BoxConfig> extends Entity<Config> {

  constructor(config: Config) {
    super(config);
  }

  static create(config: BoxConfig): Box<BoxConfig> {
    return new Box(config);
  }

  render(ctx: CanvasRenderingContext2D, newContext: boolean = true): void {
    if (newContext) {
      ctx.save();
    }

    ctx.beginPath();

    const center = this.getCenter();

    ctx.translate(center.x, center.y);
    ctx.rotate(this.config.angle * Math.PI / 180);
    ctx.translate(-center.x, -center.y);


    // Physic zone
    const deltaTimeSquared = Math.pow(1000 / 60 * this.config.timeScale * 1, 2);

    // from the previous step
    const frictionAir = 1 - 0.01 * 1 * 1;
    const velocityPrevX = this.config.x - this.config.previousPosition.x;
    const velocityPrevY = this.config.y - this.config.previousPosition.y;

    // update velocity with Verlet integration
    this.config.velocity.x = (velocityPrevX * frictionAir * 1) + (this.config.force.x / this.config.mass) * deltaTimeSquared;
    this.config.velocity.y = (velocityPrevY * frictionAir * 1) + (this.config.force.y / this.config.mass) * deltaTimeSquared;

    this.config.previousPosition.x = this.config.x;
    this.config.previousPosition.y = this.config.y;
    this.config.x += this.config.velocity.x;
    this.config.y += this.config.velocity.y;

    this.config.angularVelocity = ((this.config.angle - this.config.previousAngle) * frictionAir * 1) + (this.config.torque / this.config.inertia) * deltaTimeSquared;
        this.config.anglePrev = this.config.angle;
        this.config.angle += this.config.angularVelocity;

    if (this.config.shadow) {
      ctx.shadowColor = this.config.shadow.color;
      ctx.shadowBlur = this.config.shadow.blur;
      ctx.shadowOffsetX = this.config.shadow.offsetX;
      ctx.shadowOffsetY = this.config.shadow.offsetY;
    }

    ctx.fillStyle = this.config.color;
    ctx.rect(
      this.config.x, 
      this.config.y, 
      this.config.width, 
      this.config.height
    );

    if (this.config.stroke) {
      ctx.strokeStyle = this.config.stroke.color;
      ctx.lineWidth = this.config.stroke.width;
      ctx.stroke();
    }

    ctx.fill();
    ctx.closePath();

    if (newContext) {
      ctx.restore();
    }
  }
}