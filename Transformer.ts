import { Entity, EntityConfig } from './Entity';
import { Box, BoxConfig } from './Box';

export interface TransformerConfig extends EntityConfig {
  anchorSize?: number;
}

export class Transformer<Config extends TransformerConfig = TransformerConfig> extends Entity<Config> {

  private ANCHOR_SIZE = 6;
  private anchors: Array<Entity> = [];

  entity: Entity;

  constructor(config: Config) {
    super(config);

    if (config.anchorSize) {
      this.ANCHOR_SIZE = config.anchorSize;
    }
  }

  static create(config: TransformerConfig): Transformer<TransformerConfig> {
    return new Transformer(config);
  }

  attachTo(entity: Entity) {
    this.entity = entity;
  }

  /* createAnchor(entity: Entity, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.beginPath();

    
    ctx.closePath();
    ctx.restore();
  } */

  render(ctx: CanvasRenderingContext2D) {
    if (!this.entity) {
      return;
    }
    
    ctx.save();
    ctx.beginPath();


    const positions = [
      {
        x: this.entity.config.x - this.ANCHOR_SIZE / 2,
        y: this.entity.config.y - this.ANCHOR_SIZE / 2
      },
      {
        x: this.entity.config.x + this.entity.config.width - this.ANCHOR_SIZE / 2,
        y: this.entity.config.y - this.ANCHOR_SIZE / 2
      },
      {
        x: this.entity.config.x + this.entity.config.width - this.ANCHOR_SIZE / 2,
        y: this.entity.config.y + this.entity.config.height - this.ANCHOR_SIZE / 2
      },
      {
        x: this.entity.config.x - this.ANCHOR_SIZE / 2,
        y: this.entity.config.y + this.entity.config.height - this.ANCHOR_SIZE / 2
      }
    ];

    for (let i = 0; i < positions.length; i++) {
      /* ctx.rect(
        positions[i].x, 
        positions[i].y, 
        this.ANCHOR_SIZE, 
        this.ANCHOR_SIZE
      );

      ctx.stroke();
      ctx.fill(); */
      const box = Box.create(<BoxConfig>{
        x: positions[i].x, 
        y: positions[i].y, 
        width: this.ANCHOR_SIZE, 
        height: this.ANCHOR_SIZE, 
        color: 'white', 
        stroke: {
          color: 'grey',
          width: 2
        },
        angle: 0
      });

      box.render(ctx);
    }

    


    //this.createAnchor(this.entity, ctx);

    /* for (let i = 0; i < this.config.points.length; i++) {
      const [x, y] = this.config.points[i];

      if (i > 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.moveTo(x, y);
      }
    }

    ctx.lineWidth = this.config.width || .5;
    ctx.strokeStyle = this.config.color || 'grey'; */

    // ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}
