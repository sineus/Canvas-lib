import { Entity, EntityConfig } from './Entity';
import { Vector2d } from './Types';

export interface SceneConfig {
  container: HTMLCanvasElement;
  width: number;
  height: number;
}

export class Scene<Config extends SceneConfig = SceneConfig> {
  private _renderQueue: Array<Function> = [];
  private _ctx: CanvasRenderingContext2D;
  private _container: HTMLCanvasElement;
  private _entities = [];
  private _ratio: number;

  constructor(private config: Config) {
    this._ctx = config.container.getContext('2d'); // , {alpha: false}
    this._container = config.container;

    config.container.width = config.width;
    config.container.height = config.height;

    this._ctx.imageSmoothingEnabled = true;

    this._ratio = (window.devicePixelRatio || 1) / 1;

    if (this._ratio > 1) {
      config.container.style.height = config.container.height + 'px';
      config.container.style.width = config.container.width + 'px';
      config.container.width *= this._ratio;
      config.container.height *= this._ratio;

      this._ctx.scale(this._ratio, this._ratio)
    }
  }

  static create(config: SceneConfig): Scene {
    return new Scene(config);
  }

  public add(entity: Entity): Scene {
    this._entities.push(entity);
    return this;
  }

  public render(): void {
    this._ctx.clearRect(0, 0, window.innerWidth * this._ratio, window.innerHeight * this._ratio);

    for (let i = 0; i < this._entities.length; i++) {
      const entity: Entity = this._entities[i];
      entity.render(this._ctx);

      for (const child of entity.getChildren()) {
        child.config.x = entity.config.x;
        child.config.y = entity.config.y;
        
        child.render(this._ctx);
      }
    }
  }

  public debounceRender() {
    this._requestAnimFrame(() => this.render());
  }

  public getContainer(): HTMLCanvasElement {
    return this._container;
  }

  public getContext(): CanvasRenderingContext2D {
    return this._ctx;
  }

  public getRatio() {
    return this._ratio;
  }

  public getClientRect() {
    return {
      x: 0,
      y: 0,
      width: this._container.width / this._ratio,
      height: this._container.height / this._ratio
    }
  }

  private _requestAnimFrame(callback: Function): void {

    this._renderQueue.push(callback);
    if (this._renderQueue.length === 1) {

      requestAnimationFrame(() => {
        const queue = this._renderQueue;
        this._renderQueue = [];

        queue.forEach((cb) => {
          cb();
        });
      });
    }
  }
}