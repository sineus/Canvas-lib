import { Entity, EntityConfig } from './Entity';

export interface TransformerConfig extends EntityConfig {
  
}

export class Transformer<Config extends TransformerConfig = TransformerConfig> extends Entity<Config> {

  entity: Entity;

  constructor(config: Config) {
    super(config);
  }

  static create(config: TransformerConfig): Transformer<TransformerConfig> {
    return new Transformer(config);
  }

  attachTo(entity: Entity) {
    this.entity = entity;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.entity) {
      return;
    }
    
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
