import { Entity, EntityConfig } from './Entity';

export interface BoxConfig extends EntityConfig {}

export class Box<Config extends BoxConfig = BoxConfig> extends Entity<Config> {

  constructor(config: Config) {
    super(config);
  }

  static create(config: BoxConfig): Box<BoxConfig> {
    return new Box(config);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const center = this.getCenter();

    ctx.translate(center.x, center.y);
    ctx.rotate(this.config.angle * Math.PI / 180);
    ctx.translate(-center.x, -center.y);

    ctx.beginPath();

    if (this.config.shadow) {
      ctx.shadowColor = this.config.shadow.color;
      ctx.shadowBlur = this.config.shadow.blur;
      ctx.shadowOffsetX = this.config.shadow.offsetX;
      ctx.shadowOffsetY = this.config.shadow.offsetY;
    }

    ctx.fillStyle = this.config.color;
    ctx.rect(this.config.x, this.config.y, this.config.width, this.config.height);
    ctx.fill();

    ctx.closePath();
    ctx.restore();
  }
}