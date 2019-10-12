import { Entity, EntityConfig } from './Entity';
import { Global } from './Global';

export interface TextConfig extends EntityConfig {
  font?: {
    family?: string;
    size?: string;
    align?: string;
    baseline?: string;
    lineHeight?: number;
  }
  text?: string;
}

export class Text<Config extends TextConfig = TextConfig> extends Entity<Config> {

  constructor(config: Config) {
    super(config);
  }

  static create(config: TextConfig): Text<TextConfig> {
    return new Text(config);
  }

  render(ctx: CanvasRenderingContext2D) {

    this.config.x = this.config.x || 0;
    this.config.y = this.config.y || 0;
    this.config.color = this.config.color || 'black';
    this.config.font = this.config.font || {};
    this.config.text = this.config.text || 'sample';
    this.config.font.family = this.config.font.family || 'Roboto';
    this.config.font.size = this.config.font.size || '13px';
    this.config.font.align = this.config.font.align || 'top';
    this.config.font.baseline = this.config.font.baseline || 'top';
    this.config.font.lineHeight = this.config.font.lineHeight || 1;

    ctx.save();
    ctx.beginPath();

    ctx.font = this.config.font.size + ' ' + this.config.font.family;
    
    this.config.width = ctx.measureText(this.config.text).width;
    this.config.height = parseInt(ctx.font) * this.config.font.lineHeight;

    const center = this.getCenter();

    ctx.translate(center.x, center.y - this.config.height);
    ctx.rotate(this.config.angle * Math.PI / 180);
    ctx.translate(-center.x, -(center.y - this.config.height));

    if (Global.DEBUG) {
      ctx.strokeStyle = 'blue';
      ctx.strokeRect(this.config.x, this.config.y - this.config.height, this.config.width, this.config.height);
    }

    ctx.fillStyle = this.config.color;
    ctx.textAlign = this.config.align;
    ctx.textBaseline = this.config.baseline;
    ctx.fillText(this.config.text, this.config.x, this.config.y);
    ctx.fill();

    ctx.closePath();
    ctx.restore();
  }
}
