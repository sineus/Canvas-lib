import { Entity, EntityConfig } from './Entity';
import { Box, BoxConfig } from './Box';
import { Vector2d } from './Types';

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
    this.entity.add(this);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.entity) {
      return;
    }

    ctx.beginPath();

    const center: Vector2d = this.entity.getCenter();

    const dummy = Box.create(<BoxConfig>{
      x: this.entity.config.x,
      y: this.entity.config.y,
      width: this.entity.config.width,
      height: this.entity.config.height,
      color: 'transparent',
      angle: this.entity.config.angle,
      stroke: {
        color: 'red',
        width: 1
      }
    });

    const positions = this.getEntityRect(this.entity);

    dummy.render(ctx, false);

    for (let i = 0; i < positions.length; i++) {
      const anchor = Box.create(<BoxConfig>{
        x: positions[i].x, 
        y: positions[i].y, 
        width: this.ANCHOR_SIZE, 
        height: this.ANCHOR_SIZE, 
        color: 'white', 
        stroke: {
          color: 'red',
          width: 2
        },
        angle: 0
      });

      anchor.render(ctx);
      this.anchors.push(anchor);
    }

    ctx.closePath();
  }

  getEntityRect(entity: Entity): Array<Vector2d> {
    return [
      {
        x: entity.config.x - this.ANCHOR_SIZE / 2,
        y: entity.config.y - this.ANCHOR_SIZE / 2
      },
      {
        x: entity.config.x + entity.config.width - this.ANCHOR_SIZE / 2,
        y: entity.config.y - this.ANCHOR_SIZE / 2
      },
      {
        x: entity.config.x + entity.config.width - this.ANCHOR_SIZE / 2,
        y: entity.config.y + entity.config.height - this.ANCHOR_SIZE / 2
      },
      {
        x: entity.config.x - this.ANCHOR_SIZE / 2,
        y: entity.config.y + entity.config.height - this.ANCHOR_SIZE / 2
      }
    ];
  }
}
