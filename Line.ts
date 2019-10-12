import { Entity, EntityConfig } from './Entity';

export interface LineConfig extends EntityConfig {
  points: Array<Array<number>>;
}

export class Line<Config extends LineConfig = LineConfig> extends Entity<Config> {

  constructor(config: Config) {
    super(config);
  }

  static create(config: LineConfig): Line<LineConfig> {
    return new Line(config);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();

    for (let i = 0; i < this.config.points.length; i++) {
      const [x, y] = this.config.points[i];

      if (i > 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.moveTo(x, y);
      }
    }

    ctx.lineWidth = this.config.width || .5;
    ctx.strokeStyle = this.config.color || 'grey';

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}
