import { Entity, EntityConfig } from './Entity';
import { Scene } from './Scene';

export interface ControllerConfig {
  entity: Entity;
  container: HTMLDivElement;
  scene: Scene;
  props?: Array<string>;
}
export class Controller<Config extends ControllerConfig = ControllerConfig> {
  private entity: Entity;
  private container: HTMLDivElement;
  private scene: Scene;
  private props: Array<string> = ['x', 'y', 'width', 'height', 'angle'];
  private controls: Map<string, HTMLInputElement> = new Map();

  constructor(config: Config) {
    this.entity = config.entity;
    this.container = config.container;
    this.scene = config.scene;

    if (config.props) {
      this.props = config.props;
    }
   }

  public update(entity: Entity) {
    this.controls.forEach((control: HTMLInputElement, key: string) => {
      if (entity.config[key]) {
        control.value = entity.config[key];
      }
    })
  }

  public static create(config: ControllerConfig): Controller<ControllerConfig> {
    const controller = new Controller(config);

    if (controller.container) {
      for (const prop of controller.props) {

        
        const control = document.createElement('div');
        control.className = 'control';

        const input = document.createElement('input');
        input.type = 'number';
        input.step = '5';
        input.id = prop;

        const label = document.createElement('label');
        label.textContent = prop.substr(0, 1);

        input.value = controller.entity.getProp(prop);

        input.onchange = (evt: InputEvent) => {
          controller.entity.setProp(prop, +evt.target.value);
          controller.scene.render();
        };

        control.appendChild(label);
        control.appendChild(input);

        controller.container.appendChild(control);
        controller.controls.set(prop, input);
      }
    }

    return controller;
  }
}