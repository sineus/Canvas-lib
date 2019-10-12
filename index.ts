// Import stylesheets
import './style.css';

import { Scene, SceneConfig } from './Scene';
import { Box, BoxConfig } from './Box';
import { Line, LineConfig } from './Line';
import { Text, TextConfig } from './Text';
import { Transform } from './Types';

const scene: Scene = Scene.create(<SceneConfig>{
  container: document.querySelector('canvas'),
  width: 800,
  height: 600
});

const PADDING = 40;

const controls = {
  angle: 0,
  x: PADDING,
  y: PADDING,
  angleText: 0
};

const container = scene.getContainer();
const ctx = scene.getContext();

// Create horizontal box
/* const artboard: Box = Box.create(<BoxConfig>{
  x: PADDING / 3, 
  y: PADDING / 3, 
  width: 500, 
  height: 500, 
  color: 'white',
  shadow: {
    color: 'black',
    blur: 10,
    offsetX: 0,
    offsetY: 4
  }
});

scene.add(artboard); */

// Create horizontal box
const boxH: Box = Box.create(<BoxConfig>{
  x: controls.x, 
  y: controls.y, 
  width: 50, 
  height: 50, 
  color: 'red', 
  angle: controls.angle
});

// Create vertical box
const boxV: Box = Box.create(<BoxConfig>{
  x: controls.x, 
  y: controls.y, 
  width: 50, 
  height: 50, 
  color: 'red', 
  angle: controls.angle
});

const sceneRect = scene.getClientRect();

// Create middle box
const boxM: Box = Box.create(<BoxConfig>{
  x: sceneRect.width / 2, 
  y: sceneRect.height / 2, 
  width: 50, 
  height: 50, 
  color: 'green', 
  angle: 0
});

// Drawing horizontal line
const lineH: Line = Line.create(<LineConfig>{
  points: [
    [PADDING, PADDING],
    [400, PADDING]
  ]
});

// Drawing vertical line
const lineV: Line = Line.create(<LineConfig>{
  points: [
    [PADDING, PADDING],
    [PADDING, 400]
  ]
});

// Drawing vertical text
const textV: Text = Text.create(<TextConfig>{
  color: 'black',
  text: 'Rect A'
});

// Drawing horizontal text
const textH: Text = Text.create(<TextConfig>{
  color: 'black',
  text: 'Rect B'
});

const text: Text = Text.create(<TextConfig>{
  color: 'black',
  text: '0, 0',
  x: 15,
  y: 30
});

for (let i = 0; i < 37; i++) { 
  const line: Line = Line.create(<LineConfig>{
    points: [
      [30, PADDING + (i * 10)],
      [PADDING, PADDING + (i * 10)]
    ],
    color: 'black'
  });

  scene.add(line);
}

for (let i = 0; i < 37; i++) { 
  const text: Text = Text.create(<TextConfig>{
    font: 'Roboto 10px',
    color: 'black',
    text: (i * 15).toString(),
    x: 37 + (i * 15),
    y: 25,
  });

  const line: Line = Line.create(<LineConfig>{
    points: [
      [PADDING + (i * 10), 30],
      [PADDING + (i * 10), PADDING]
    ],
    color: 'black'
  });

  scene.add(line);
}

scene
  .add(boxH)
  .add(text)
  .add(boxV)
  // .add(text)
  .add(lineH)
  .add(lineV)
  .add(boxM);

boxH.add(textH);
boxV.add(textV);

container.style.backgroundColor = 'white';

const props = ['x', 'y', 'width', 'height', 'angle'];

const wrapper = document.querySelector('#controls-wrapper');
const controlledNode = boxM;

if (wrapper) {
  for (const prop of props) {

    
    const control = document.createElement('div');
    control.className = 'control';

    const input = document.createElement('input');
    input.type = 'number';
    input.step = '5';
    input.id = prop;

    const label = document.createElement('label');
    label.textContent = prop.substr(0, 1);

    input.value = controlledNode.getProp(prop);

    input.onchange = (evt: InputEvent) => {
      controlledNode.setProp(prop, +evt.target.value);
      scene.render();
    };

    control.appendChild(label);
    control.appendChild(input);
    wrapper.appendChild(control);
  }
}

let scale = 1;

// Zoom
/* document.body.onwheel = (e) => {
  e.preventDefault();
  let previousScale = scale;
  
  // calculate scale direction 6 new scale value
  let direction = e.deltaY > 0 ? 1 : -1;

  scale += .03 * direction;

  // calculate the new scroll values
  scrollX += ( e.offsetX / previousScale )  - (e.offsetX  / scale);
  scrollY += ( e.offsetY / previousScale ) - ( e.offsetY / scale);
  
  // apply new scale in a non acumulative way
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(scale, scale);

  scene.debounceRender();
} */

scene.render();

function loop() {

  // Increment controls
  if (controls.x > 350) {
    controls.x = PADDING;
  } else {
    controls.x += 1;
  }

  if (controls.y > 350) {
    controls.y = PADDING;
  } else {
    controls.y += 1;
  }

  controls.angle += 1;
  controls.angleText -= 1.5;

  // Transform boxs
  boxH.transform(<Transform>{
    x: controls.x,
    angle: controls.angle
  });

  boxV.transform(<Transform>{
    y: controls.y,
    angle: controls.angle
  });

  textV.transform(<Transform>{
    angle: controls.angleText
  });

  /* textV.setProp('text', `
    x: ${boxV.config.x}
    y: ${boxV.config.y}
    angle: ${boxV.config.angle}
  `); */

  /* textH.setProp('text', `
    x: ${boxH.config.x}
    y: ${boxH.config.y}
    angle: ${boxH.config.angle}
  `); */

  // Render
  scene.render();

  // Start loop
  requestAnimationFrame(loop);
}

loop();



//scene.render();