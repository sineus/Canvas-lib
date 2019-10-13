import { Vector2d, Transform } from './Types';

export class EntityConfig {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  angle?: number;
  shadow?: {
    color?: string;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
  };
  stroke?: {
    width?: number;
    color?: string;
  };

  force?: Vector2d = {
    x: 0,
    y: 0
  };

  mass?: number = 0.001;
  isStatic?: boolean = true;
  angularVelocity?: number = 0;
  previousAngle?: number = 0;
  velocity?: Vector2d = {
    x: 0,
    y: 0
  };

  torque: number = 0;
  inertia: number = 0;

  previousPosition?: Vector2d = {
    x: 0,
    y: 0
  };

  timeScale?: number = 1;
}


export abstract class Entity<Config extends EntityConfig = EntityConfig> {
  private _config: Config;
  private _children: Array<Entity> = [];
  private _parent: Entity;

  constructor(config: Config) {
    config.previousPosition = {
      x: config.x,
      y: config.y
    };

    this._config = {...new EntityConfig(), ...config};
  }

  abstract render(ctx: CanvasRenderingContext2D, newContext?: boolean): void;

  public get config(): Config {
    return this._config;
  }

  public getCenter(): Vector2d {
    return {
      x: this._config.x + this._config.width / 2, 
      y: this._config.y + this._config.height / 2
    }
  } 

  public transform(transform: Transform): void {
    this._config = {
      ...this._config, 
      ...transform
    };
  }

  public getProp(key: string): any {
    return this._config[key];
  }

  public setProp(key: string, value: any): void {
    this._config[key] = value;
  }

  public add(entity: Entity): Entity {
    entity._parent = this;
    this._children.push(entity);
    return this;
  }

  public getChildren(): Array<Entity> {
    return this._children;
  }
}